package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.model.Customer;
import it.gym.repository.CustomerRepository;
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

import static it.gym.utility.Fixture.createCustomer;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class CustomerServiceTest {

    @MockBean private CustomerRepository repository;

    @TestConfiguration
    static class CustomerServiceTestContextConfiguration {

        @Bean
        public CustomerService service() {
            return new CustomerService();
        }
    }

    @Autowired
    private CustomerService service;

    @Test
    public void save() {
        this.service.save(createCustomer(1L, "email", "", "name", "surname", true, null));
        Mockito.verify(repository).save(any(Customer.class));
    }



    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(createCustomer(1L, "email", "", "name", "surname", true, null)));
        AUser u = this.service.findById(1L);
        assertThat(u).isEqualTo(createCustomer(1L, "email", "", "name", "surname", true, null));
        Mockito.verify(repository).findById(1L);
    }

    @Test
    public void findAll() {
        AUser customer = createCustomer(1L, "email", "", "name", "surname", true, null);
        Mockito.when(repository.findAll()).thenAnswer(invocationOnMock -> Collections.singletonList(customer));
        List<Customer> u = this.service.findAll();
        assertThat(u).isEqualTo(Collections.singletonList(customer));
        Mockito.verify(repository).findAll();
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        Customer u = createCustomer(1L, "email", "", "name", "surname", true, null);
        this.service.delete(u);
        Mockito.verify(repository).delete(any(Customer.class));
    }

}
