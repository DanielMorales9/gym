package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.repository.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Collections;
import java.util.Date;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.expectEvent;
import static it.gym.utility.HateoasTest.expectUser;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class EventControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private GymRepository gymRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private ReservationRepository reservationRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private TrainingBundleSpecificationRepository specRepository;
    @Autowired private TrainingBundleRepository bundleRepository;

    private Gym gym;
    private AEvent event;
    private Trainer trainer;
    private ATrainingBundleSpecification courseSpec;
    private ATrainingBundle courseBundle;
    private ATrainingBundleSpecification personalSpec;
    private ATrainingBundle personalBundle;

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
        courseSpec = createCourseBundleSpec(1L, "course", start, end);
        personalSpec = createPersonalBundleSpec(1L, "personal");
        courseSpec = specRepository.save(courseSpec);
        personalSpec = specRepository.save(personalSpec);
        personalBundle = personalSpec.createTrainingBundle();
        personalBundle = bundleRepository.save(personalBundle);
        courseBundle = courseSpec.createTrainingBundle();
        courseBundle = bundleRepository.save(courseBundle);
    }

    @After
    public void after() {
        eventRepository.deleteAll();
        userRepository.deleteAll();
        gymRepository.deleteAll();
        bundleRepository.deleteAll();
        specRepository.deleteAll();
    }

    @Test
    public void whenCreateHoliday_OK() throws Exception {
        Date start = getNextMonday();
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
    public void whenDeleteHoliday_OK() throws Exception {
        ResultActions result = mockMvc.perform(delete("/events/holiday/"+event.getId()))
                .andExpect(status().isOk());

        expectEvent(result, event);
    }

    @Test
    public void whenEditHoliday_OK() throws Exception {
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
    public void whenEditTimeOff_OK() throws Exception {
        Date start = getNextMonday();
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
    public void whenDeleteTimeOff_OK() throws Exception {
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        TimeOff timeOff = (TimeOff) createTimeOff(1L, "closed", start, end, trainer);
        timeOff = eventRepository.save(timeOff);

        ResultActions result = mockMvc.perform(delete("/events/timeOff/"+timeOff.getId()))
                .andExpect(status().isOk());

        expectEvent(result, timeOff);
    }

    @Test
    public void whenIsAvailable_OK() throws Exception {
        Event e = new Event();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("closed1");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/events/" + gym.getId() + "/holiday/isAvailable")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    public void whenTimeOffIsAvailable_OK() throws Exception {
        Event e = new Event();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("closed1");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/events/" + gym.getId() + "/timeOff/isAvailable")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    public void whenCanEdit_OK() throws Exception {
        Event e = new Event();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        e.setStartTime(start);
        e.setEndTime(end);
        e.setName("closed1");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        mockMvc.perform(post("/events/" + gym.getId() + "/canEdit")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
    }

    @Test
    public void whenCreateTimeOff_OK() throws Exception {
        Event e = new Event();
        Date start = getNextMonday();
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
        expectUser(result, trainer, "user");
    }

    @Test
    public void whenCreateCourseEvent_OK() throws Exception {
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Event e = new Event();
        e.setStartTime(start);
        e.setEndTime(end);
        e.setId(courseBundle.getId());
        e.setName("course");

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(e);

        ResultActions result = mockMvc.perform(post("/events/" + gym.getId() + "/course")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());

        AEvent h = eventRepository.findAll().get(1);
        CourseEvent expected = new CourseEvent();
        expected.setName("course");
        expected.setStartTime(start);
        expected.setEndTime(end);
        expected.setId(h.getId());
        expectEvent(result, expected);
        // TODO expectTrainingSession
    }

    @Test
    public void whenDeleteCourseEvent_OK() throws Exception {
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        ATrainingSession session = courseBundle.createSession(start, end);
        courseBundle.addSession(session);

        CourseEvent event = createCourseEvent(1L, "course", session);
        Customer customer = (Customer) createCustomer(1L,
                "test@test.com",
                "test",
                "test",
                "test",
                true,
                null);
        customer = userRepository.save(customer);

        Reservation reservation = createReservation(1L, customer);
        event.setReservations(Collections.singletonList(reservation));
        event = eventRepository.save(event);

        assertThat(reservationRepository.findAll().size()).isEqualTo(1);
        ResultActions result = mockMvc.perform(delete("/events/course/" + event.getId()))
                .andExpect(status().isOk());

        CourseEvent expected = new CourseEvent();
        expected.setName("course");
        expected.setStartTime(start);
        expected.setEndTime(end);
        expected.setId(event.getId());
        expectEvent(result, expected);
        assertThat(reservationRepository.findAll().size()).isEqualTo(0);
        // TODO expectTrainingSession
    }

    @Test
    public void whenComplete_OK() throws Exception {
        Date start = addDays(getNextMonday(), -30);
        Date end = addHours(start, 1);

        ATrainingSession session = courseBundle.createSession(start, end);
        courseBundle.addSession(session);

        event = createCourseEvent(1L, "course", session);
        event = eventRepository.save(event);

        ResultActions result = mockMvc.perform(get("/events/" + event.getId()+"/complete"))
                .andExpect(status().isOk());

        CourseEvent expected = new CourseEvent();
        expected.setName("course");
        expected.setStartTime(start);
        expected.setEndTime(end);
        expected.setId(event.getId());
        expectEvent(result, expected);
        // TODO expectTrainingSession
    }
}
