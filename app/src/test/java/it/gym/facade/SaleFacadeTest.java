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

import java.util.Calendar;
import java.util.Collections;
import java.util.Date;
import java.util.Locale;

import static it.gym.utility.Fixture.*;
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
    private GymService gymService;

    @MockBean
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService bundleSpecService;

    @MockBean
    private TrainingBundleService bundleService;

    @MockBean
    private SalesLineItemService salesLineItemService;

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
        ATrainingBundleSpecification mockBundleSpec = createPersonalBundleSpec(1L, "personal", 11);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockBundleSpec).when(bundleSpecService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItem(1L, 1L);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test
    public void addCourseBundleToSalesLineItem() {
        Date start = getNextMonday();

        AUser customer = createCustomer(1L,
                "customer@customer.com", "",
                "customer", "customer", true, null);
        Sale mockSale = createSale(1L, customer);
        ATrainingBundleSpecification mockBundleSpec = createCourseBundleSpec(1L,
                "course", 11, 1);
        ATrainingBundle bundle = createCourseBundle(1L, start, mockBundleSpec);

        Mockito.doReturn(bundle).when(bundleService).findById(1L);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockBundleSpec).when(bundleSpecService).findById(1L);

        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItemByBundle(1L, 1L);

        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getSalesLineItems().get(0).getTrainingBundle()).isEqualTo(bundle);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test
    public void addCourseBundleToSalesLineItemAlreadyCreated() {
        Date start = getNextMonday();

        AUser customer = createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        Sale mockSale = createSale(1L, customer);

        ATrainingBundleSpecification mockBundleSpec = createCourseBundleSpec(1L,
                "course", 11, 1);
        ATrainingBundle bundle = createCourseBundle(1L, start, mockBundleSpec);
        Mockito.doReturn(bundle).when(bundleService).findById(1L);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockBundleSpec).when(bundleSpecService).findById(1L);

        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItemByBundle(1L, 1L);

        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getSalesLineItems().get(0).getTrainingBundle()).isEqualTo(bundle);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    private static Date getNextMonday() {
        Calendar date = Calendar.getInstance(Locale.ITALIAN);
        date.set(Calendar.HOUR_OF_DAY, 8);
        int diff = Calendar.MONDAY - date.get(Calendar.DAY_OF_WEEK);
        if (diff <= 0) {
            diff += 7;
        }
        date.add(Calendar.DAY_OF_MONTH, diff);
        return date.getTime();
    }

    @Test
    public void confirmSale() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.confirmSale(1L);
        assertThat(sale.isCompleted()).isEqualTo(true);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test
    public void deleteSalesLineItem() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        SalesLineItem mockSalesLineItem = addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockSalesLineItem).when(salesLineItemService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.deleteSalesLineItem(1L, 1L);
        Mockito.verify(salesLineItemService).delete(mockSalesLineItem);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(0);
    }

    @Test
    public void deleteSaleById() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        customer.setCurrentTrainingBundles(Collections.emptyList());
        Sale mockSale = createSale(1L, customer);
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test(expected = BadRequestException.class)
    public void deleteSaleByIdNonDeletable() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        customer.setCurrentTrainingBundles(Collections.emptyList());
        Sale mockSale = createSale(1L, customer);
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        ATrainingBundle trainingBundle = mockSale.getSalesLineItems().get(0).getTrainingBundle();
        ATrainingSession session = trainingBundle.createSession(addHours(new Date(), -2), addHours(new Date(), -1));
        trainingBundle.addSession(session);
        session.complete();
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test
    public void paySale() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
        assertThat(sale.getAmountPayed()).isEqualTo(11.0);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleNotCompleted() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleMoreThanNeeded() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 200.);
        assertThat(sale.getAmountPayed()).isEqualTo(11.0);
    }

    @Test
    public void paySaleExactlyWhatNeeded() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 111.);
        assertThat(sale.getAmountPayed()).isEqualTo(111.0);
        assertThat(sale.getPayedDate()).isNotNull();
        assertThat(sale.isPayed()).isTrue();
    }

    @Test
    public void getTotalPrice() {
        Sale mockSale = createSale(1L, createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null));
        addSalesLineItem(mockSale, createPersonalBundleSpec(1L, "personal", 11));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Sale sale = saleFacade.getTotalPriceBySaleId(1L);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
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
        return mockSale.addSalesLineItem(specs.createTrainingBundle());
    }

}
