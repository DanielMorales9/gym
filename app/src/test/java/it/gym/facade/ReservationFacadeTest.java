package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
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

import java.lang.reflect.Method;
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
    @MockBean private EventService eventService;
    @Qualifier("trainingBundleService")
    @MockBean private TrainingBundleService bundleService;
    @Qualifier("trainingSessionService")
    @MockBean private TrainingSessionService sessionService;
    @MockBean private UserService userService;
    @MockBean @Qualifier("mailService") private MailService mailService;

    static {
        System.setProperty("reservationBeforeHours", "2");
    }

    private final PersonalTrainingEventFixture personalEventFixture = new PersonalTrainingEventFixture();
    private final CourseTrainingEventFixture courseEventFixture = new CourseTrainingEventFixture();

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
        Gym gym = createGym(1L);
        facade.isNotOnTime(start, gym);
    }

    @Test()
    public void isNotOnTime() {
        Date start = new Date();
        Gym gym = createGym(1L);
        assertThat(facade.isNotOnTime(start, gym)).isTrue();
    }

    @Test
    public void isAvailable() {
        Customer customer = createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        Mockito.doReturn(createGym(1L)).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(customerService).save(any(Customer.class));
        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0);
        PersonalTrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", options);
        APurchaseOption option = spec.getOptions().get(0);
        PersonalTrainingBundle bundle = createPersonalBundle(1L, spec, option);
<<<<<<< HEAD
        customer.addToTrainingBundles(Collections.singletonList(bundle));
=======
        customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));
