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

import java.util.Optional;

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
        this.service.save(createCustomer());
        Mockito.verify(repository).save(any(Customer.class));
    }

    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(createCustomer()));
        AUser u = this.service.findById(1L);
        assertThat(u).isEqualTo(createCustomer());
        Mockito.verify(repository).findById(1L);
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        Customer u = createCustomer();
        this.service.delete(u);
        Mockito.verify(repository).delete(any(Customer.class));
    }

    private Customer createCustomer() {
        Customer user = new Customer();
        user.setId(1L);
        user.setEmail("admin@admin.com");
        user.setFirstName("admin");
        user.setLastName("admin");
        return user;
    }
}
