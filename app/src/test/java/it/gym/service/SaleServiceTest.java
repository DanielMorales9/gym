package it.gym.service;

import it.gym.model.Customer;
import it.gym.model.Gym;
import it.gym.model.Sale;
import it.gym.repository.SaleRepository;
import it.gym.utility.Fixture;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static it.gym.utility.Fixture.createGym;
import static it.gym.utility.Fixture.createSale;
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
        Gym gym = createGym(1L);
        Sale mockSale = createSale(1L, createCustomer(gym));
        Mockito.doReturn(Optional.of(mockSale)).when(saleRepository).findById(1L);
        Sale actual = saleService.findById(1L);
        assertThat(actual).isEqualTo(mockSale);
    }

    @Test
    public void findAll() {
        Gym gym = createGym(1L);
        Sale mockSale = createSale(1L, createCustomer(gym));
        Mockito.doReturn(Collections.singletonList(mockSale)).when(saleRepository).findAll();
        List<Sale> actual = saleService.findAll();
        assertThat(actual).isEqualTo(Collections.singletonList(mockSale));
    }

    @Test
    public void save() {
        Gym gym = createGym(1L);
        Sale mockSale = createSale(1L, createCustomer(gym));
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(saleRepository).save(mockSale);
        Sale actual = saleService.save(mockSale);
        assertThat(actual).isEqualTo(mockSale);
    }

    @Test
    public void delete() {
        Gym gym = createGym(1L);
        Sale mockSale = createSale(1L, createCustomer(gym));
        saleService.delete(mockSale);
        Mockito.verify(saleRepository).delete(mockSale);
    }

    private Customer createCustomer(Gym gym) {
        return Fixture.createCustomer(1L, "pippo", "", "pippo", "pluto", true, null);
    }

}
