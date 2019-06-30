package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AEvent;
import it.gym.model.Holiday;
import it.gym.model.TimeOff;
import it.gym.model.Trainer;
import it.gym.repository.CourseEventRepository;
import it.gym.repository.EventRepository;
import it.gym.repository.PersonalEventRepository;
import it.gym.repository.TrainingEventRepository;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class EventServiceTest {

    @MockBean
    private EventRepository repository;

    @MockBean
    private PersonalEventRepository personalRepository;

    @MockBean
    private TrainingEventRepository trainingRepository;

    @MockBean
    private CourseEventRepository courseRepository;

    @TestConfiguration
    static class EventServiceTestContextConfiguration {

        @Bean
        public EventService service() {
            return new EventService();
        }
    }

    @Autowired
    EventService service;

    @Test
    public void save() {
        AEvent holiday = createHoliday(new Date(), new Date());
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
        AEvent holiday = createHoliday(new Date(), new Date());
        Mockito.doReturn(Optional.of(holiday)).when(repository).findById(1L);
        assertThat(service.findById(1L)).isNotNull();
        Mockito.verify(repository).findById(1L);
    }

    @Test
    public void findAllTimesOffByIdNoTimesOff() {
        Date startTime = new Date();
        Date endTime = new Date();
        Mockito.doReturn(Collections.singletonList(createHoliday(startTime, endTime))).when(repository).findAll();
        List<AEvent> list = service.findAllTimesOffById(1L, startTime, endTime);
        assertThat(list.size()).isEqualTo(0);
    }

    @Test
    public void findAllTimesOffById() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<TimeOff> toBeReturned = Collections.singletonList(createTimeOff(createTrainer(), startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findByInterval(startTime, endTime);
        List<AEvent> list = service.findAllTimesOffById(2L, startTime, endTime);
        assertThat(list.size()).isEqualTo(1);
    }

    @Test
    public void findAllEventsLargerThanInterval() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<TimeOff> toBeReturned = Collections.singletonList(createTimeOff(createTrainer(), startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findAllEventsLargerThanInterval(startTime, endTime);
        List<AEvent> list = service.findAllEventsLargerThanInterval(startTime, endTime);
        assertThat(list.size()).isEqualTo(1);
    }

    @Test
    public void findOverlappingEvents() {
        Date startTime = new Date();
        Date endTime = addHours(startTime, 1);
        List<TimeOff> toBeReturned = Collections.singletonList(createTimeOff(createTrainer(), startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findOverlappingEvents(startTime, endTime);
        List<AEvent> list = service.findOverlappingEvents(startTime, endTime);
        assertThat(list.size()).isEqualTo(1);
    }

    @Test
    public void findOverlappingEventsWithContiguousEvents() {
        Date startTime = new Date();
        Date myStartTime = addHours(startTime, -1);
        List<TimeOff> toBeReturned = Collections.emptyList();
        Mockito.doReturn(toBeReturned).when(repository).findOverlappingEvents(myStartTime, startTime);
        List<AEvent> list = service.findOverlappingEvents(myStartTime, startTime);
        assertThat(list.size()).isEqualTo(0);
    }

    @Test
    public void findAllHolidaysById() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<AEvent> toBeReturned = Collections.singletonList(createHoliday(startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findByInterval(any(), any());
        List<AEvent> list = service.findAllHolidays(startTime, endTime);
        assertThat(list.size()).isEqualTo(1);
    }

    @Test
    public void findAllHolidaysByIdNoHolidays() {
        Date startTime = new Date();
        Date endTime = new Date();
        Mockito.doReturn(Collections.singletonList(createTimeOff(createTrainer(), startTime, endTime))).when(repository).findAll();
        List<AEvent> list = service.findAllHolidays(startTime, endTime);
        assertThat(list.size()).isEqualTo(0);
    }

    @Test
    public void findAllEvents() {
        Date startTime = new Date();
        Date endTime = new Date();
        List<TimeOff> toBeReturned = Collections.singletonList(createTimeOff(createTrainer(), startTime, endTime));
        Mockito.doReturn(toBeReturned).when(repository).findByInterval(any(), any());
        List<AEvent> list = service.findAllEvents(startTime, endTime);
        assertThat(list.size()).isEqualTo(1);
    }

    @Test
    public void findAllEventsNoEvents() {
        Date startTime = new Date();
        Date endTime = new Date();
        TimeOff timeOff = createTimeOff(createTrainer(), addHours(startTime, 1), addHours(endTime, 1));
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
        service.delete(createTimeOff(createTrainer(), new Date(), new Date()));
        Mockito.verify(repository).delete(any());
    }

    private TimeOff createTimeOff(Trainer user, Date startTime, Date endTime) {
        TimeOff off = new TimeOff();
        off.setStartTime(startTime);
        off.setEndTime(endTime);
        off.setId(1L);
        off.setName("timeOff");
        off.setUser(user);
        return off;
    }

    private Trainer createTrainer() {
        Trainer user = new Trainer();
        user.setId(2L);
        user.setEmail("trainer@trainer.com");
        user.setFirstName("trainer");
        user.setLastName("trainer");
        return user;
    }

    private AEvent createHoliday(Date startTime, Date endTime) {
        Holiday holiday = new Holiday();
        holiday.setName("holiday");
        holiday.setStartTime(startTime);
        holiday.setEndTime(endTime);
        holiday.setId(1L);
        return holiday;
    }


}