>>>>>>> cb92586... bundle state
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        facade.isAvailable(1L, 1L, 1L, event, "ADMIN");
    }

    @Test
    public void whenCustomerCreateReservationFromBundle() {
        personalEventFixture.invoke(11, 900.0);

        Gym gym = personalEventFixture.getGym();
        Customer customer = personalEventFixture.getCustomer();
        Date start = personalEventFixture.getStart();
        Date end = personalEventFixture.getEnd();
        Event event = personalEventFixture.getEvent();
        PersonalTrainingEvent[] e = personalEventFixture.getPersonalEvents();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> {
            Reservation var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));
        Mockito.doAnswer(invocationOnMock -> {
            ATrainingSession res = invocationOnMock.getArgument(0);
            res.setId(1L);
            return res;
        }).when(sessionService).save(any(PersonalTrainingSession.class));
        Mockito.doAnswer(invocationOnMock -> {
            e[0] = invocationOnMock.getArgument(0);
            e[0].setId(1L);
            return e[0];
        }).when(eventService).save(any(PersonalTrainingEvent.class));
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(bundleService).save(any(ATrainingBundle.class));

        Reservation actual = facade.createReservation(1L, 1L, 1L, event, "ADMIN");

        Mockito.verify(gymService).findById(1L);
        Mockito.verify(customerService).findById(1L);
        Mockito.verify(gymService).checkGymHours(gym, start, end);
        Mockito.verify(service).save(any(Reservation.class));
        Mockito.verify(sessionService).save(any(PersonalTrainingSession.class));
        Mockito.verify(eventService).save(any(PersonalTrainingEvent.class));
        Mockito.verify(bundleService).save(any(PersonalTrainingBundle.class));

        Reservation expected = createReservation(1L, customer);

        assertThat(actual).isEqualTo(expected);
        assertThat(actual.getSession().getCompleted()).isFalse();
        assertThat(actual.getSession().getStartTime()).isEqualTo(start);
        assertThat(actual.getSession().getEndTime()).isEqualTo(end);
    }

    @Test
    public void whenAdminCreateReservation() {
        personalEventFixture.invoke(11, 900.0);

        Gym gym = personalEventFixture.getGym();
        Customer customer = personalEventFixture.getCustomer();
        Date start = personalEventFixture.getStart();
        Date end = personalEventFixture.getEnd();
        Event event = personalEventFixture.getEvent();
        PersonalTrainingEvent[] e = personalEventFixture.getPersonalEvents();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> {
            Reservation var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));

        Mockito.doAnswer(invocationOnMock -> {
            ATrainingSession res = invocationOnMock.getArgument(0);
            res.setId(1L);
            return res;
        }).when(sessionService).save(any(PersonalTrainingSession.class));

        Mockito.doAnswer(invocationOnMock -> {
            e[0] = invocationOnMock.getArgument(0);
            e[0].setId(1L);
            return e[0];
        }).when(eventService).save(any(PersonalTrainingEvent.class));

        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(bundleService).save(any(ATrainingBundle.class));

        Reservation actual = facade.createReservation(1L, 1L, 1L, event, "ADMIN");

        Mockito.verify(gymService).findById(1L);
        Mockito.verify(customerService).findById(1L);
        Mockito.verify(gymService).checkGymHours(gym, start, end);
        Mockito.verify(service).save(any(Reservation.class));
        Mockito.verify(sessionService).save(any(PersonalTrainingSession.class));
        Mockito.verify(eventService).save(any(PersonalTrainingEvent.class));
        Mockito.verify(bundleService).save(any(PersonalTrainingBundle.class));

        Reservation expected = createReservation(1L, customer);

        assertThat(actual).isEqualTo(expected);
        assertThat(actual.getSession().getStartTime()).isEqualTo(start);
        assertThat(actual.getSession().getEndTime()).isEqualTo(end);
    }


    @Test(expected = MethodNotAllowedException.class)
    public void whenCreatingReservationFromEventThenReturnsNotReservable() {
        courseEventFixture.invoke(0, true);

        Gym gym = courseEventFixture.getGym();
        Customer customer = courseEventFixture.getCustomer();
        Date start = courseEventFixture.getStart();
        Date end = courseEventFixture.getEnd();
        ATrainingBundle course = courseEventFixture.getBundle();
        CourseTrainingEvent event = courseEventFixture.getEvent();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(event).when(eventService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> {
            Reservation var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));
        Mockito.doAnswer(invocationOnMock -> {
            ATrainingSession res = invocationOnMock.getArgument(0);
            res.setId(1L);
            return res;
        }).when(sessionService).save(any(CourseTrainingSession.class));
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(bundleService).save(any(ATrainingBundle.class));

        facade.createReservationWithExistingEvent(gym.getId(),
                customer.getId(),
                event.getId(),
                course.getId(),
                "ADMIN");

        Mockito.verify(gymService).findById(1L);
        Mockito.verify(customerService).findById(1L);
        Mockito.verify(gymService).checkGymHours(gym, start, end);
        Mockito.verify(service).save(any(Reservation.class));
        Mockito.verify(sessionService).save(any(CourseTrainingSession.class));
        Mockito.verify(eventService).save(any(CourseTrainingEvent.class));
        Mockito.verify(bundleService).save(any(CourseTrainingBundle.class));
    }

    @Test
    public void whenCreatingReservationFromEventThenReturnsOk() {
        courseEventFixture.invoke(1, true);

        Gym gym = courseEventFixture.getGym();
        Customer customer = courseEventFixture.getCustomer();
        Date start = courseEventFixture.getStart();
        Date end = courseEventFixture.getEnd();
        ATrainingBundle course = courseEventFixture.getBundle();
        CourseTrainingEvent event = courseEventFixture.getEvent();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(event).when(eventService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> {
            Reservation var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));
        Mockito.doAnswer(invocationOnMock -> {
            ATrainingSession res = invocationOnMock.getArgument(0);
            res.setId(1L);
            return res;
        }).when(sessionService).save(any(CourseTrainingSession.class));
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(bundleService).save(any(ATrainingBundle.class));

        Reservation actual = facade.createReservationWithExistingEvent(gym.getId(),
                customer.getId(),
                event.getId(),
                course.getId(),
                "ADMIN");

        Mockito.verify(gymService).findById(1L);
        Mockito.verify(customerService).findById(1L);
        Mockito.verify(gymService).checkGymHours(gym, start, end);
        Mockito.verify(service).save(any(Reservation.class));
        Mockito.verify(sessionService).save(any(CourseTrainingSession.class));
        Mockito.verify(eventService).save(any(CourseTrainingEvent.class));
        Mockito.verify(bundleService).save(any(CourseTrainingBundle.class));

        Reservation expected = createReservation(1L, customer);
        // a course reservation is directly confirmed
        expected.setConfirmed(true);

        assertThat(actual).isEqualTo(expected);
        assertThat(actual.getSession().getCompleted()).isFalse();
        assertThat(actual.getSession().getStartTime()).isEqualTo(start);
        assertThat(actual.getSession().getEndTime()).isEqualTo(end);
    }

    @Test(expected = BadRequestException.class)
    public void whenCreatingReservationFromEventWithoutBundleThenReturnsBadRequest() {
        courseEventFixture.invoke(0, false);

        Gym gym = courseEventFixture.getGym();
        Customer customer = courseEventFixture.getCustomer();
        ATrainingBundle course = courseEventFixture.getBundle();
        CourseTrainingEvent event = courseEventFixture.getEvent();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(event).when(eventService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> {
            Reservation var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));
        Mockito.doAnswer(invocationOnMock -> {
            ATrainingSession res = invocationOnMock.getArgument(0);
            res.setId(1L);
            return res;
        }).when(sessionService).save(any(CourseTrainingSession.class));
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(bundleService).save(any(ATrainingBundle.class));

        facade.createReservationWithExistingEvent(gym.getId(),
                customer.getId(),
                event.getId(),
                course.getId(),
                "CUSTOMER");
    }

    @Test(expected = MethodNotAllowedException.class)
    public void whenCreatingReservationFromBundleThenBundleIsExpired() {
        personalEventFixture.invoke(0, 900.0);

        Gym gym = personalEventFixture.getGym();
        Customer customer = personalEventFixture.getCustomer();
        Event event = personalEventFixture.getEvent();
        PersonalTrainingEvent[] e = personalEventFixture.getPersonalEvents();

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> {
            Reservation var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any(Reservation.class));
        Mockito.doAnswer(invocationOnMock -> {
            ATrainingSession res = invocationOnMock.getArgument(0);
            res.setId(1L);
            return res;
        }).when(sessionService).save(any(PersonalTrainingSession.class));
        Mockito.doAnswer(invocationOnMock -> {
            e[0] = invocationOnMock.getArgument(0);
            e[0].setId(1L);
            return e[0];
        }).when(eventService).save(any(PersonalTrainingEvent.class));
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(bundleService).save(any(ATrainingBundle.class));

        facade.createReservation(1L, 1L, 1L, event, "CUSTOMER");

    }

    @Test
    public void whenAdminDeleteReservationToPersonalTrainingEvent() {
        personalEventFixture.invoke(11, 900.0);

        Date start = personalEventFixture.getStart();
        Date end = personalEventFixture.getEnd();
        Customer customer = personalEventFixture.getCustomer();
        ATrainingBundle bundle = personalEventFixture.getBundle();

        ATrainingEvent event = createPersonalEvent(start, end);
        Reservation res = event.createReservation(customer);
        res.setId(1L);
        event.addReservation(res);
        ATrainingSession session = bundle.createSession(event);
        bundle.addSession(session);
        res.setSession(session);
        Gym gym = personalEventFixture.getGym();
        Long gymId = gym.getId();

        Mockito.doReturn(event).when(eventService).findById(1L);
        Mockito.doReturn(res).when(service).findById(1L);
        Mockito.doReturn(gym).when(gymService).findById(1L);

        Reservation actual = facade.deleteReservation(1L, 1L, gymId, customer.getEmail(), "ADMIN");

        Reservation expected = createReservation(1L, customer);
        assertThat(actual).isEqualTo(expected);

        Mockito.verify(eventService).findById(1L);
        Mockito.verify(service).findById(1L);
        Mockito.verify(bundleService).save(any(PersonalTrainingBundle.class));
//        Mockito.verify(service).delete(any(Reservation.class));
//        Mockito.verify(sessionService).delete(any(PersonalTrainingSession.class));

    }

    @Test
    public void whenCustomerDeletesReservationToPersonalTrainingEvent() {
        personalEventFixture.invoke(11, 900.0);

        Date start = personalEventFixture.getStart();
        Date end = personalEventFixture.getEnd();
        Customer customer = personalEventFixture.getCustomer();
        ATrainingBundle bundle = personalEventFixture.getBundle();

        ATrainingEvent event = createPersonalEvent(start, end);
        Reservation res = event.createReservation(customer);
        res.setId(1L);
        event.addReservation(res);
        ATrainingSession session = bundle.createSession(event);
        bundle.addSession(session);
        res.setSession(session);

        Gym gym = personalEventFixture.getGym();
        Long gymId = gym.getId();

        Mockito.doReturn(event).when(eventService).findById(1L);
        Mockito.doReturn(res).when(service).findById(1L);
        Mockito.doReturn(gym).when(gymService).findById(1L);

        Reservation actual = facade.deleteReservation(1L, 1L, gymId, null, "CUSTOMER");

        Reservation expected = createReservation(1L, customer);
        assertThat(actual).isEqualTo(expected);

        Mockito.verify(eventService).findById(1L);
        Mockito.verify(service).findById(1L);
        Mockito.verify(bundleService).save(any(PersonalTrainingBundle.class));
//        Mockito.verify(sessionService).delete(any(PersonalTrainingSession.class));
    }

    @Test
    public void whenAdminDeleteReservationToCourseTrainingEvent() {
        courseEventFixture.invoke(11, true);

        Date start = courseEventFixture.getStart();
        Gym gym = courseEventFixture.getGym();
        Date end = courseEventFixture.getEnd();
        Customer customer = courseEventFixture.getCustomer();
        ATrainingBundle bundle = courseEventFixture.getBundle();

        ATrainingEvent event = createCourseEvent(1L,
                "course", start, end, bundle.getBundleSpec());

        Reservation res = event.createReservation(customer);
        res.setId(1L);
        event.addReservation(res);
        ATrainingSession session = bundle.createSession(event);
        bundle.addSession(session);
        res.setSession(session);

        Mockito.doReturn(event).when(eventService).findById(1L);
        Mockito.doReturn(res).when(service).findById(1L);
        Mockito.doReturn(gym).when(gymService).findById(1L);

        String email = courseEventFixture.getCustomer().getEmail();
        Reservation actual = facade.deleteReservation(1L, 1L, gym.getId(), email, "ADMIN");

        Reservation expected = createReservation(1L, customer);
        // reservation to course automatically confirmed
        expected.setConfirmed(true);
        assertThat(actual).isEqualTo(expected);

        Mockito.verify(eventService).findById(1L);
        Mockito.verify(service).findById(1L);
        Mockito.verify(bundleService).save(any(CourseTrainingBundle.class));

    }


    @Test
    public void whenConfirmPersonalTrainingEvent() {
        personalEventFixture.invoke(11, 900.0);

        Date start = personalEventFixture.getStart();
        Date end = personalEventFixture.getEnd();
        Customer customer = personalEventFixture.getCustomer();
        ATrainingBundle bundle = personalEventFixture.getBundle();

        ATrainingEvent event = createPersonalEvent(start, end);
        Reservation res = event.createReservation(customer);
        res.setId(1L);
        event.addReservation(res);
        ATrainingSession session = bundle.createSession(event);
        bundle.addSession(session);

        Mockito.doReturn(res).when(service).findById(1L);

        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any(Reservation.class));

        Reservation actual = facade.confirm(1L);

        Reservation expected = createReservation(1L, customer);
        expected.setConfirmed(true);
        assertThat(actual).isEqualTo(expected);
    }

    private ATrainingEvent createPersonalEvent(Date startTime, Date endTime) {
        ATrainingEvent evt = new PersonalTrainingEvent();
        evt.setEndTime(startTime);
        evt.setStartTime(endTime);
        evt.setName("Allenamento");
        return evt;
    }

    private static class PersonalTrainingEventFixture {
        private Gym gym;
        private Customer customer;
        private Date start;
        private Date end;
        private Event event;
        private ATrainingBundle bundle;
        private PersonalTrainingEvent[] e;

        public Gym getGym() {
            return gym;
        }

        public Customer getCustomer() {
            return customer;
        }

        public Date getStart() {
            return start;
        }

        public Date getEnd() {
            return end;
        }

        public Event getEvent() {
            return event;
        }

        public PersonalTrainingEvent[] getPersonalEvents() {
            return e;
        }

        public ATrainingBundle getBundle() {
            return bundle;
        }

        public void invoke(int numSessions1, double price1) {
            gym = createGym(1L);
            customer = createCustomer(1L,
                    "customer@customer.com",
                    "",
                    "customer",
                    "customer",
                    true,
                    null);

            List<APurchaseOption> options = createSingletonBundlePurchaseOptions(numSessions1, price1);
            PersonalTrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", options);
            APurchaseOption option = spec.getOptions().get(0);
            bundle = createPersonalBundle(1L, spec, option);
<<<<<<< HEAD
            customer.addToTrainingBundles(Collections.singletonList(bundle));
=======
            customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));
