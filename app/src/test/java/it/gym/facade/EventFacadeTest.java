package it.gym.facade;

import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.repository.EventRepository;
import it.gym.service.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class EventFacadeTest {

    @MockBean
    private GymService gymService;
    @MockBean
    private ReservationService reservationService;
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
        Date time = new Date();
        createHoliday(gym, time, time);
        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        event.setEndTime(time);
        event.setStartTime(time);
        event.setName("holiday");
        AEvent evt = facade.createHoliday(1L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createHoliday(gym, time, time));
    }

    @Test
    public void deleteHoliday() {
        facade.delete(1L);
        Mockito.verify(service).findById(1L);
        Mockito.verify(service).delete(any());
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
