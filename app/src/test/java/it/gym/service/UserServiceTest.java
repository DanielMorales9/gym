package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.model.Customer;
import it.gym.repository.UserRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

import static it.gym.utility.Fixture.createCustomer;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class UserServiceTest {

    @MockBean private UserRepository repository;

    @TestConfiguration
    static class UserServiceTestContextConfiguration {

        @Bean
        public UserService service() {
            return new UserService();
        }
    }

    @Autowired
    private UserService service;

    private String email = "admin@admin.com";

    @Test
    public void save() {
        this.service.save(createCustomer(1L, "admin@admin.com", "", "admin", "admin", true, null, null));
        Mockito.verify(repository).save(any(Customer.class));
    }

    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(createCustomer(1L, "admin@admin.com", "", "admin", "admin", true, null, null)));
        AUser u = this.service.findById(1L);
        assertThat(u).isEqualTo(createCustomer(1L, "admin@admin.com", "", "admin", "admin", true, null, null));
        Mockito.verify(repository).findById(1L);
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void findByEmail() {
        Mockito.when(repository.findByEmail(email)).thenAnswer(invocationOnMock -> createCustomer(1L, "admin@admin.com", "", "admin", "admin", true, null, null));
        AUser u = this.service.findByEmail(email);
        assertThat(u).isEqualTo(createCustomer(1L, "admin@admin.com", "", "admin", "admin", true, null, null));
        Mockito.verify(repository).findByEmail(email);
    }

    @Test
    public void delete() {
        AUser u = createCustomer(1L, "admin@admin.com", "", "admin", "admin", true, null, null);
        this.service.delete(u);
        Mockito.verify(repository).delete(any(AUser.class));
    }

    @Test
    public void existsByEmail() {
        Mockito.when(this.service.existsByEmail(email)).thenAnswer(invocationOnMock -> createCustomer(1L, "admin@admin.com", "", "admin", "admin", true, null, null));
        boolean u = this.service.existsByEmail(email);
        assertThat(u).isTrue();
        Mockito.verify(repository).findByEmail(email);
    }

}
