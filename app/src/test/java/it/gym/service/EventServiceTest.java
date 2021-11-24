package it.gym.service;

import static it.gym.utility.Fixture.*;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;

import it.gym.exception.NotFoundException;
import it.gym.model.AEvent;
import it.gym.model.TimeOff;
import it.gym.model.Trainer;
import it.gym.repository.EventRepository;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

@RunWith(SpringRunner.class)
public class EventServiceTest {

  @MockBean private EventRepository repository;

  @TestConfiguration
  static class EventServiceTestContextConfiguration {

    @Bean
    public EventService service() {
      return new EventService();
    }
  }

  @Autowired EventService service;

  @Test
  public void save() {
    AEvent holiday = createHoliday(1L, "holiday", new Date(), new Date());
    service.save(holiday);
    Mockito.verify(repository).save(holiday);
  }

  @Test(expected = NotFoundException.class)
  public void findByIdNotFound() {
    service.findById(1L);
    Mockito.verify(repository).findById(1L);
  }

  @Test
  public void findById() {
    AEvent holiday = createHoliday(1L, "holiday", new Date(), new Date());
    Mockito.doReturn(Optional.of(holiday)).when(repository).findById(1L);
    assertThat(service.findById(1L)).isNotNull();
    Mockito.verify(repository).findById(1L);
  }

  @Test
  public void findAllTimesOffByIdNoTimesOff() {
    Date startTime = new Date();
    Date endTime = new Date();
    Mockito.doReturn(
            Collections.singletonList(
                createHoliday(1L, "holiday", startTime, endTime)))
        .when(repository)
        .findAll();
    List<AEvent> list = service.findAllTimesOffById(1L, startTime, endTime);
    assertThat(list.size()).isEqualTo(0);
  }

  @Test
  public void findAllTimesOffById() {
    Date startTime = new Date();
    Date endTime = new Date();
    List<AEvent> toBeReturned =
        Collections.singletonList(
            createTimeOff(
                1L, "timeOff", startTime, endTime, createTrainer(2L)));
    Mockito.doReturn(toBeReturned)
        .when(repository)
        .findByInterval(startTime, endTime);
    List<AEvent> list = service.findAllTimesOffById(2L, startTime, endTime);
    assertThat(list.size()).isEqualTo(1);
  }

  @Test
  public void findAllEventsLargerThanInterval() {
    Date startTime = new Date();
    Date endTime = new Date();
    List<AEvent> toBeReturned =
        Collections.singletonList(
            createTimeOff(
                1L, "timeOff", startTime, endTime, createTrainer(2L)));
    Mockito.doReturn(toBeReturned)
        .when(repository)
        .findAllEventsLargerThanInterval(startTime, endTime);
    List<AEvent> list =
        service.findAllEventsLargerThanInterval(startTime, endTime);
    assertThat(list.size()).isEqualTo(1);
  }

  @Test
  public void findOverlappingEvents() {
    Date startTime = new Date();
    Date endTime = addHours(startTime, 1);
    List<AEvent> toBeReturned =
        Collections.singletonList(
            createTimeOff(
                1L, "timeOff", startTime, endTime, createTrainer(2L)));
    Mockito.doReturn(toBeReturned)
        .when(repository)
        .findOverlappingEvents(startTime, endTime);
    List<AEvent> list = service.findOverlappingEvents(startTime, endTime);
    assertThat(list.size()).isEqualTo(1);
  }

  @Test
  public void findOverlappingEventsWithContiguousEvents() {
    Date startTime = new Date();
    Date myStartTime = addHours(startTime, -1);
    List<TimeOff> toBeReturned = Collections.emptyList();
    Mockito.doReturn(toBeReturned)
        .when(repository)
        .findOverlappingEvents(myStartTime, startTime);
    List<AEvent> list = service.findOverlappingEvents(myStartTime, startTime);
    assertThat(list.size()).isEqualTo(0);
  }

  @Test
  public void findAllHolidaysById() {
    Date startTime = new Date();
    Date endTime = new Date();
    List<AEvent> toBeReturned =
        Collections.singletonList(
            createHoliday(1L, "holiday", startTime, endTime));
    Mockito.doReturn(toBeReturned)
        .when(repository)
        .findByInterval(any(), any());
    List<AEvent> list = service.findAllHolidays(startTime, endTime);
    assertThat(list.size()).isEqualTo(1);
  }

  @Test
  public void findAllHolidaysByIdNoHolidays() {
    Date startTime = new Date();
    Date endTime = new Date();
    Mockito.doReturn(
            Collections.singletonList(
                createTimeOff(
                    1L, "timeOff", startTime, endTime, createTrainer(2L))))
        .when(repository)
        .findAll();
    List<AEvent> list = service.findAllHolidays(startTime, endTime);
    assertThat(list.size()).isEqualTo(0);
  }

  @Test
  public void findAllEvents() {
    Date startTime = new Date();
    Date endTime = new Date();
    List<AEvent> toBeReturned =
        Collections.singletonList(
            createTimeOff(
                1L, "timeOff", startTime, endTime, createTrainer(2L)));
    Mockito.doReturn(toBeReturned)
        .when(repository)
        .findByInterval(any(), any());
    List<AEvent> list = service.findAllEvents(startTime, endTime);
    assertThat(list.size()).isEqualTo(1);
  }

  @Test
  public void findAllEventsNoEvents() {
    Date startTime = new Date();
    Date endTime = new Date();
    Date start = addHours(startTime, 1);
    Date end = addHours(endTime, 1);
    Trainer trainer = createTrainer(2L);
    TimeOff timeOff =
        (TimeOff) createTimeOff(1L, "timeOff", start, end, trainer);
    List<TimeOff> toBeReturned = Collections.singletonList(timeOff);
    Mockito.doReturn(toBeReturned).when(repository).findAll();
    List<AEvent> list = service.findAllEvents(startTime, endTime);
    assertThat(list.size()).isEqualTo(0);
  }

  @Test
  public void findAll() {
    service.findAll();
    Mockito.verify(repository).findAll();
  }

  @Test
  public void delete() {
    service.delete(
        createTimeOff(
            1L, "timeOff", new Date(), new Date(), createTrainer(2L)));
    Mockito.verify(repository).delete(any());
  }
}
