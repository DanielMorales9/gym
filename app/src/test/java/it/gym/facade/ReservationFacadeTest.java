package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.*;
import it.gym.utility.Fixture;
import org.apache.commons.lang3.time.DateUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@RunWith(SpringRunner.class)
public class ReservationFacadeTest {

    @MockBean private ReservationService service;
    @MockBean private GymService gymService;
    @MockBean private CustomerService customerService;
    @MockBean private TrainerService trainerService;
    @MockBean private EventService eventService;
    @MockBean private TrainingBundleService trainingBundleService;
    @Qualifier("trainingSessionService")
    @MockBean private TrainingSessionService sessionService;
    @MockBean private UserService userService;
    @MockBean private MailService mailService;

    static {
        System.setProperty("reservationBeforeHours", "2");
    }

    @TestConfiguration
    static class ReservationFacadeTestContextConfiguration {

        @Bean
        public ReservationFacade facade() {
            return new ReservationFacade();
        }
    }

    @Autowired ReservationFacade facade;


    @Test
    public void isOnTime() {
        Date start = it.gym.utility.Calendar.getNextMonday();
        facade.isReservedOnTime(start);
    }

    @Test(expected = BadRequestException.class)
    public void isNotOnTime() {
        Date start = new Date();
        facade.isReservedOnTime(start);
    }

    @Test
    public void deleteExpiredBundles() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);
        customer.setCurrentTrainingBundles(Collections.emptyList());
        facade.deleteExpiredBundles(customer);
    }

    @Test
    public void hasNoHolidays() {
        facade.hasHolidays(Collections.emptyList());
    }

    @Test(expected = BadRequestException.class)
    public void hasHolidays() {
        List<AEvent> holidays = Collections.singletonList(Fixture.createHoliday(1L, "'holiday", new Date(), new Date(), null));
        facade.hasHolidays(holidays);
    }

    @Test
    public void hasTrainers() {
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        facade.isTrainerAvailable(Collections.emptyList());
    }

    @Test(expected = BadRequestException.class)
    public void hasNoAvailableTrainers() {
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        List<AEvent> timesOff = Collections.singletonList(Fixture.createTimeOff(2L, "my time", new Date(), new Date(), Fixture.createTrainer(2L), null));
        facade.isTrainerAvailable(timesOff);
    }

    @Test
    public void trainersHaveOtherReservations() {
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        facade.isTrainerAvailable(Collections.emptyList());
    }

    @Test
    public void isAvailable() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);
        Mockito.doReturn(Fixture.createGym(1L)).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(customerService).save(any(Customer.class));
        ATrainingBundle spec = Fixture.createPersonalBundle(1L);
        customer.addToCurrentTrainingBundles(Collections.singletonList(spec));
        Date start = it.gym.utility.Calendar.getNextMonday();
        Date end = DateUtils.addHours(start, 1);
        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        facade.isAvailable(1L, 1L, 1L, event);
    }

    @Test
    public void book() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);

        Mockito.doReturn(Fixture.createGym(1L)).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(customerService).save(any(Customer.class));

        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(trainingBundleService).save(any(ATrainingBundle.class));

        Mockito.doAnswer(invocationOnMock -> {
            ATrainingSession res = invocationOnMock.getArgument(0);
            res.setId(1L);
            return res;
        }).when(sessionService).save(any(ATrainingSession.class));

        Mockito.doAnswer(invocationOnMock -> {
            Reservation var = invocationOnMock.<Reservation>getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));

        ATrainingBundle spec = Fixture.createPersonalBundle(1L);
        customer.addToCurrentTrainingBundles(Collections.singletonList(spec));

        Date start = it.gym.utility.Calendar.getNextMonday();
        Date end = DateUtils.addHours(start, 1);

        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        Reservation actual = facade.createReservationFromBundle(1L, 1L, 1L, event);

        Reservation expected = Fixture.createReservation(1L, customer);

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    public void customerDeleteReservation() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);
        Role role = new Role();
        role.setId(1L);
        role.setName("CUSTOMER");
        customer.setRoles(Collections.singletonList(role));
        String email = "customer@customer.com";
        ATrainingBundle bundle = Fixture.createPersonalBundle(1L);
        PersonalTrainingSession session = Fixture.createPersonalTrainingSession(1L, bundle);
        bundle.addSession(session);

        Reservation reservation = Fixture.createReservation(1L, customer);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doReturn(customer).when(userService).findByEmail(email);
        Mockito.doReturn(createPersonalEvent(session, Fixture.createGym(1L))).when(eventService).findById(1L);

        Reservation actual = facade.deleteReservations(1L, 1L, email, "customer");

        Mockito.verifyZeroInteractions(mailService);
        assertThat(actual).isEqualTo(Fixture.createReservation(1L, customer));
    }

    private ATrainingEvent createPersonalEvent(ATrainingSession session, Gym gym) {
        ATrainingEvent evt = new PersonalEvent();
        evt.setSession(session);
        evt.setEndTime(evt.getSession().getEndTime());
        evt.setStartTime(evt.getSession().getStartTime());
        evt.setGym(gym);
        evt.setName("Allenamento");
        return evt;
    }

    @Test
    public void adminDeleteReservation() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);
        Role role = new Role();
        role.setId(1L);
        role.setName("CUSTOMER");
        customer.setRoles(Collections.singletonList(role));
        String email = "customer@customer.com";
        ATrainingBundle bundle = Fixture.createPersonalBundle(1L);
        PersonalTrainingSession session = Fixture.createPersonalTrainingSession(1L, bundle);
        bundle.addSession(session);

        Reservation reservation = Fixture.createReservation(1L, customer);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doReturn(customer).when(userService).findByEmail(email);
        Mockito.doReturn(createPersonalEvent(session, Fixture.createGym(1L))).when(eventService).findById(1L);

        Reservation actual = facade.deleteReservations(1L, 1L, email, "admin");

        Mockito.verify(mailService).sendSimpleMail(anyString(), anyString(), anyString());
        assertThat(actual).isEqualTo(Fixture.createReservation(1L, customer));
    }

    @Test
    public void confirm() {
        Customer customer = (Customer) Fixture.createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null, null);

        ATrainingBundle bundle = Fixture.createPersonalBundle(1L);
        PersonalTrainingSession session = Fixture.createPersonalTrainingSession(1L, bundle);
        bundle.addSession(session);

        Reservation reservation = Fixture.createReservation(1L, customer);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Reservation actual = facade.confirm(1L);

        Reservation expected = Fixture.createReservation(1L, customer);
        expected.setConfirmed(true);
        assertThat(actual).isEqualTo(expected);
    }

}
