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

public class ReservationControllerIntegrationTest extends AbstractIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(ReservationControllerIntegrationTest.class);

    @Autowired private UserRepository userRepository;
    @Autowired private GymRepository gymRepository;
    @Autowired private TrainingBundleRepository bundleRepository;
    @Autowired private TrainingBundleSpecificationRepository specRepository;
    @Autowired private TrainingSessionRepository sessionRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private RoleRepository roleRepository;

    @Test
    @Transactional
    public void whenCreateReservationFromBundleReturnsOK() throws Exception {
        PersonalTrainingEventFixture fixture = new PersonalTrainingEventFixture().invoke(false, false);
        Long gymId = fixture.getGym().getId();
        Customer customer = fixture.getCustomer();
        ATrainingBundle bundle = fixture.getBundle();

        Object evt = new Object() {
            public final String name = "personal";
            public final Date startTime = fixture.getStart();
            public final Date endTime = fixture.getEnd();
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
    public void whenCreateReservationFromEventReturnsOK() throws Exception {
        CourseTrainingEventFixture fixture = new CourseTrainingEventFixture().invoke(false, true);
        Long gymId = fixture.getGym().getId();
        Customer customer = fixture.getCustomer();
        CourseTrainingEvent event = fixture.getCourseEvent();
        ATrainingBundle bundle = fixture.getBundle();

        ResultActions result = mockMvc.perform(get("/reservations/"+gymId)
                .param("customerId", String.valueOf(customer.getId()))
                .param("eventId", String.valueOf(event.getId()))
                .param("bundleId", String.valueOf(bundle.getId())))
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
    public void whenIsAvailableReturnsOK() throws Exception {
        PersonalTrainingEventFixture fixture = new PersonalTrainingEventFixture().invoke(false, false);
        Long gymId = fixture.getGym().getId();
        Customer customer = fixture.getCustomer();
        ATrainingBundle bundle = fixture.getBundle();

        Object evt = new Object() {
            public final Date startTime = fixture.getStart();
            public final Date endTime = fixture.getEnd();
        };

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(evt);
        mockMvc.perform(post("/reservations/"+ gymId + "/isAvailable")
                .param("customerId", String.valueOf(customer.getId()))
                .param("bundleId", String.valueOf(bundle.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        assertThat(eventRepository.findAll()).isEmpty();
        assertThat(sessionRepository.findAll()).isEmpty();
        assertThat(reservationRepository.findAll()).isEmpty();

        fixture.tearDown();
    }

    @Test
    @Transactional
    public void whenConfirmCourseEventReservationReturnsOK() throws Exception {
        CourseTrainingEventFixture fixture = new CourseTrainingEventFixture().invoke(true, true);
        Reservation reservation = fixture.getReservation();

        ResultActions result = mockMvc.perform(get("/reservations/"+reservation.getId()+"/confirm"))
                .andExpect(status().isOk());

        reservation = reservationRepository.findAll().get(0);
        expectReservation(result, reservation);
        expectUser(result, reservation.getUser(), "user");

        assertThat(eventRepository.findAll()).isNotEmpty();
        assertThat(sessionRepository.findAll()).isNotEmpty();
        assertThat(reservationRepository.findAll()).isNotEmpty();

        fixture.tearDown();
    }

    @Test
    @Transactional
    public void whenConfirmPersonalEventReservationReturnsOK() throws Exception {
        PersonalTrainingEventFixture fixture = new PersonalTrainingEventFixture().invoke(true, true);
        Reservation reservation = fixture.getReservation();

        ResultActions result = mockMvc.perform(get("/reservations/"+ reservation.getId() +"/confirm"))
                .andExpect(status().isOk());

        reservation = reservationRepository.findAll().get(0);
        expectReservation(result, reservation);
        expectUser(result, reservation.getUser(), "user");

        assertThat(eventRepository.findAll()).isNotEmpty();
        assertThat(sessionRepository.findAll()).isNotEmpty();
        assertThat(reservationRepository.findAll()).isNotEmpty();

        fixture.tearDown();
    }

    @Test
    @Transactional
    public void whenDeleteReservationOnCourseEventReturnsOK() throws Exception {
        CourseTrainingEventFixture fixture = new CourseTrainingEventFixture().invoke(true, true);
        Reservation reservation = fixture.getReservation();
        CourseTrainingEvent event = fixture.getCourseEvent();

        logger.info(sessionRepository.findAll().toString());
        ResultActions result = mockMvc.perform(delete("/reservations/" + reservation.getId())
                .param("eventId", String.valueOf(event.getId())))
                .andExpect(status().isOk());

        expectReservation(result, reservation);
        Customer user = reservation.getUser();
        expectUser(result, user, "user");
        expectCustomerRoles(result, user.getRoles(), "user.roles");

        CourseTrainingEvent actualEvent = (CourseTrainingEvent) eventRepository.findById(event.getId()).get();
        ATrainingBundle actualBundle = bundleRepository.findAll().get(0);

        assertThat(actualEvent).isEqualTo(event);
        assertThat(actualEvent.getReservations().size()).isEqualTo(0);
        assertThat(actualEvent.getSessions().size()).isEqualTo(0);
        assertThat(actualBundle).isEqualTo(fixture.getBundle());

        assertThat(eventRepository.findAll()).isNotEmpty();

        logger.info(sessionRepository.findAll().toString());
        assertThat(sessionRepository.findAll().size()).isEqualTo(0);
        assertThat(reservationRepository.findAll().size()).isEqualTo(0);

        fixture.tearDown();
    }

    @Test
    @Transactional
    public void whenDeleteReservationOnPersonalEventThenOK() throws Exception {

        PersonalTrainingEventFixture fixture = new PersonalTrainingEventFixture().invoke(true, true);
        Customer customer = fixture.getCustomer();
        Reservation reservation = fixture.getReservation();
        PersonalTrainingEvent event = fixture.getPersonalEvent();

        ResultActions result = mockMvc.perform(delete("/reservations/" + reservation.getId())
                .param( "eventId", String.valueOf(event.getId())))
                .andExpect(status().isOk());

        expectReservation(result, reservation);
        expectUser(result, customer, "user");
        expectCustomerRoles(result, customer.getRoles(), "user.roles");

        assertThat(eventRepository.findAll()).isEmpty();
        assertThat(sessionRepository.findAll()).isEmpty();
        assertThat(reservationRepository.findAll()).isEmpty();
        assertThat(bundleRepository.findAll().get(0)).isEqualTo(fixture.getBundle());

        fixture.tearDown();
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

        public CourseTrainingEventFixture invoke(boolean hasReservation, boolean hasEvent) {
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

            CourseTrainingBundleSpecification spec =
                    createCourseBundleSpec(1L, "personal", 11, 1, 111.0);
            spec = specRepository.save(spec);
            bundle = createCourseBundle(1L, getNextMonday(), spec, spec.getOptions().get(0));
            bundle = bundleRepository.save(bundle);

            if (hasEvent) {
                Date start = getNextMonday();
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
                event.addSession(reservation.getId(), session);
            }

            customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));
            customer = userRepository.save(customer);

            if (hasEvent) {
                event = eventRepository.save(event);
            }
            
            return this;
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

        public PersonalTrainingEventFixture invoke(boolean hasReservation, boolean hasEvent) {

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

            PersonalTrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", 11);
            spec = specRepository.save(spec);
            bundle = createPersonalBundle(1L, spec);

            start = getNextMonday();
            end = addHours(start, 1);


            if (hasEvent) {
                event = new PersonalTrainingEvent();
                event.setId(1L);
                event.setStartTime(start);
                event.setEndTime(end);
                event.setName("personal");
            }

            if (hasReservation) {
                reservation = createReservation(1L, customer);
                reservation = reservationRepository.save(reservation);
                event.setReservation(reservation);
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
                event.setSession(session);
                event = eventRepository.save(event);
            }

            return this;
        }

        public void tearDown() {
            eventRepository.deleteAll();

            gymRepository.deleteAll();
            customer.setCurrentTrainingBundles(null);
            userRepository.deleteAll();

            bundleRepository.deleteAll();
            specRepository.deleteAll();
        }
    }
}
