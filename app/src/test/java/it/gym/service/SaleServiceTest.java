package it.gym.service;

import it.gym.model.Customer;
import it.gym.model.Gym;
import it.gym.model.Sale;
import it.gym.repository.SaleRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

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

}
