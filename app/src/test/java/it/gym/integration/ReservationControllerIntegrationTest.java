package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.repository.*;
import it.gym.service.ReservationServiceTest;
import it.gym.utility.Calendar;
import it.gym.utility.HateoasTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.session.SessionRepository;
import org.springframework.test.web.servlet.ResultActions;

import javax.transaction.Transactional;
import java.beans.Transient;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static net.bytebuddy.matcher.ElementMatchers.is;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class ReservationControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private UserRepository userRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private GymRepository gymRepository;
    @Autowired private TrainingBundleRepository bundleRepository;
    @Autowired private TrainingBundleSpecificationRepository specRepository;
    @Autowired private TrainingSessionRepository sessionRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private ReservationRepository reservationRepository;

    private Customer customer;
    private Gym gym;
    private ATrainingBundleSpecification personalSpec;
    private ATrainingBundleSpecification courseSpec;
    private PersonalTrainingBundle personal;
    private CourseTrainingBundle course;
    private ATrainingSession session;

    @Before
    public void before() {
        List<Role> roles = createCustomerRoles();
        roles = roleRepository.saveAll(roles);
        customer = (Customer) createCustomer(1L,
                "customer@customer.com",
                "password",
                "customer",
                "customer",
                true,
                roles);
        customer = userRepository.save(customer);
        gym = createGym(1L);
        gym = gymRepository.save(gym);
        personalSpec = createPersonalBundleSpec(1L, "personal");
        Date start = Calendar.getNextMonday();
        Date end = addHours(start, 1);
        courseSpec = createCourseBundleSpec(1L, "course", start, end);

        personalSpec = specRepository.save(personalSpec);
        courseSpec = specRepository.save(courseSpec);

        personal = (PersonalTrainingBundle) personalSpec.createTrainingBundle();
        course = (CourseTrainingBundle) courseSpec.createTrainingBundle();

        personal = bundleRepository.save(personal);
        session = course.createSession(start, end);
        course.addSession(session);
        course = bundleRepository.save(course);
    }

    @After
    public void after() {
        eventRepository.deleteAll();
        reservationRepository.deleteAll();
        bundleRepository.deleteAll();
        sessionRepository.deleteAll();
        specRepository.deleteAll();
        gymRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    public void whenIsAvailablePersonal_BadRequest() throws Exception {
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("test");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/reservations/" + gym.getId()
                + "/isAvailable?customerId=" + customer.getId() + "&bundleId=" + personal.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Non possiedi questo pacchetto"));
    }

    @Test
    public void whenIsAvailablePersonal_NoTrainer() throws Exception {
        customer.addToCurrentTrainingBundles(Collections.singletonList(personal));
        customer = userRepository.save(customer);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("test");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/reservations/"+gym.getId()
                +"/isAvailable?customerId="+customer.getId()+"&bundleId="+personal.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message")
                        .value("Non ci sono personal trainer disponibili"));
        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);
    }

    @Test
    public void whenIsAvailableCourse_NoTrainer() throws Exception {
        customer.addToCurrentTrainingBundles(Collections.singletonList(course));
        customer = userRepository.save(customer);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("test");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/reservations/"+gym.getId()
                +"/isAvailable?customerId="+customer.getId()+"&bundleId="+course.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)).andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Non ci sono personal trainer disponibili"));
        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);
    }

    @Test
    public void whenIsAvailableCourse_OK() throws Exception {
        Trainer trainer = createTrainer(1L);
        userRepository.save(trainer);
        customer.addToCurrentTrainingBundles(Collections.singletonList(course));
        customer = userRepository.save(customer);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("test");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/reservations/"+gym.getId()
                +"/isAvailable?customerId="+customer.getId()+"&bundleId="+course.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)).andExpect(status().isOk());
        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);
    }

    @Test
    @Transactional
    public void whenCreateReservationFromEvent_OK() throws Exception {
        Trainer trainer = createTrainer(1L);
        userRepository.save(trainer);

        Date start = getNextMonday();
        Date end = addHours(start, 1);

        ATrainingSession sess = course.getSessions().get(0);
        CourseEvent event = new CourseEvent();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setName("test");
        event.setSession(sessionRepository.findById(sess.getId()).get());
        event = eventRepository.saveAndFlush(event);

        customer.addToCurrentTrainingBundles(Collections.singletonList(course));
        customer = userRepository.save(customer);


        ResultActions result = mockMvc.perform(get("/reservations/" + gym.getId()
                + "?customerId=" + customer.getId() + "&eventId=" + event.getId()))
                .andExpect(status().isOk());

        Long id = reservationRepository.findAll().get(0).getId();

        Reservation reservation = new Reservation();
        reservation.setConfirmed(true);
        reservation.setId(id);
        reservation.setUser(customer);
        HateoasTest.expectReservation(result, reservation);
        HateoasTest.expectUser(result, reservation.getUser(), "user");
        assertThat(reservationRepository.findAll().size()).isEqualTo(1);
        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);

    }
    
    @Test
    public void whenCreateReservationFromBundle_OK() throws Exception {
        Trainer trainer = createTrainer(1L);
        userRepository.save(trainer);

        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("test");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        customer.addToCurrentTrainingBundles(Collections.singletonList(course));
        customer = userRepository.save(customer);


        ResultActions result = mockMvc.perform(post("/reservations/" + gym.getId()
                + "?customerId=" + customer.getId() + "&bundleId=" + course.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json)).andExpect(status().isOk())
                .andExpect(status().isOk());

        Long id = reservationRepository.findAll().get(0).getId();
        Reservation reservation = new Reservation();
        reservation.setConfirmed(false);
        reservation.setId(id);
        reservation.setUser(customer);
        HateoasTest.expectReservation(result, reservation);
        HateoasTest.expectUser(result, reservation.getUser(), "user");
        assertThat(reservationRepository.findAll().size()).isEqualTo(1);
        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);

    }

    @Test
    public void whenConfirm_OK() throws Exception {
        Trainer trainer = createTrainer(1L);
        userRepository.save(trainer);

        Reservation reservation = new Reservation();
        reservation.setUser(customer);
        reservation.setConfirmed(false);
        reservation = reservationRepository.save(reservation);


        ResultActions result = mockMvc.perform(get("/reservations/" + reservation.getId() + "/confirm"))
                .andExpect(status().isOk());

        Long id = reservationRepository.findAll().get(0).getId();
        reservation.setConfirmed(true);
        reservation.setId(id);
        reservation.setUser(customer);
        HateoasTest.expectReservation(result, reservation);
        HateoasTest.expectUser(result, reservation.getUser(), "user");

        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);

    }

    @Test
    @Transactional
    public void whenDeleteReservationOnCourseEvent_OK() throws Exception {
        Trainer trainer = createTrainer(1L);
        userRepository.save(trainer);
        customer.addToCurrentTrainingBundles(Collections.singletonList(course));
        customer = userRepository.save(customer);

        Reservation reservation = new Reservation();
        reservation.setUser(customer);
        reservation.setConfirmed(false);
        reservation = reservationRepository.save(reservation);

        Date start = getNextMonday();
        Date end = addHours(start, 1);

        ATrainingSession sess = course.getSessions().get(0);
        CourseEvent event = new CourseEvent();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setName("test");
        ArrayList<Reservation> res = new ArrayList<>();
        res.add(reservation);
        event.setReservations(res);
        event.setSession(sessionRepository.findById(sess.getId()).get());
        event = eventRepository.saveAndFlush(event);


        ResultActions result = mockMvc.perform(delete("/reservations/" + reservation.getId()
                + "?eventId="+event.getId()))
                .andExpect(status().isOk());

        reservation.setConfirmed(false);
        reservation.setUser(customer);
        HateoasTest.expectReservation(result, reservation);
        HateoasTest.expectUser(result, reservation.getUser(), "user");

        event.setSession(null);
        event.setReservations(null);

        CourseEvent actual = (CourseEvent) eventRepository.findById(event.getId()).get();
        assertThat(actual).isEqualTo(event);
        assertThat(actual.getReservations()).isEmpty();
        assertThat(sessionRepository.findById(session.getId()).get()).isEqualTo(sess);
        assertThat(bundleRepository.findById(course.getId()).get().getSessions()).isNotEmpty();
        assertThat(reservationRepository.findAll()).isEmpty();
        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);

    }

    @Test
    @Transactional
    public void whenDeleteReservationOnPersonalEvent_OK() throws Exception {
        Trainer trainer = createTrainer(1L);
        userRepository.save(trainer);
        customer.addToCurrentTrainingBundles(Collections.singletonList(personal));
        customer = userRepository.save(customer);

        Reservation reservation = new Reservation();
        reservation.setUser(customer);
        reservation.setConfirmed(false);
        reservation = reservationRepository.save(reservation);

        Date start = getNextMonday();
        Date end = addHours(start, 1);

        ATrainingSession sess = course.getSessions().get(0);
        PersonalEvent event = new PersonalEvent();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setName("test");
        event.setReservation(reservation);
        event.setSession(sessionRepository.findById(sess.getId()).get());
        event = eventRepository.saveAndFlush(event);


        ResultActions result = mockMvc.perform(delete("/reservations/" + reservation.getId()
                + "?eventId="+event.getId()))
                .andExpect(status().isOk());

        reservation.setConfirmed(false);
        reservation.setUser(customer);
        HateoasTest.expectReservation(result, reservation);
        HateoasTest.expectUser(result, reservation.getUser(), "user");

        assertThat(bundleRepository.findById(personal.getId()).get().getSessions()).isNull();
        assertThat(sessionRepository.findAll()).isEmpty();
        assertThat(eventRepository.findAll()).isEmpty();
        assertThat(reservationRepository.findAll()).isEmpty();
        customer.setCurrentTrainingBundles(null);
        customer = userRepository.save(customer);

    }

}
