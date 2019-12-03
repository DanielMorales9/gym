package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.facade.UserFacadeTest;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.repository.EventRepository;
import it.gym.repository.GymRepository;
import it.gym.repository.UserRepository;
import it.gym.utility.HateoasTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.AutoConfigureOrder;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Date;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class EventControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private GymRepository gymRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private UserRepository userRepository;

    private Gym gym;
    private AEvent event;
    private Trainer trainer;

    @Before
    public void before() {
        gym = createGym(1L);
        gym = gymRepository.save(gym);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        event = createHoliday(1L, "closed",  start, end, gym);
        event = eventRepository.save(event);
        trainer = createTrainer(1L);
        trainer = userRepository.save(trainer);
    }

    @After
    public void after() {
        eventRepository.deleteAll();
        userRepository.deleteAll();
        gymRepository.deleteAll();
    }

    @Test
    public void whenCreateHoliday_OK() throws Exception {
        Event e = new Event();
        Date start = getNextMonday();
        Date end = addHours(start, 1);
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
        expectGym(result, h.getGym(), "gym");
    }

    @Test
    public void whenDeleteHoliday_OK() throws Exception {
        ResultActions result = mockMvc.perform(delete("/events/holiday/"+event.getId()))
                .andExpect(status().isOk());

        expectEvent(result, event);
        expectGym(result, event.getGym(), "gym");
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
        expectGym(result, event.getGym(), "gym");
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
        expected.setEndTime(start);
        expected.setId(h.getId());
        expectEvent(result, expected);
        expectUser(result, trainer, "user");
    }

//    @Test
//    public void whenCreateCourseEvent_OK() throws Exception {
//        Event e = new Event();
//        Date start = getNextMonday();
//        Date end = addHours(start, 1);
//        e.setStartTime(start);
//        e.setEndTime(end);
//        e.setName("closed1");
//
//        ObjectMapper objectMapper = new ObjectMapper();
//        String json = objectMapper.writeValueAsString(e);
//
//        mockMvc.perform(post("/events/" + gym.getId() + "/course")
//                .contentType(MediaType.APPLICATION_JSON)
//                .content(json))
//                .andExpect(status().isOk());
//
//    }
}
