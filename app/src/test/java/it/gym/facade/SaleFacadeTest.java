package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.*;
import it.gym.service.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static it.gym.utility.CalendarUtility.getNextMonday;
import static it.gym.utility.Fixture.*;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class SaleFacadeTest {

    @MockBean
    private SaleService saleService;

    @MockBean
    private UserService userService;

    @MockBean
    private PaymentService paymentService;

    @MockBean
    private GymService gymService;

    @MockBean
    private EventService eventService;

    @MockBean
    private ReservationService reservationService;

    @MockBean
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService bundleSpecService;

    @MockBean
    @Qualifier("trainingBundleService")
    private TrainingBundleService bundleService;

    @MockBean
    private SalesLineItemService salesLineItemService;

    @MockBean
    @Qualifier("trainingSessionService")
    private TrainingSessionService sessionService;

    @TestConfiguration
    static class SaleFacadeTestContextConfiguration {

        @Bean
        public SaleFacade saleFacade() {
            return new SaleFacade();
        }
    }

    @Autowired
    private SaleFacade saleFacade;

    @Test
    public void whenCreateSale() {
        Mockito.doAnswer(invocationOnMock -> {
            Sale sale = invocationOnMock.getArgument(0);
            sale.setId(1L);
            return sale;
        }).when(saleService).save(any());
        Mockito.doReturn(createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null)).when(userService).findById(2L);
        Mockito.doReturn(createGym(1L)).when(gymService).findById(1L);
        Sale sale = saleFacade.createSale(2L);
        assertThat(sale.getId()).isEqualTo(1L);
        assertThat(sale.getCustomer()).isEqualTo(createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        assertThat(sale.getAmountPayed()).isEqualTo(0.);
    }

    @Test
    public void addSalesLineItem() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        PersonalTrainingBundleSpecification mockBundleSpec = createPersonalBundleSpec(1L, "personal", options);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockBundleSpec).when(bundleSpecService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItem(1L, 1L, 2L);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getTotalPrice()).isEqualTo(900.0);
    }

    @Test
    public void addCourseBundleToSalesLineItem() {
        Customer customer = createCustomer(1L,
                "customer@customer.com",
                "",
                "customer",
                "customer",
                true,
                null);
        Sale mockSale = createSale(1L, customer);
        double price = 100.0;
        List<APurchaseOption> options = createSingletonTimePurchaseOptions(1, price, null);
        CourseTrainingBundleSpecification bundleSpec = createCourseBundleSpec(1L, "course", 11, options);
        APurchaseOption option = bundleSpec.getOptions().get(0);

        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(bundleSpec).when(bundleSpecService).findById(1L);

        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItem(1L, 1L, option.getId());

        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getTotalPrice()).isEqualTo(price);
    }

    @Test
    public void confirmSale() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", options));

        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.confirmSale(1L);
        assertThat(sale.isCompleted()).isEqualTo(true);
        assertThat(sale.getTotalPrice()).isEqualTo(900.0);
    }

    @Test
    public void deleteSalesLineItem() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        PersonalTrainingBundleSpecification personalBundleSpec = createPersonalBundleSpec(1L, "personal", options);
        SalesLineItem mockSalesLineItem = addSalesLineItem(mockSale, personalBundleSpec);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockSalesLineItem).when(salesLineItemService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.deleteSalesLineItem(1L, 1L);
        Mockito.verify(salesLineItemService).delete(mockSalesLineItem);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(0);
    }

    @Test
    public void deleteSaleById() {
        Customer customer = createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        customer.setTrainingBundles(Collections.emptyList());
        Sale mockSale = createSale(1L, customer);

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        PersonalTrainingBundleSpecification personalBundleSpec = createPersonalBundleSpec(1L, "personal", options);
        addSalesLineItem(mockSale, personalBundleSpec);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test(expected = BadRequestException.class)
    public void deleteSaleByIdNonDeletable() {
        Customer customer = createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        customer.setTrainingBundles(Collections.emptyList());
        Sale mockSale = createSale(1L, customer);

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        PersonalTrainingBundleSpecification bundleSpec = createPersonalBundleSpec(1L, "personal", options);

        addSalesLineItem(mockSale, bundleSpec);
        ATrainingBundle trainingBundle = mockSale.getSalesLineItems().get(0).getTrainingBundle();

        Date start = addDays(getNextMonday(), -8);
        Date end = addHours(start, 1);
        PersonalTrainingEvent event = createPersonalEvent(1L, "personal", start, end);
        ATrainingSession session = trainingBundle.createSession(event);
        trainingBundle.addSession(session);
        session.complete();
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test
    public void paySale() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", options));

        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
        assertThat(sale.getAmountPayed()).isEqualTo(11.0);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleNotCompleted() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", options));

        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleMoreThanNeeded() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", options));

        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 1000.);
    }

    @Test
    public void paySaleExactlyWhatNeeded() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", options));

        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 900.);
        assertThat(sale.getAmountPayed()).isEqualTo(900.0);
        assertThat(sale.getPayedDate()).isNotNull();
        assertThat(sale.isPayed()).isFalse();
    }

    @Test
    public void getTotalPrice() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        PersonalTrainingBundleSpecification personalBundleSpec = createPersonalBundleSpec(1L, "personal", options);
        addSalesLineItem(mockSale, personalBundleSpec);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Sale sale = saleFacade.getTotalPriceBySaleId(1L);
        assertThat(sale.getTotalPrice()).isEqualTo(900.0);
    }

    @Test(expected = BadRequestException.class)
    public void confirmSaleThrowsExceptionWhenEmptySale() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.confirmSale(1L);
    }

    private void mockSaveMethod() {
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(saleService).save(any());
    }

    public static SalesLineItem addSalesLineItem(Sale mockSale, ATrainingBundleSpecification specs) {
        Long optionId = specs.getOptions().get(0).getId();

        ATrainingBundle bundle = specs.createTrainingBundle(optionId);
        return mockSale.addSalesLineItem(bundle);
    }

}
