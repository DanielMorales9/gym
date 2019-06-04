package it.gym.service;

import it.gym.exception.InvalidSaleException;
import it.gym.exception.SalesIsNotCompletedException;
import it.gym.model.*;
import it.gym.repository.SaleRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.util.Collections;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@RunWith(SpringRunner.class)
public class SaleServiceTest {
    private static final String ADMIN_EMAIL = "admin@email.com";
    @MockBean private SaleRepository saleRepository;


    @TestConfiguration
    static class SaleServiceTestContextConfiguration {

        @Bean
        public SaleService saleService() {
            return new SaleService();
        }
    }

    @Autowired
    private SaleService saleService;

    @Test
    public void findById() {
        Sale mockSale = createSale(createCustomer(createGym()));
        Mockito.doReturn(Optional.of(mockSale)).when(saleRepository).findById(1L);
        Sale actual = saleService.findById(1L);
        assertThat(actual).isEqualTo(mockSale);
    }

    @Test
    public void save() {
        Sale mockSale = createSale(createCustomer(createGym()));
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(saleRepository).save(mockSale);
        Sale actual = saleService.save(mockSale);
        assertThat(actual).isEqualTo(mockSale);
    }

    @Test
    public void delete() {
        Sale mockSale = createSale(createCustomer(createGym()));
        saleService.delete(mockSale);
        Mockito.verify(saleRepository).delete(mockSale);
    }

    private Sale createSale(Customer user) {
        Sale sale = new Sale();
        sale.setId(1L);
        sale.setCustomer(user);
        return sale;
    }

    private Customer createCustomer(Gym gym) {
        Customer customer = new Customer();
        customer.setFirstName("pippo");
        customer.setLastName("pluto");
        customer.setEmail("pippo@pluto.com");
        customer.setGym(gym);
        customer.setVerified(true);
        return customer;
    }

