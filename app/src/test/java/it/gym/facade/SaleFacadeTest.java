package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.*;
import it.gym.service.*;
import it.gym.utility.Fixture;
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
    public void createSale() {
        Mockito.doAnswer(invocationOnMock -> {
            Sale sale = invocationOnMock.getArgument(0);
            sale.setId(1L);
            return sale;
        }).when(saleService).save(any());
        Mockito.doReturn(Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null)).when(userService).findById(2L);
        Mockito.doReturn(Fixture.createGym(1L)).when(gymService).findById(1L);
        Sale sale = saleFacade.createSale(2L);
        assertThat(sale.getId()).isEqualTo(1L);
        assertThat(sale.getCustomer()).isEqualTo(Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        assertThat(sale.getAmountPayed()).isEqualTo(0.);
    }

    @Test
    public void addSalesLineItem() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        ATrainingBundleSpecification mockBundleSpec = Fixture.createPersonalBundleSpec(1L, "personal");
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockBundleSpec).when(bundleSpecService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItem(1L, 1L, 1);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test
    public void addCourseBundleToSalesLineItem() {
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        ATrainingBundleSpecification mockBundleSpec = createMockCourseBundleSpec(start, end);

        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockBundleSpec).when(bundleSpecService).findById(1L);
        ATrainingBundle bundle = mockBundleSpec.createTrainingBundle();
        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItem(1L, 1L, 1);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getSalesLineItems().get(0).getTrainingBundle()).isEqualTo(bundle);

        assertThat(sale.getTotalPrice()).isEqualTo(100.0);
    }

    @Test
    public void addCourseBundleToSalesLineItemAlreadyCreated() {
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        ATrainingBundleSpecification mockBundleSpec = createMockCourseBundleSpec(start, end);

        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockBundleSpec).when(bundleSpecService).findById(1L);
        ATrainingBundle bundle = mockBundleSpec.createTrainingBundle();
        Mockito.doReturn(Collections.singletonList(bundle)).when(bundleService).findBundlesBySpec(mockBundleSpec);

        mockSaveMethod();
        Sale sale = saleFacade.addSalesLineItem(1L, 1L, 1);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
        assertThat(sale.getSalesLineItems().get(0).getTrainingBundle()).isEqualTo(bundle);

        assertThat(sale.getTotalPrice()).isEqualTo(100.0);
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

    private ATrainingBundleSpecification createMockCourseBundleSpec(Date startTime, Date endTime) {
        CourseTrainingBundleSpecification spec = new CourseTrainingBundleSpecification();
        spec.setMaxCustomers(11);
        spec.setStartTime(startTime);
        spec.setEndTime(endTime);
        spec.setDescription("Description");
        spec.setName("corso");
        spec.setId(1L);
        spec.setPrice(100.);
        spec.setDisabled(false);
        spec.setCreatedAt(new Date());
        return spec;
    }

    @Test
    public void confirmSale() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.confirmSale(1L);
        assertThat(sale.isCompleted()).isEqualTo(true);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test
    public void deleteSalesLineItem() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        SalesLineItem mockSalesLineItem = addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockSalesLineItem).when(salesLineItemService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.deleteSalesLineItem(1L, 1L);
        Mockito.verify(salesLineItemService).delete(mockSalesLineItem);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(0);
    }

    @Test
    public void deleteSaleById() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);
        customer.setCurrentTrainingBundles(Collections.emptyList());
        Sale mockSale = Fixture.createSale(1L, customer);
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test(expected = BadRequestException.class)
    public void deleteSaleByIdNonDeletable() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);
        customer.setCurrentTrainingBundles(Collections.emptyList());
        Sale mockSale = Fixture.createSale(1L, customer);
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        ATrainingBundle trainingBundle = mockSale.getSalesLineItems().get(0).getTrainingBundle();
        ATrainingSession session = trainingBundle.createSession(addHours(new Date(), -2), addHours(new Date(), -1));
        trainingBundle.addSession(session);
        session.complete();
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test
    public void paySale() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
        assertThat(sale.getAmountPayed()).isEqualTo(11.0);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleNotCompleted() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleMoreThanNeeded() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 200.);
        assertThat(sale.getAmountPayed()).isEqualTo(11.0);
    }

    @Test
    public void paySaleExactlyWhatNeeded() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
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
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
        addSalesLineItem(mockSale, Fixture.createPersonalBundleSpec(1L, "personal"));
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Sale sale = saleFacade.getTotalPriceBySaleId(1L);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test(expected = BadRequestException.class)
    public void confirmSaleThrowsExceptionWhenEmptySale() {
        Sale mockSale = Fixture.createSale(1L, Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null));
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
