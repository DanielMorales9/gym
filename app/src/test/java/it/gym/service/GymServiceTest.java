package it.gym.service;

import it.gym.exception.GymNotFoundException;
import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.model.Customer;
import it.gym.model.Gym;
import it.gym.repository.GymRepository;
import it.gym.repository.UserRepository;
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
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class GymServiceTest {

    @MockBean
    private GymRepository repository;

    @TestConfiguration
    static class GymServiceTestContextConfiguration {

        @Bean
        public GymService service() {
            return new GymService();
        }
    }

    @Autowired
    private GymService service;

    @Test
    public void save() {
        this.service.save(createGym());
        Mockito.verify(repository).save(any(Gym.class));
    }

    @Test
    public void findById() {
        Mockito.when(repository.findById(1L)).thenAnswer(invocationOnMock -> Optional.of(createGym()));
        Gym u = this.service.findById(1L);
        assertThat(u).isEqualTo(createGym());
        Mockito.verify(repository).findById(1L);
    }

    @Test(expected = GymNotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        Gym u = createGym();
        this.service.delete(u);
        Mockito.verify(repository).delete(any(Gym.class));
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