    private Gym createGym() {
        Gym gym = new Gym();
        gym.setId(1L);
        gym.setWeekStartsOn(DayOfWeek.MONDAY);
        gym.setMondayOpen(true);
        gym.setTuesdayOpen(false);
        gym.setWednesdayOpen(false);
        gym.setThursdayOpen(false);
        gym.setFridayOpen(false);
        gym.setSaturdayOpen(false);
        gym.setSundayOpen(false);
        return gym;
    }

//
//    @Test
//    public void whenCreateSale() {
//        Sale sale = this.saleService.createSale(ADMIN_EMAIL, 2L);
//        assertThat(sale).isNotNull();
//        Admin admin = new Admin();
//        admin.setId(1L);
//        admin.setEmail(ADMIN_EMAIL);
//        Customer customer = new Customer();
//        customer.setId(2L);
//        customer.setFirstName("foo");
//        customer.setLastName("bar");
//        assertThat(sale.getAdmin()).isEqualTo(admin);
//        assertThat(sale.getCustomer()).isEqualTo(customer);
//        assertThat(sale.getAmountPayed()).isEqualTo(0);
//        assertThat(sale.isCompleted()).isEqualTo(false);
//        assertThat(sale.isPayed()).isEqualTo(false);
//        assertThat(sale.getTotalPrice()).isEqualTo(0);
//    }
//
//    @Test
//    public void whenAddSalesLineItem() {
//        Sale sale = this.saleService.addSalesLineItem(1L, 1L, 1);
//        PersonalTrainingBundleSpecification bundleSpecs = new PersonalTrainingBundleSpecification();
//        bundleSpecs.setName("Pacchetto");
//        bundleSpecs.setId(1L);
//        bundleSpecs.setNumSessions(11);
//        bundleSpecs.setDescription("Descrizione");
//        bundleSpecs.setPrice(200.0);
//        bundleSpecs.setDisabled(true);
//        PersonalTrainingBundle ptb = new PersonalTrainingBundle();
//        ptb.setNumSessions(11);
//        ptb.setPrice(bundleSpecs.getPrice());
//        ptb.setDescription(bundleSpecs.getDescription());
//        ptb.setName(bundleSpecs.getName());
//        ptb.setBundleSpec(bundleSpecs);
//        ptb.setExpired(false);
//        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
//        assertThat(sale.getSalesLineItems().get(0).getBundleSpecification()).isEqualTo(bundleSpecs);
//        assertThat(sale.getSalesLineItems().get(0).getTrainingBundle()).isEqualTo(ptb);
//    }
//
//    @Test
//    public void whenGetTotalPrice() {
//        Sale sale = this.saleService.getTotalPriceBySaleId(1L);
//        assertThat(sale.getTotalPrice()).isEqualTo(0.0);
//        this.saleService.addSalesLineItem(1L, 1L, 1);
//        sale = this.saleService.getTotalPriceBySaleId(1L);
//        assertThat(sale.getTotalPrice()).isEqualTo(200.0);
//    }
//
//    @Test
//    public void whenDeleteSalesLineItem() {
//        Sale sale = this.saleService.addSalesLineItem(1L, 1L, 1);
//        saleService.deleteSalesLineItem(1L, 1L);
//        assertThat(sale.getSalesLineItems().size()).isEqualTo(0);
//    }
//
//    @Test
//    public void whenConfirmSale() {
//        assertThrows(InvalidSaleException.class, () -> this.saleService.confirmSale(1L));
//        Sale sale = this.saleService.confirmSale(2L);
//        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
//    }
//
//    @Test
//    public void whenPaySale() {
//        assertThrows(SalesIsNotCompletedException.class, () -> this.saleService.paySale(1L, 100.0));
//        assertThrows(SalesIsNotCompletedException.class, () -> this.saleService.paySale(2L, 100.0));
//        this.saleService.confirmSale(2L);
//        Sale sale = this.saleService.paySale(2L, 100.0);
//        assertThat(sale.getSalesLineItems().size()).isEqualTo(1);
//        assertThat(sale.getAmountPayed()).isEqualTo(100.0);
//    }
//
//    @Test
//    public void whenDeleteSaleById() {
//        this.saleService.deleteSaleById(1L);
//    }
//
//    @Before
//    public void setUp() {
//        Sale sale = new Sale();
//        sale.setId(1L);
//        Admin admin = new Admin();
//        admin.setId(1L);
//        admin.setEmail(ADMIN_EMAIL);
//        sale.setCompleted(false);
//        sale.setAdmin(admin);
//        Customer customer = new Customer();
//        customer.setId(2L);
//        customer.setFirstName("foo");
//        customer.setLastName("bar");
//        sale.setCustomer(customer);
//        PersonalTrainingBundleSpecification bundleSpecs = new PersonalTrainingBundleSpecification();
//        bundleSpecs.setName("Pacchetto");
//        bundleSpecs.setId(1L);
//        bundleSpecs.setNumSessions(11);
//        bundleSpecs.setDescription("Descrizione");
//        bundleSpecs.setPrice(200.0);
//        bundleSpecs.setDisabled(true);
//
//        SalesLineItem sli = new SalesLineItem();
//        PersonalTrainingBundle ptb = new PersonalTrainingBundle();
//        ptb.setNumSessions(11);
//        ptb.setPrice(bundleSpecs.getPrice());
//        ptb.setDescription(bundleSpecs.getDescription());
//        ptb.setName(bundleSpecs.getName());
//        ptb.setBundleSpec(bundleSpecs);
//        ptb.setExpired(false);
//        sli.setTrainingBundle(ptb);
//        sli.setBundleSpecification(bundleSpecs);
//        Mockito.when(saleRepository.findById(1L)).thenReturn(Optional.of(sale));
//        Sale saleWithLines = new Sale();
//        saleWithLines.setAmountPayed(0.0);
//        saleWithLines.setId(2L);
//        saleWithLines.setCustomer(customer);
//        saleWithLines.setSalesLineItems(Collections.singletonList(sli));
//        Mockito.when(saleRepository.findById(2L)).thenReturn(Optional.of(saleWithLines));
//        Mockito.when(adminService.findByEmail(ADMIN_EMAIL)).thenReturn(admin);
//        Mockito.when(customerService.findById(2L)).thenReturn(customer);
//        Mockito.when(trainingBundleSpecificationService.findById(1L)).thenReturn(bundleSpecs);
//        Mockito.when(salesLineItemService.findById(1L)).thenReturn(sli);
//        Mockito.when(saleRepository.save(Mockito.any(Sale.class)))
//                .thenAnswer(invocationOnMock -> invocationOnMock.getArgument(0));
//    }


}
