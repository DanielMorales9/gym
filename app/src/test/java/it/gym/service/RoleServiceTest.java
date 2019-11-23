package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Role;
import it.gym.repository.RoleRepository;
import it.gym.utility.Fixture;
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
public class RoleServiceTest {

    @MockBean
    private RoleRepository repository;
    @Autowired
    private RoleService service;

    @Test
    public void save() {
        this.service.save(Fixture.createAdminRole());
        Mockito.verify(repository).save(any(Role.class));
    }

    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(Fixture.createAdminRole()));
        Role u = this.service.findById(1L);
        assertThat(u).isEqualTo(Fixture.createAdminRole());
        Mockito.verify(repository).findById(1L);
    }

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        Role u = Fixture.createAdminRole();
        this.service.delete(u);
        Mockito.verify(repository).delete(any(Role.class));
    }

    @TestConfiguration
    static class RoleServiceTestContextConfiguration {

        @Bean
        public RoleService service() {
            return new RoleService();
        }
    }
}
