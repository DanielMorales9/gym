package it.gym.service;

import static it.gym.utility.CalendarUtility.getNextMonday;
import static it.gym.utility.Fixture.createGym;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.model.Gym;
import it.gym.repository.GymRepository;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.assertj.core.api.AssertionsForClassTypes;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class GymServiceTest {

  @MockBean GymRepository repository;
  @MockBean ObjectMapper mapper;

  @TestConfiguration
  static class GymServiceTestContextConfiguration {

    @Bean
    public GymService service() {
      return new GymService();
    }
  }

  @Autowired private GymService service;

  @Test
  public void save() {
    this.service.save(createGym(1L));
    Mockito.verify(repository).save(any(Gym.class));
  }

  @Test
  public void findById() {
    Mockito.when(repository.findById(1L))
        .thenAnswer(invocationOnMock -> Optional.of(createGym(1L)));
    Gym u = this.service.findById(1L);
    assertThat(u).isEqualTo(createGym(1L));
    Mockito.verify(repository).findById(1L);
  }

  @Test(expected = NotFoundException.class)
  public void whenFindByIdThrowsNotFound() {
    this.service.findById(1L);
  }

  @Test
  public void delete() {
    Gym u = createGym(1L);
    this.service.delete(u);
    Mockito.verify(repository).delete(any(Gym.class));
  }

  @Test
  public void simpleGymChecks() {
    Date start = getNextMonday();
    Date end = addHours(start, 1);
    Gym gym = createGym(1L);
    service.checkGymHours(gym, start, end);
  }

  @Test(expected = BadRequestException.class)
  public void startTimeAfterEndTime() {
    Date start = getNextMonday();
    Date end = addHours(start, -1);
    Gym gym = createGym(1L);
    service.checkGymHours(gym, start, end);
  }

  @Test(expected = BadRequestException.class)
  public void isPast() {
    Date start = addDays(getNextMonday(), -8);
    Date end = addHours(start, 1);
    Gym gym = createGym(1L);
    service.checkGymHours(gym, start, end);
  }

  @Test(expected = BadRequestException.class)
  public void isNotWithinWorkingHours() {
    Date start = addDays(getNextMonday(), 6);
    Date end = addHours(start, 1);
    Gym gym = createGym(1L);
    service.checkGymHours(gym, start, end);
  }

  @Test
  public void findAll() {
    Mockito.doReturn(Collections.emptyList()).when(repository).findAll();
    List<Gym> list = service.findAll();
    AssertionsForClassTypes.assertThat(list.size()).isEqualTo(0);
  }
}
