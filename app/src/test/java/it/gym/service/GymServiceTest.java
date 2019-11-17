package it.gym.service;

import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.model.Gym;
import it.gym.repository.GymRepository;
import org.assertj.core.api.AssertionsForClassTypes;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.util.*;

import static org.apache.commons.lang3.time.DateUtils.addDays;
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

    @Test(expected = NotFoundException.class)
    public void whenFindByIdThrowsNotFound() {
        this.service.findById(1L);
    }

    @Test
    public void delete() {
        Gym u = createGym();
        this.service.delete(u);
        Mockito.verify(repository).delete(any(Gym.class));
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

    @Test
    public void simpleGymChecks() {
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Gym gym = createGym();
        service.simpleGymChecks(gym, start, end);
    }

    @Test(expected = BadRequestException.class)
    public void startTimeAfterEndTime() {
        Date start = getNextMonday();
        Date end = addHours(start, -1);
        Gym gym = createGym();
        service.simpleGymChecks(gym, start, end);
    }

    @Test(expected = BadRequestException.class)
    public void isPast() {
        Date start = addDays(getNextMonday(), -7);
        Date end = addHours(start, 1);
        Gym gym = createGym();
        service.simpleGymChecks(gym, start, end);
    }

    @Test(expected = BadRequestException.class)
    public void isNotWithinWorkingHours() {
        Date start = addDays(getNextMonday(), 6);
        Date end = addHours(start, 1);
        Gym gym = createGym();
        service.simpleGymChecks(gym, start, end);
    }

    @Test
    public void findAll() {
        Mockito.doReturn(Collections.emptyList()).when(repository).findAll();
        List<Gym> list = service.findAll();
        AssertionsForClassTypes.assertThat(list.size()).isEqualTo(0);
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
