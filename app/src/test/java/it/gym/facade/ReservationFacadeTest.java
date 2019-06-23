package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.*;
import it.gym.service.*;
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

import java.time.DayOfWeek;
import java.util.*;

import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;

@RunWith(SpringRunner.class)
public class ReservationFacadeTest {

    @MockBean private ReservationService service;
    @MockBean private GymService gymService;
    @MockBean private CustomerService customerService;
    @MockBean private TrainerService trainerService;
    @MockBean private EventService timeService;
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
    public void isNotDoublyBooked() {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Europe/Rome"), Locale.ITALY);
        cal.set(2019, Calendar.JUNE, 8, 10, 0);
        Date start = cal.getTime();
        Date end = addHours(start, 1);
        Mockito.doReturn(createCustomer()).when(customerService).findById(1L);
        facade.isDoublyBooked(1L, start, end);
    }

    @Test(expected = BadRequestException.class)
    public void isDoublyBooked() {
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("Europe/Rome"), Locale.ITALY);
        cal.set(2019, Calendar.JUNE, 8, 10, 0);
        Date start = cal.getTime();
        Date end = addHours(start, 1);
        Mockito.doReturn(createCustomer()).when(customerService).findById(1L);
        Reservation reservation = createReservation(createCustomer(), createSession(createBundle()));
        Mockito.doReturn(Collections.singletonList(reservation)).when(service).findByInterval(1L, start, end);
        facade.isDoublyBooked(1L, start, end);
    }

    @Test
    public void isOnTime() {
        Date start = getNextMonday();
        facade.isOnTime(start);
    }

    @Test(expected = BadRequestException.class)
    public void isNotOnTime() {
        Date start = new Date();
        facade.isOnTime(start);
    }

    @Test
    public void deleteExpiredBundles() {
        Customer customer = createCustomer();
        customer.setCurrentTrainingBundles(Collections.emptyList());
        facade.deleteExpiredBundles(customer);
    }

    @Test(expected = BadRequestException.class)
    public void noBundleLeft() {
        Customer customer = createCustomer();
        customer.setCurrentTrainingBundles(Collections.emptyList());
        facade.isBundleLeft(customer);
    }

    @Test
    public void someBundlesLeft() {
        Customer customer = createCustomer();
        ATrainingBundle spec = createBundle();
        customer.addToCurrentTrainingBundles(Collections.singletonList(spec));
        facade.isBundleLeft(customer);
    }

    @Test
    public void hasNoHolidays() {
        facade.hasHolidays(Collections.emptyList());
    }

    @Test(expected = BadRequestException.class)
    public void hasHolidays() {
        List<AEvent> holidays = Collections.singletonList(createHoliday(createAdmin()));
        facade.hasHolidays(holidays);
    }

    @Test
    public void hasTrainers() {
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        facade.isTrainerAvailable(Collections.emptyList(), new Date(), new Date());
    }

    @Test(expected = BadRequestException.class)
    public void hasNoAvailableTrainers() {
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        List<AEvent> timesOff = Collections.singletonList(createTimeOff(createTrainer()));
        facade.isTrainerAvailable(timesOff, new Date(), new Date());
    }

    @Test
    public void trainersHaveOtherReservations() {
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        facade.isTrainerAvailable(Collections.emptyList(), new Date(), new Date());
    }

    @Test
    public void isAvailable() {
        Customer customer = createCustomer();
        Mockito.doReturn(createGym()).when(gymService).findById(1L);
        Mockito.doReturn(customer).when(customerService).findById(1L);
        Mockito.doReturn(1L).when(trainerService).countAllTrainer();
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0))
                .when(customerService).save(any(Customer.class));
        ATrainingBundle spec = createBundle();
        customer.addToCurrentTrainingBundles(Collections.singletonList(spec));
        Date start = getNextMonday();
        Date end = DateUtils.addHours(start, 1);

        facade.isAvailable(1L, 1L, start, end);
    }



    @Test
    public void book() {
        Customer customer = createCustomer();

        Mockito.doReturn(createGym()).when(gymService).findById(1L);
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
            Reservation res = invocationOnMock.getArgument(0);
            res.setId(1L);
            res.getSession().setId(1L);
            return res;
        }).when(service).save(any(Reservation.class));

        ATrainingBundle spec = createBundle();
        customer.addToCurrentTrainingBundles(Collections.singletonList(spec));

        Date start = getNextMonday();
        Date end = DateUtils.addHours(start, 1);

        Reservation actual = facade.book(1L, 1L, start, end);

        ATrainingSession actualSession = actual.getSession();
        ATrainingBundle actualBundle = actualSession.getTrainingBundle();

        assertThat(actualBundle).isEqualTo(customer.getCurrentTrainingBundles().get(0));

        PersonalTrainingSession expectedSession = new PersonalTrainingSession();
        expectedSession.setCompleted(false);
        expectedSession.setId(1L);
        expectedSession.setTrainingBundle(actualBundle);
        expectedSession.setStartTime(start);
        expectedSession.setEndTime(end);

        assertThat(actual.getSession()).isEqualTo(expectedSession);

        Reservation expected = createReservation(customer, (PersonalTrainingSession) actual.getSession());

        assertThat(actual).isEqualTo(expected);
    }

    @Test
    public void customerDeleteReservation() {
        Customer customer = createCustomer();
        Role role = new Role();
        role.setId(1L);
        role.setName("CUSTOMER");
        customer.setRoles(Collections.singletonList(role));
        String email = "customer@customer.com";
        ATrainingBundle bundle = createBundle();
        PersonalTrainingSession session = createSession(bundle);
        bundle.addSession(session);

        Reservation reservation = createReservation(customer, session);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doReturn(customer).when(userService).findByEmail(email);

        Reservation actual = facade.cancel(1L, email, "customer");

        Mockito.verifyZeroInteractions(mailService);
        assertThat(actual).isEqualTo(createReservation(customer, session));
    }

    @Test
    public void adminDeleteReservation() {
        Customer customer = createCustomer();
        Role role = new Role();
        role.setId(1L);
        role.setName("CUSTOMER");
        customer.setRoles(Collections.singletonList(role));
        String email = "customer@customer.com";
        ATrainingBundle bundle = createBundle();
        PersonalTrainingSession session = createSession(bundle);
        bundle.addSession(session);

        Reservation reservation = createReservation(customer, session);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doReturn(customer).when(userService).findByEmail(email);

        Reservation actual = facade.cancel(1L, email, "admin");

        Mockito.verify(mailService).sendSimpleMail(anyString(), anyString(), anyString());
        assertThat(actual).isEqualTo(createReservation(customer, session));
    }

    @Test
    public void confirm() {
        Customer customer = createCustomer();

        ATrainingBundle bundle = createBundle();
        PersonalTrainingSession session = createSession(bundle);
        bundle.addSession(session);

        Reservation reservation = createReservation(customer, session);
        Mockito.doReturn(reservation).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Reservation actual = facade.confirm(1L);

        Reservation expected = createReservation(customer, session);
        expected.setConfirmed(true);
        assertThat(actual).isEqualTo(expected);
    }

    @Test
    public void complete() {
        Date start = DateUtils.addHours(new Date(), -6);
        Date end = DateUtils.addHours(start, 1);
        ATrainingBundle bundle = createBundle();
        PersonalTrainingSession session = createSession(start, end, bundle);
        bundle.addSession(session);

        Mockito.doReturn(session).when(sessionService).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(sessionService).save(any());
        ATrainingSession actual = facade.complete(1L);

        PersonalTrainingSession expected = createSession(start, end, bundle);
        expected.setCompleted(true);

        assertThat(actual).isEqualTo(expected);
    }

    private Reservation createReservation(Customer customer, PersonalTrainingSession session) {
        Reservation expected = new Reservation();
        expected.setStartTime(session.getStartTime());
        expected.setEndTime(session.getEndTime());
        expected.setConfirmed(false);
        expected.setUser(customer);
        expected.setId(1L);
        expected.setSession(session);
        return expected;
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

    private AEvent createTimeOff(Trainer trainer) {
        TimeOff time = new TimeOff();
        time.setId(2L);
        time.setName("my time");
        time.setStartTime(new Date());
        time.setEndTime(new Date());
        time.setUser(trainer);
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


    private Admin createAdmin() {
        Admin user = new Admin();
        user.setId(2L);
        user.setEmail("admin@admin.com");
        user.setFirstName("admin");
        user.setLastName("admin");
        return user;
    }

    private AEvent createHoliday(Admin admin) {
        AEvent time = new Holiday();
        time.setId(1L);
        time.setName("my time");
        time.setStartTime(new Date());
        time.setEndTime(new Date());
        return time;
    }

    private Customer createCustomer() {
        Customer user = new Customer();
        user.setId(1L);
        user.setEmail("customer@customer.com");
        user.setFirstName("customer");
        user.setLastName("customer");
        return user;
    }

    private PersonalTrainingSession createSession(ATrainingBundle bundleSpec) {
        PersonalTrainingSession pt = new PersonalTrainingSession();
        pt.setCompleted(false);
        pt.setStartTime(new Date());
        pt.setEndTime(new Date());
        pt.setId(1L);
        pt.setTrainingBundle(bundleSpec);
        return pt;
    }

    private PersonalTrainingSession createSession(Date start, Date end, ATrainingBundle bundleSpec) {
        PersonalTrainingSession pt = new PersonalTrainingSession();
        pt.setCompleted(false);
        pt.setStartTime(start);
        pt.setEndTime(end);
        pt.setId(1L);
        pt.setTrainingBundle(bundleSpec);
        return pt;
    }

    private ATrainingBundle createBundle() {
        PersonalTrainingBundle pt = new PersonalTrainingBundle();
        pt.setName("Winter Pack");
        pt.setNumSessions(11);
        pt.setPrice(111.0);
        pt.setDescription("Description");
        pt.setId(1L);
        return pt;
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
