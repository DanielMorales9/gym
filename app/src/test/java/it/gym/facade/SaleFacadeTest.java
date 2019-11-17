package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.*;
import it.gym.repository.CourseTrainingBundleRepository;
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

import java.time.DayOfWeek;
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
        Mockito.doReturn(createMockCustomer()).when(userService).findById(2L);
        Mockito.doReturn(createMockGym()).when(gymService).findById(1L);
        Sale sale = saleFacade.createSale(1L, 2L);
        assertThat(sale.getId()).isEqualTo(1L);
        assertThat(sale.getCustomer()).isEqualTo(createMockCustomer());
        assertThat(sale.getAmountPayed()).isEqualTo(0.);
        assertThat(sale.getGym()).isEqualTo(createMockGym());
    }

    @Test
    public void addSalesLineItem() {
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        ATrainingBundleSpecification mockBundleSpec = createMockBundleSpec();
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

        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
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

        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
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
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        addMockSalesLineItem(mockSale, createMockBundleSpec());
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.confirmSale(1L);
        assertThat(sale.isCompleted()).isEqualTo(true);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test
    public void deleteSalesLineItem() {
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        SalesLineItem mockSalesLineItem = addMockSalesLineItem(mockSale, createMockBundleSpec());
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Mockito.doReturn(mockSalesLineItem).when(salesLineItemService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.deleteSalesLineItem(1L, 1L);
        Mockito.verify(salesLineItemService).delete(mockSalesLineItem);
        assertThat(sale.getSalesLineItems().size()).isEqualTo(0);
    }

    @Test
    public void deleteSaleById() {
        Customer customer = createMockCustomer();
        customer.setCurrentTrainingBundles(Collections.emptyList());
        Sale mockSale = createMockSale(createMockGym(), customer);
        addMockSalesLineItem(mockSale, createMockBundleSpec());
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test(expected = BadRequestException.class)
    public void deleteSaleByIdNonDeletable() {
        Customer customer = createMockCustomer();
        customer.setCurrentTrainingBundles(Collections.emptyList());
        Sale mockSale = createMockSale(createMockGym(), customer);
        addMockSalesLineItem(mockSale, createMockBundleSpec());
        ATrainingBundle trainingBundle = mockSale.getSalesLineItems().get(0).getTrainingBundle();
        ATrainingSession session = trainingBundle.createSession(addHours(new Date(), -2), addHours(new Date(), -1));
        trainingBundle.addSession(session);
        session.complete();
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.deleteSaleById(1L);
    }

    @Test
    public void paySale() {
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        addMockSalesLineItem(mockSale, createMockBundleSpec());
        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
        assertThat(sale.getAmountPayed()).isEqualTo(11.0);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleNotCompleted() {
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        addMockSalesLineItem(mockSale, createMockBundleSpec());
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 11.);
    }

    @Test(expected = BadRequestException.class)
    public void paySaleMoreThanNeeded() {
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        addMockSalesLineItem(mockSale, createMockBundleSpec());
        mockSale.setCompleted(true);
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        mockSaveMethod();
        Sale sale = saleFacade.paySale(1L, 200.);
        assertThat(sale.getAmountPayed()).isEqualTo(11.0);
    }

    @Test
    public void paySaleExactlyWhatNeeded() {
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        addMockSalesLineItem(mockSale, createMockBundleSpec());
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
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        addMockSalesLineItem(mockSale, createMockBundleSpec());
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        Sale sale = saleFacade.getTotalPriceBySaleId(1L);
        assertThat(sale.getTotalPrice()).isEqualTo(111.0);
    }

    @Test(expected = BadRequestException.class)
    public void confirmSaleThrowsExceptionWhenEmptySale() {
        Sale mockSale = createMockSale(createMockGym(), createMockCustomer());
        Mockito.doReturn(mockSale).when(saleService).findById(1L);
        saleFacade.confirmSale(1L);
    }



    private void mockSaveMethod() {
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(saleService).save(any());
    }

    private ATrainingBundleSpecification createMockBundleSpec() {
        ATrainingBundleSpecification specs = new PersonalTrainingBundleSpecification();
        specs.setDisabled(false);
        specs.setDescription("Description");
        specs.setId(1L);
        specs.setName("Bundle");
        specs.setPrice(111.0);
        return specs;
    }

    private Sale createMockSale(Gym gym, AUser customer) {
        Sale sale = new Sale();
        sale.setId(1L);
        sale.setCustomer((Customer) customer);
        sale.setGym(gym);
        sale.setAmountPayed(0.0);
        sale.setCompleted(false);
        return sale;
    }

    private Customer createMockCustomer() {
        Customer user = new Customer();
        user.setId(2L);
        user.setEmail("customer@customer.com");
        user.setFirstName("customer");
        user.setLastName("customer");
        user.setVerified(true);
        return user;
    }

    private SalesLineItem addMockSalesLineItem(Sale mockSale, ATrainingBundleSpecification specs) {
        return mockSale.addSalesLineItem(specs.createTrainingBundle());
    }

    private Gym createMockGym() {
        Gym gym = new Gym();
        gym.setId(1L);
        gym.setWeekStartsOn(DayOfWeek.MONDAY);
        gym.setMondayOpen(true);
        gym.setMondayStartHour(8);
        gym.setMondayEndHour(22);
        gym.setTuesdayStartHour(8);
        gym.setTuesdayEndHour(22);
        gym.setWednesdayStartHour(8);
        gym.setWednesdayEndHour(22);
        gym.setThursdayStartHour(8);
        gym.setThursdayEndHour(22);
        gym.setFridayStartHour(8);
        gym.setFridayEndHour(22);
        gym.setSaturdayStartHour(8);
        gym.setSaturdayEndHour(13);
        gym.setTuesdayOpen(true);
        gym.setWednesdayOpen(true);
        gym.setThursdayOpen(true);
        gym.setFridayOpen(true);
        gym.setSaturdayOpen(true);
        gym.setSundayOpen(false);
        return gym;
    }
}
