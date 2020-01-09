package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.*;
import it.gym.utility.Fixture;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

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
        Date start = getNextMonday();
        facade.isReservedOnTime(start);
    }

    @Test(expected = BadRequestException.class)
    public void isNotOnTime() {
        Date start = new Date();
        facade.isReservedOnTime(start);
    }

    @Test
    public void deleteExpiredBundles() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        customer.setCurrentTrainingBundles(Collections.emptyList());
        facade.deleteExpiredBundles(customer);
    }

    @Test
    public void hasNoHolidays() {
        facade.hasHolidays(Collections.emptyList());
    }

    @Test(expected = BadRequestException.class)
    public void hasHolidays() {
        List<AEvent> holidays = Collections.singletonList(Fixture.createHoliday(1L, "'holiday", new Date(), new Date()));
        facade.hasHolidays(holidays);
    }

    @Test
    public void isAvailable() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        Mockito.doReturn(Fixture.createGym(1L)).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(customerService).save(any(Customer.class));
        ATrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", 11);
        ATrainingBundle bundle = Fixture.createPersonalBundle(1L, spec);
        customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        facade.isAvailable(1L, 1L, 1L, event);
    }

    @Test
    public void book() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);

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
            Reservation var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));

        ATrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", 11);
        ATrainingBundle bundle = createPersonalBundle(1L, spec);
        customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));

        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        Reservation actual = facade.createReservationFromBundle(1L, 1L, 1L, event);

        Reservation expected = createReservation(1L, customer);

        assertThat(actual).isEqualTo(expected);
    }

    @Test(expected = MethodNotAllowedException.class)
    public void whenCreatingReservationFromEvent_IsNotReservable() {
        Customer customer = (Customer)
                createCustomer(1L, "customer@customer.com",
                        "", "customer", "customer", true, null);

        Mockito.doReturn(Fixture.createGym(1L)).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);

        Date start = getNextMonday();
        Date end = addHours(start, 1);
        ATrainingBundleSpecification spec = createCourseBundleSpec(1L, "course", 0, 1);
        ATrainingBundle course = Fixture.createCourseBundle(1L, start, spec);
        ATrainingSession session = course.createSession(start, end);
        Mockito.doReturn(createCourseEvent(1L, "test", session)).when(eventService).findById(1L);

        customer.addToCurrentTrainingBundles(Collections.singletonList(course));

        facade.createReservationFromEvent(1L, 1L, 1L);
    }

    @Test(expected = MethodNotAllowedException.class)
    public void whenCreatingReservationFromEvent_CustomerDoesNotHaveBundle() {
        Customer customer = (Customer)
                createCustomer(1L, "customer@customer.com",
                        "", "customer", "customer", true, null);

        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        Mockito.doReturn(Fixture.createGym(1L)).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);

        Date start = getNextMonday();
        Date end = addHours(start, 1);
        ATrainingBundleSpecification spec = createCourseBundleSpec(1L, "course", 1, 1);
        ATrainingBundle course = createCourseBundle(1L, start, spec);
        ATrainingSession session = course.createSession(start, end);
        Mockito.doReturn(createCourseEvent(1L, "test", session)).when(eventService).findById(1L);

        facade.createReservationFromEvent(1L, 1L, 1L);
    }

    @Test(expected = MethodNotAllowedException.class)
    public void whenCreatingReservationFromBundle_IsExpired() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);

        Mockito.doReturn(createGym(1L)).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();

        ATrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", 0);
        ATrainingBundle bundle = createPersonalBundle(1L, spec);
        customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));

        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        facade.createReservationFromBundle(1L, 1L, 1L, event);
    }

    @Test
    public void customerDeleteReservation() {
        Customer customer = (Customer) createCustomer(1L,
                "customer@customer.com", "",
                "customer", "customer", true, null);
        Role role = new Role();
        role.setId(1L);
        role.setName("CUSTOMER");
        customer.setRoles(Collections.singletonList(role));
        String email = "customer@customer.com";
        ATrainingBundle bundle = Fixture.createPersonalBundle(1L, null);
        PersonalTrainingSession session = Fixture.createPersonalTrainingSession(1L, bundle);
        bundle.addSession(session);

        Reservation reservation = createReservation(1L, customer);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doReturn(customer).when(userService).findByEmail(email);
        Mockito.doReturn(createPersonalEvent(session)).when(eventService).findById(1L);

        Reservation actual = facade.deleteReservations(1L, 1L);

        Mockito.verifyZeroInteractions(mailService);
        assertThat(actual).isEqualTo(createReservation(1L, customer));
    }

    private ATrainingEvent createPersonalEvent(ATrainingSession session) {
        ATrainingEvent evt = new PersonalEvent();
        evt.setSession(session);
        evt.setEndTime(evt.getSession().getEndTime());
        evt.setStartTime(evt.getSession().getStartTime());
        evt.setName("Allenamento");
        return evt;
    }

    @Test
    public void adminDeleteReservation() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        Role role = new Role();
        role.setId(1L);
        role.setName("CUSTOMER");
        customer.setRoles(Collections.singletonList(role));
        String email = "customer@customer.com";
        ATrainingBundle bundle = Fixture.createPersonalBundle(1L, null);
        PersonalTrainingSession session = Fixture.createPersonalTrainingSession(1L, bundle);
        bundle.addSession(session);

        Reservation reservation = createReservation(1L, customer);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doReturn(customer).when(userService).findByEmail(email);
        Mockito.doReturn(createPersonalEvent(session)).when(eventService).findById(1L);

        Reservation actual = facade.deleteReservations(1L, 1L);

        assertThat(actual).isEqualTo(createReservation(1L, customer));
    }

    @Test
    public void confirm() {
        Customer customer = (Customer) createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);

        ATrainingBundle bundle = Fixture.createPersonalBundle(1L, null);
        PersonalTrainingSession session = Fixture.createPersonalTrainingSession(1L, bundle);
        bundle.addSession(session);

        Reservation reservation = createReservation(1L, customer);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Reservation actual = facade.confirm(1L);

        Reservation expected = createReservation(1L, customer);
        expected.setConfirmed(true);
        assertThat(actual).isEqualTo(expected);
    }

}