>>>>>>> cb92586... bundle state

            start = getNextMonday();
            end = addHours(start, 1);

            event = new Event();
            event.setStartTime(start);
            event.setEndTime(end);
            event.setExternal(false);
            e = new PersonalTrainingEvent[1];

        }
    }

    private static class CourseTrainingEventFixture {
        private Gym gym;
        private Customer customer;
        private Date start;
        private Date end;
        private CourseTrainingBundle bundle;
        private CourseTrainingEvent event;

        public Gym getGym() {
            return gym;
        }

        public Customer getCustomer() {
            return customer;
        }

        public Date getStart() {
            return start;
        }

        public Date getEnd() {
            return end;
        }

        public ATrainingBundle getBundle() {
            return bundle;
        }

        public CourseTrainingEvent getEvent() {
            return event;
        }

        public void invoke(int maxCustomers, boolean addToCurrentCustomersBundle) {
            gym = createGym(1L);
            customer = createCustomer(1L,
                    "customer@customer.com",
                    "",
                    "customer",
                    "customer",
                    true,
                    null);

            start = getNextMonday();
            end = addHours(start, 1);

            List<APurchaseOption> options = createSingletonTimePurchaseOptions(1, 100.0);
            CourseTrainingBundleSpecification spec = createCourseBundleSpec(1L,
                    "course",
                    maxCustomers,
                    options
            );

            APurchaseOption option = spec.getOptions().get(0);
            bundle = createCourseBundle(1L, start, spec, option);
            if (addToCurrentCustomersBundle)
                customer.addToTrainingBundles(Collections.singletonList(bundle));

            event = createCourseEvent(1L, "test", start, end, spec);
        }
    }
}
