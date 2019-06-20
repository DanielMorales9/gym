package it.gym.facade;

import it.gym.exception.InvalidTimesOff;
import it.gym.model.*;
import it.gym.repository.TimeOffRepository;
import it.gym.service.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
public class TimeOffFacadeTest {
    @Autowired
    TimeOffFacade facade;
    @MockBean
    private GymService gymService;
    @MockBean
    private ReservationService reservationService;
    @MockBean
    private TrainerService trainerService;
    @MockBean
    private UserService userService;
    @MockBean
    private TimeOffService service;
    @MockBean
    private MailService mailService;
    @MockBean
    private TimeOffRepository repository;

    @Test
    public void isTrue() {
        assertThat(true).isEqualTo(true);
    }

    @Test(expected = InvalidTimesOff.class)
    public void isReservationWithinInterval() {
        Calendar cal = Calendar.getInstance(Locale.ITALIAN);
        cal.set(2019, Calendar.JUNE, 8, 10, 0);
        Date start = cal.getTime();
        Date end = addHours(start, 1);

        Mockito.doReturn(1).when(reservationService).countByInterval(start, end);
        facade.isReservationWithinInterval(start, end);
    }

    @Test(expected = InvalidTimesOff.class)
    public void isDoublyBooked() {
        Calendar cal = Calendar.getInstance(Locale.ITALIAN);
        cal.set(2019, Calendar.JUNE, 8, 10, 0);
        Date start = cal.getTime();
        Date end = addHours(start, 1);

        String admin = "admin";
        List<TimeOff> list = Collections.singletonList(createTimeOff(createAdmin(), start, end));
        Mockito.doReturn(list).when(service).findOverlappingTimesOffByType(start, end, admin);
        facade.isDoublyBooked(start, end, admin);
    }

    @Test
    public void findByDateInterval() {
        Calendar cal = Calendar.getInstance(Locale.ITALIAN);
        cal.set(2019, Calendar.JUNE, 8, 10, 0);
        Date start = cal.getTime();
        Date end = addHours(start, 1);

        String admin = "admin";
        List<TimeOff> list = Collections.singletonList(createTimeOff(createAdmin(), start, end));
        Optional<Long> id = Optional.of(1L);
        Optional<String> type = Optional.of(admin);
        Mockito.doReturn(list).when(service).findByStartTimeAndEndTimeAndIdAndType(id, type, start, end);
        facade.findByDateInterval(id, type, start, end);
    }

    private Reservation createReservation(Customer c, Date start, Date end) {
        Reservation r = new Reservation();
        r.setConfirmed(false);
        r.setId(1L);
        r.setStartTime(start);
        r.setEndTime(end);
        r.setUser(c);
        return r;
    }

    private AUser createCustomer() {
        AUser user = new Customer();
        user.setId(2L);
        user.setFirstName("customer");
        user.setLastName("customer");
        user.setEmail("customer@customer.com");
        return user;
    }

    private AUser createAdmin() {
        AUser user = new Admin();
        user.setId(1L);
        user.setFirstName("admin");
        user.setLastName("admin");
        user.setEmail("admin@admin.com");
        return user;
    }

    private TimeOff createTimeOff(AUser user, Date start, Date end) {
        TimeOff time = new TimeOff();
        time.setId(1L);
        time.setType("admin");
        time.setName("vacanze");
        time.setUser(user);
        time.setStartTime(start);
        time.setStartTime(end);
        return time;
    }

    @TestConfiguration
    static class TimeOffFacadeTestContextConfiguration {

        @Bean
        public TimeOffFacade facade() {
            return new TimeOffFacade();
        }
    }

}
