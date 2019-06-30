package it.gym.facade;

import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.repository.EventRepository;
import it.gym.service.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class EventFacadeTest {

    @MockBean
    private GymService gymService;
    @MockBean
    private ReservationService reservationService;

    @MockBean
    private TrainingBundleService bundleService;

    @MockBean
    @Qualifier("trainingSessionService")
    private TrainingSessionService sessionService;

    @MockBean
    private UserService userService;
    @MockBean
    private EventService service;
    @MockBean
    private EventRepository repository;

    @TestConfiguration
    static class EventFacadeTestContextConfiguration {

        @Bean
        public EventFacade facade() {
            return new EventFacade();
        }
    }


    @Autowired
    EventFacade facade;

    @Test
    public void createHoliday() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setName("holiday");
        AEvent evt = facade.createHoliday(1L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createHoliday(gym, start, end));
    }

    @Test
    public void editHoliday() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doReturn(createHoliday(gym, start, end)).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        event.setStartTime(start);
        Date newEnd = addHours(end, 1);
        event.setEndTime(newEnd);
        event.setName("holiday");
        AEvent evt = facade.editEvent(1L, 1L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createHoliday(gym, start, newEnd));
    }

    @Test
    public void canEditHoliday() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doReturn(createHoliday(gym, start, end)).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        event.setStartTime(start);
        Date newEnd = addHours(end, 1);
        event.setEndTime(newEnd);
        event.setName("holiday");
        facade.canEdit(1L, 1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test
    public void isHolidayAvailable() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doReturn(createHoliday(gym, start, end)).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        event.setStartTime(start);
        Date newEnd = addHours(end, 1);
        event.setEndTime(newEnd);
        event.setName("holiday");
        facade.isAvailable(1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test
    public void createTimeOff() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(trainer).when(userService).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setName("timeOff");
        AEvent evt = facade.createTimeOff(1L, 2L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createTimeOff(gym, trainer, start, end));
    }

    @Test
    public void editTimeOff() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(createTimeOff(gym, trainer, start, end)).when(service).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");
        AEvent evt = facade.editEvent(1L, 2L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createTimeOff(gym, trainer, start, newEnd));
    }

    @Test
    public void canEditTimeOff() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(createTimeOff(gym, trainer, start, end)).when(service).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");
        facade.canEdit(1L, 2L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test
    public void isTimeOffAvailable() {
        Gym gym = createGym();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(createTimeOff(gym, trainer, start, end)).when(service).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");
        facade.isAvailable(1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test
    public void deleteHoliday() {
        facade.delete(1L);
        Mockito.verify(service).findById(1L);
        Mockito.verify(service).delete(any());
    }

    private TimeOff createTimeOff(Gym gym, AUser trainer, Date start, Date end) {
        TimeOff time = new TimeOff();
        time.setName("timeOff");
        time.setUser(trainer);
        time.setGym(gym);
        time.setStartTime(start);
        time.setEndTime(end);
        return time;
    }

    private Trainer createTrainer() {
        Trainer user = new Trainer();
        user.setId(2L);
        user.setEmail("trainer@trainer.com");
        user.setFirstName("trainer");
        user.setLastName("trainer");
        return user;
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

    private Holiday createHoliday(Gym gym, Date startTime, Date endTime) {
        Holiday holiday = new Holiday();
        holiday.setGym(gym);
        holiday.setStartTime(startTime);
        holiday.setEndTime(endTime);
        holiday.setName("holiday");
        return holiday;
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
