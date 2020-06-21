package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.repository.*;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import javax.transaction.Transactional;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.testcontainers.shaded.org.apache.commons.lang.time.DateUtils.addDays;

public class ReservationControllerIntegrationTest extends AbstractIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(ReservationControllerIntegrationTest.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private GymRepository gymRepository;

    @Autowired
    private TrainingBundleRepository bundleRepository;

    @Autowired
    private TrainingBundleSpecificationRepository specRepository;

    @Autowired
    private TrainingSessionRepository sessionRepository;

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private ReservationRepository reservationRepository;

    @Autowired
    private RoleRepository roleRepository;


    private final PersonalTrainingEventFixture personalTrainingEventFixture = new PersonalTrainingEventFixture();
    private final CourseTrainingEventFixture courseTrainingEventFixture = new CourseTrainingEventFixture();

    @Test
    @Transactional
    public void whenCreateReservationFromBundleWithBundlePurchaseOptionReturnsOK() throws Exception {
        PersonalTrainingEventFixture fixture = personalTrainingEventFixture.invoke(
                14,
                false,
                false,
                1, 100.0, 30, 100.0, 1, 10.0, 0);

        Long gymId = fixture.getGym().getId();
        Customer customer = fixture.getCustomer();
        ATrainingBundle bundle = fixture.getBundle();

        Object evt = new Object() {
            public final String name = "personal";
            public final Date startTime = fixture.getStart();
            public final Date endTime = fixture.getEnd();
            public final Boolean external = false;
        };

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(evt);
        ResultActions result = mockMvc.perform(post("/reservations/"+gymId)
                .param("customerId", String.valueOf(customer.getId()))
                .param("bundleId", String.valueOf(bundle.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        Reservation reservation = reservationRepository.findAll().get(0);
        expectReservation(result, reservation);
        expectUser(result, reservation.getUser(), "user");

        assertThat(eventRepository.findAll()).isNotEmpty();
        assertThat(sessionRepository.findAll()).isNotEmpty();
        assertThat(reservationRepository.findAll()).isNotEmpty();

        fixture.tearDown();
    }

    @Test
    @Transactional
    public void whenCreateReservationFromBundleWithOnDemandPurchaseOptionReturnsOK() throws Exception {
        PersonalTrainingEventFixture fixture = personalTrainingEventFixture.invoke(
                14,
                false,
                false,
                1,
                100.0,
                30,
                100.0,
                1,
                10.0,
                2);

        Long gymId = fixture.getGym().getId();
        Customer customer = fixture.getCustomer();
        ATrainingBundle bundle = fixture.getBundle();

        Object evt = new Object() {
            public final String name = "personal";
            public final Date startTime = fixture.getStart();
            public final Date endTime = fixture.getEnd();
            public final Boolean external = false;
        };

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(evt);
        ResultActions result = mockMvc.perform(post("/reservations/"+gymId)
                .param("customerId", String.valueOf(customer.getId()))
                .param("bundleId", String.valueOf(bundle.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        Reservation reservation = reservationRepository.findAll().get(0);
        expectReservation(result, reservation);
        expectUser(result, reservation.getUser(), "user");

        assertThat(eventRepository.findAll()).isNotEmpty();
        assertThat(sessionRepository.findAll()).isNotEmpty();
        assertThat(reservationRepository.findAll()).isNotEmpty();

        fixture.tearDown();
    }

    @Test
    @Transactional
    public void whenConfirmCourseEventReservationReturnsOK() throws Exception {
        courseTrainingEventFixture.invoke(0, true, true, 0, 1, 100.0, 30, 100.0, 1, 10.0, 11);
        Reservation reservation = courseTrainingEventFixture.getReservation();

        ResultActions result = mockMvc.perform(get("/reservations/"+reservation.getId()+"/confirm"))
                .andExpect(status().isOk());

        reservation = reservationRepository.findAll().get(0);
        expectReservation(result, reservation);
        expectUser(result, reservation.getUser(), "user");

        assertThat(eventRepository.findAll()).isNotEmpty();
        assertThat(sessionRepository.findAll()).isNotEmpty();
        assertThat(reservationRepository.findAll()).isNotEmpty();

        courseTrainingEventFixture.tearDown();
    }

    @Test
    @Transactional
    public void whenConfirmPersonalEventReservationReturnsOK() throws Exception {
        personalTrainingEventFixture.invoke(0, true, true, 1, 100.0, 30, 100.0, 1, 10.0, 1);
        Reservation reservation = personalTrainingEventFixture.getReservation();

        ResultActions result = mockMvc.perform(get("/reservations/"+ reservation.getId() +"/confirm"))
                .andExpect(status().isOk());

        reservation = reservationRepository.findAll().get(0);
        expectReservation(result, reservation);
        expectUser(result, reservation.getUser(), "user");

        assertThat(eventRepository.findAll()).isNotEmpty();
        assertThat(sessionRepository.findAll()).isNotEmpty();
        assertThat(reservationRepository.findAll()).isNotEmpty();

        personalTrainingEventFixture.tearDown();
    }

    @Test
    @Transactional
    public void whenDeleteReservationOnCourseEventReturnsOK() throws Exception {
        courseTrainingEventFixture.invoke(0, true, true, 0, 1, 100.0, 30, 100.0, 1, 10.0, 11);
        Reservation reservation = courseTrainingEventFixture.getReservation();
        Gym gym = courseTrainingEventFixture.getGym();
        CourseTrainingEvent event = courseTrainingEventFixture.getCourseEvent();

        logger.info(sessionRepository.findAll().toString());
        ResultActions result = mockMvc.perform(delete("/reservations/" + reservation.getId())
                .param("eventId", String.valueOf(event.getId()))
                .param("gymId", String.valueOf(gym.getId())))
                .andExpect(status().isOk());

        expectReservation(result, reservation);
        Customer user = reservation.getUser();
        expectUser(result, user, "user");
        expectCustomerRoles(result, user.getRoles(), "user.roles");

        CourseTrainingEvent actualEvent = (CourseTrainingEvent) eventRepository.findById(event.getId()).get();
        ATrainingBundle actualBundle = bundleRepository.findAll().get(0);

        assertThat(actualEvent).isEqualTo(event);
        assertThat(actualEvent.getReservations().size()).isEqualTo(0);
//        assertThat(actualEvent.getSessions().size()).isEqualTo(0);
        assertThat(actualBundle).isEqualTo(courseTrainingEventFixture.getBundle());

        assertThat(eventRepository.findAll()).isNotEmpty();

        logger.info(sessionRepository.findAll().toString());
        assertThat(sessionRepository.findAll().size()).isEqualTo(0);
        assertThat(reservationRepository.findAll().size()).isEqualTo(0);

        courseTrainingEventFixture.tearDown();
    }

    @Test
    @Transactional
    public void whenDeleteReservationOnPersonalEventThenOK() throws Exception {

        personalTrainingEventFixture.invoke(0, true,true,
                1, 100.0, 30, 100.0, 1, 10.0, 1);

        Customer customer = personalTrainingEventFixture.getCustomer();
        Reservation reservation = personalTrainingEventFixture.getReservation();
        PersonalTrainingEvent event = personalTrainingEventFixture.getPersonalEvent();
        Gym gym = personalTrainingEventFixture.getGym();

        ResultActions result = mockMvc.perform(delete("/reservations/" + reservation.getId())
                .param( "eventId", String.valueOf(event.getId()))
                .param( "gymId", String.valueOf(gym.getId())))
                .andExpect(status().isOk());

        expectReservation(result, reservation);
        expectUser(result, customer, "user");
        expectCustomerRoles(result, customer.getRoles(), "user.roles");

        assertThat(eventRepository.findAll()).isEmpty();
        assertThat(sessionRepository.findAll()).isEmpty();
        assertThat(reservationRepository.findAll()).isEmpty();
        assertThat(bundleRepository.findAll().get(0)).isEqualTo(personalTrainingEventFixture.getBundle());

        personalTrainingEventFixture.tearDown();
    }

    private class CourseTrainingEventFixture {
        private Gym gym;
        private Customer customer;
        private ATrainingBundle bundle;
        private CourseTrainingEvent event;
        private Reservation reservation;
        private ATrainingSession session;

        public Gym getGym() {
            return gym;
        }

        public Customer getCustomer() {
            return customer;
        }

        public CourseTrainingEvent getCourseEvent() {
            return event;
        }

        public ATrainingBundle getBundle() {
            return bundle;
        }

        public Reservation getReservation() {
            return reservation;
        }

        public ATrainingSession getSession() {
            return session;
        }

        public void invoke(int days, boolean hasReservation, boolean hasEvent, int optionIndex, int number1, double price1, int number2, double price2, int number3, double price3, int maxCustomers) {
            gym = createGym(1L);
            gym = gymRepository.save(gym);

            List<Role> roles = createCustomerRoles();
            roles = roleRepository.saveAll(roles);
            customer = createCustomer(1L,
                    "user@user.com",
                    "",
                    "customer",
                    "customer",
                    true,
                    roles);
            customer = userRepository.save(customer);

            List<APurchaseOption> options = createAllOptions(number1, price1, number2, price2, number3, price3);
            CourseTrainingBundleSpecification spec = createCourseBundleSpec(1L, "course", maxCustomers, options);

            spec = specRepository.save(spec);
            APurchaseOption option = spec.getOptions().get(optionIndex);
            bundle = createCourseBundle(1L, getNextMonday(), spec, option);
            bundle = bundleRepository.save(bundle);

            if (hasEvent) {
                Date start = addDays(getNextMonday(), days);
                Date end = addHours(start, 1);
                event = new CourseTrainingEvent();
                event.setId(1L);
                event.setStartTime(start);
                event.setEndTime(end);
                event.setName("personal");
                event.setSpecification(spec);
            }

            if (hasReservation) {
                reservation = createReservation(1L, customer);
                reservation = reservationRepository.save(reservation);
                event.addReservation(reservation);

                session = bundle.createSession(event);
                bundle.addSession(session);
                bundle = bundleRepository.save(bundle);

                session = bundle.getSessions().get(0);
                reservation.setSession(session);
            }

            customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));
            customer = userRepository.save(customer);

            if (hasEvent) {
                event = eventRepository.save(event);
            }

        }

        public void tearDown() {
            eventRepository.deleteAll();
            reservationRepository.deleteAll();
            sessionRepository.deleteAll();

            gymRepository.deleteAll();
            customer.setCurrentTrainingBundles(null);
            userRepository.deleteAll();

            bundleRepository.deleteAll();
            specRepository.deleteAll();
        }
    }

    private class PersonalTrainingEventFixture {
        private Gym gym;
        private Customer customer;
        private ATrainingBundle bundle;
        private PersonalTrainingEvent event;
        private Reservation reservation;
        private ATrainingSession session;
        private Date start;
        private Date end;

        public Gym getGym() {
            return gym;
        }

        public Customer getCustomer() {
            return customer;
        }

        public PersonalTrainingEvent getPersonalEvent() {
            return event;
        }

        public ATrainingBundle getBundle() {
            return bundle;
        }

        public Reservation getReservation() {
            return reservation;
        }

        public ATrainingSession getSession() {
            return session;
        }

        public Date getStart() {
            return start;
        }

        public Date getEnd() {
            return end;
        }

        public PersonalTrainingEventFixture invoke(int days, boolean hasReservation, boolean hasEvent, int number1, double price1, int number2, double price2, int number3, double price3, int optionIndex) {

            gym = createGym(1L);
            gym = gymRepository.save(gym);

            List<Role> roles = createCustomerRoles();
            roles = roleRepository.saveAll(roles);
            customer = createCustomer(1L,
                    "user@user.com",
                    "",
                    "customer",
                    "customer",
                    true,
                    roles);
            customer = userRepository.save(customer);

            List<APurchaseOption> options = createAllOptions(number1, price1, number2, price2, number3, price3);
            PersonalTrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", options);

            spec = specRepository.save(spec);
            APurchaseOption option = spec.getOptions().get(optionIndex);
            bundle = createPersonalBundle(1L, spec, option);

            start = addDays(getNextMonday(), days);
            end = addHours(start, 1);


            if (hasEvent) {
                event = new PersonalTrainingEvent();
                event.setId(1L);
                event.setStartTime(start);
                event.setEndTime(end);
                event.setName("personal");
                event = eventRepository.save(event);
            }

            if (hasReservation) {
                reservation = createReservation(1L, customer);
                reservation.setEvent(event);
                reservation = reservationRepository.save(reservation);
            }

            if (hasReservation) {
                session = bundle.createSession(event);
                bundle.addSession(session);
            }
            bundle = bundleRepository.save(bundle);

            customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));
            customer = userRepository.save(customer);

            if (hasEvent) {
                session = bundle.getSessions().get(0);
                reservation.setSession(session);
                reservation = reservationRepository.save(reservation);
            }

            return this;
        }

        public void tearDown() {
            reservationRepository.deleteAll();
            eventRepository.deleteAll();

            gymRepository.deleteAll();
            customer.setCurrentTrainingBundles(null);
            userRepository.deleteAll();

            bundleRepository.deleteAll();
            specRepository.deleteAll();
        }
    }
}
