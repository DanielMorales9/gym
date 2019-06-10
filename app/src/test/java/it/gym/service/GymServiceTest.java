package it.gym.service;

import it.gym.exception.GymNotFoundException;
import it.gym.exception.InvalidReservationException;
import it.gym.exception.InvalidTimeException;
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
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;
import java.util.Optional;

import static org.apache.commons.lang3.time.DateUtils.addHours;
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

    @Test
    public void isValidInterval() {
        Date start = new Date();
        start = addHours(start, 1);
        Date end = addHours(start, 1);

        service.isValidInterval(start, end);
    }

    @Test(expected = InvalidReservationException.class)
    public void startAfterEndTime() {
        Date start = new Date();
        start = addHours(start, 1);
        Date end = addHours(start, -1);

        service.isValidInterval(start, end);
    }


    @Test(expected = InvalidReservationException.class)
    public void isIntervalPast() {
        Date start = new Date();
        start = addHours(start, -1);
        Date end = addHours(start, 1);

        service.isValidInterval(start, end);
    }


    @Test
    public void isWithinWorkingHours() {
        Calendar cal = Calendar.getInstance(Locale.ITALIAN);
        cal.set(2019, Calendar.JUNE, 8, 12, 0);
        Date start = cal.getTime();
        Date end = addHours(start, 1);
        Mockito.doReturn(Optional.of(createGym())).when(repository).findById(1L);
        service.isWithinWorkingHours(1L, start, end);
    }

    @Test(expected = InvalidTimeException.class)
    public void isNotWithinWorkingHours() {
        Calendar cal = Calendar.getInstance(Locale.ITALIAN);
        cal.set(2019, Calendar.JUNE, 8, 13, 0);
        Date start = cal.getTime();
        Date end = addHours(start, 1);
        Mockito.doReturn(Optional.of(createGym())).when(repository).findById(1L);
        service.isWithinWorkingHours(1L, start, end);
    }

    private Gym createGym() {
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
