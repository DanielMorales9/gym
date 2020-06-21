package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.repository.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.expectEvent;
import static it.gym.utility.HateoasTest.expectAUser;
import static org.apache.commons.lang3.time.DateUtils.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class EventControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired private GymRepository gymRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TrainingBundleSpecificationRepository specRepository;
    @Autowired private TrainingSessionRepository sessionRepository;
    @Autowired private TrainingBundleRepository bundleRepository;

    private Gym gym;
    private AEvent event;
    private Trainer trainer;
    private CourseTrainingBundleSpecification courseSpec;
    private CourseTrainingBundle courseBundle;

    @Before
    public void before() {
        gym = createGym(1L);
        gym = gymRepository.save(gym);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        event = createHoliday(1L, "closed", start, end);
        event = eventRepository.save(event);
        trainer = createTrainer(1L);
        trainer = userRepository.save(trainer);

        List<APurchaseOption> options = createSingletonTimePurchaseOptions(1, 100.0);
        courseSpec = createCourseBundleSpec(1L, "course", 1, options);

        options = createSingletonBundlePurchaseOptions(30, 900.0);
        PersonalTrainingBundleSpecification personalSpec = createPersonalBundleSpec(1L, "personal", options);
        courseSpec = specRepository.save(courseSpec);
        personalSpec = specRepository.save(personalSpec);
        Long optionId = personalSpec.getOptions().get(0).getId();
        ATrainingBundle personalBundle = personalSpec.createTrainingBundle(optionId);
        personalBundle = bundleRepository.save(personalBundle);
        APurchaseOption option = courseSpec.getOptions().get(0);
        courseBundle = createCourseBundle(1L, start, courseSpec, option);
        courseBundle = bundleRepository.save(courseBundle);
    }

    @After
    public void after() {
        reservationRepository.deleteAll();
        sessionRepository.deleteAll();
        bundleRepository.deleteAll();
        eventRepository.deleteAll();
        specRepository.deleteAll();
        userRepository.deleteAll();
        gymRepository.deleteAll();
    }

    @Test
    public void whenCreateHolidayReturnsOK() throws Exception {
        Date start = addHours(getNextMonday(), 24);
        Date end = addHours(start, 1);

        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("closed1");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        ResultActions result = mockMvc.perform(post("/events/" + gym.getId() + "/holiday")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        AEvent h = eventRepository.findAll().get(1);
        expectEvent(result, h);
    }

    @Test
    public void whenFindByIdReturnsOK() throws Exception {
        ResultActions result = mockMvc.perform(get("/events/" + event.getId()))
                .andExpect(status().isOk());

        expectEvent(result, event);
    }

    @Test
    public void whenCreateHolidayReturnsException() throws Exception {
        Date start = addHours(getNextMonday(), 24);
        Date end = addHours(start, 1);

        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("closed1");

        Customer customer = createCustomer(1L,
                "customer@customer.com",
                "",
                "customer",
                "customer",
                true,
                null);

        customer = userRepository.save(customer);
        CourseTrainingEvent courseEvent = createCourseEvent(1L, "course", start, end, courseSpec);
        Reservation res = courseEvent.createReservation(customer);
        courseEvent.addReservation(res);

        courseEvent = eventRepository.save(courseEvent);
        res = courseEvent.getReservations().get(0);

        ATrainingSession session = courseBundle.createSession(courseEvent);
        courseBundle.addSession(session);
        // TODO
//        courseEvent.addSession(res.getId(), session);
        eventRepository.save(courseEvent);
        courseBundle = bundleRepository.save(courseBundle);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/events/" + gym.getId() + "/holiday")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenDeleteHolidayReturnsOK() throws Exception {
        ResultActions result = mockMvc.perform(delete("/events/holiday/"+event.getId()))
                .andExpect(status().isOk());

        expectEvent(result, event);
    }

    @Test
    public void whenEditHolidayReturnsOK() throws Exception {
        ObjectMapper objectMapper = new ObjectMapper();
        event.setName("closed1");
        String json = objectMapper.writeValueAsString(event);
        ResultActions result = mockMvc.perform(patch("/events/"+gym.getId()+"/holiday/"+event.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        expectEvent(result, event);
    }

    @Test
    public void whenEditTimeOffReturnsOK() throws Exception {
        Date start = addHours(getNextMonday(), 24);
        Date end = addHours(start, 1);
        TimeOff timeOff = (TimeOff) createTimeOff(1L, "closed", start, end, trainer);
        timeOff = eventRepository.save(timeOff);

        ObjectMapper objectMapper = new ObjectMapper();
        timeOff.setName("off1");
        String json = objectMapper.writeValueAsString(timeOff);
        ResultActions result = mockMvc.perform(patch("/events/"+gym.getId()+"/timeOff/"+timeOff.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        expectEvent(result, timeOff);
    }

    @Test
    public void whenCreateTimeOffReturnsOK() throws Exception {
        Event e = new Event();
        Date start = addHours(getNextMonday(), 24);
        Date end = addHours(start, 1);
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("closed1");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        ResultActions result = mockMvc.perform(post("/events/" + gym.getId() + "/timeOff?trainerId="+ trainer.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        AEvent h = eventRepository.findAll().get(1);
        TimeOff expected = new TimeOff();
        expected.setUser(trainer);
        expected.setName("closed1");
        expected.setStartTime(start);
        expected.setEndTime(end);
        expected.setId(h.getId());
        expectEvent(result, expected);
        expectAUser(result, trainer, "user");
    }

    @Test
    public void whenCreateCourseEventOK() throws Exception {
        Date start = addHours(getNextMonday(), 24);
        Date end = addHours(start, 1);

        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setExternal(false);
        e.setId(courseSpec.getId());
        e.setName("course");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        ResultActions result = mockMvc.perform(post("/events/" + gym.getId() + "/course")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        AEvent h = eventRepository.findAll().get(1);
        CourseTrainingEvent expected = new CourseTrainingEvent();
        expected.setName("course");
        expected.setStartTime(start);
        expected.setEndTime(end);
        expected.setId(h.getId());
        expected.setSpecification(courseSpec);
        expectEvent(result, expected);
    }

    @Test
    public void whenDeleteCourseEvent_OK() throws Exception {
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        // TODO this should be a fixture separate class
        CourseTrainingEvent event = eventRepository.save(createCourseEvent(1L, "course", start, end, courseSpec));

        ATrainingSession session = sessionRepository.save(courseBundle.createSession(event));
        ATrainingSession session1 = sessionRepository.save(courseBundle.createSession(event));

        courseBundle.addSession(session);
        courseBundle.addSession(session1);

        Customer customer = createCustomer(1L,
                "test@test.com",
                "test",
                "test",
                "test",
                true,
                null);
        customer = userRepository.save(customer);

        Customer customer1 = createCustomer(2L,
                "test1@test1.com",
                "test",
                "test1",
                "test1",
                true,
                null);
        customer1 = userRepository.save(customer1);

        Reservation reservation = createReservation(1L, customer);
        Reservation reservation1 = createReservation(2L, customer1);

        reservation.setSession(session);
        reservation1.setSession(session1);

        reservation.setEvent(event);
        reservation1.setEvent(event);

        reservationRepository.save(reservation);
        reservationRepository.save(reservation1);

        assertThat(reservationRepository.findAll().size()).isEqualTo(2);
        ResultActions result = mockMvc.perform(delete("/events/course/" + event.getId()))
                .andExpect(status().isOk());

        CourseTrainingEvent expected = new CourseTrainingEvent();
        expected.setName("course");
        expected.setStartTime(start);
        expected.setEndTime(end);
        expected.setId(event.getId());
        expected.setSpecification(courseSpec);
        expectEvent(result, expected);
        assertThat(reservationRepository.findAll().size()).isEqualTo(0);
        assertThat(sessionRepository.findAll().size()).isEqualTo(0);
    }

    @Test
    public void whenCompleteThenOK() throws Exception {
        Date start = addDays(getNextMonday(), -30);
        Date end = addHours(start, 1);

        event = createCourseEvent(1L, "course", start, end, courseSpec);
        event = eventRepository.save(event);
        ATrainingSession session = courseBundle.createSession((ATrainingEvent) event);
        courseBundle.addSession(session);

        ResultActions result = mockMvc.perform(get("/events/" + event.getId()+"/complete"))
                .andExpect(status().isOk());

        CourseTrainingEvent expected = new CourseTrainingEvent();
        expected.setName("course");
        expected.setStartTime(start);
        expected.setEndTime(end);
        expected.setId(event.getId());
        expected.setSpecification(courseSpec);
        expectEvent(result, expected);
        // TODO expectTrainingSession
    }
}
