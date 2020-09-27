package it.gym.integration;


import it.gym.model.*;
import it.gym.repository.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Date;
import java.util.List;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.expectTrainingSession;
import static it.gym.utility.HateoasTest.expectWorkout;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


public class TrainingSessionControllerTest extends AbstractIntegrationTest {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private TrainingBundleRepository repository;
    @Autowired private TrainingBundleSpecificationRepository specRepository;
    @Autowired private EventRepository eventRepository;
    @Autowired private WorkoutRepository workoutRepository;
    @Autowired private TrainingSessionRepository sessionRepository;

    private ATrainingSession session;
    private Workout workout;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Before
    public void before() {

        Customer customer = createCustomer(1L,
                "user@user.com",
                "",
                "customer",
                "customer",
                true,
                null);

        customer = customerRepository.save(customer);

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0, null);
        PersonalTrainingBundleSpecification personalBundleSpec = createPersonalBundleSpec(1L, "personal", options);

        personalBundleSpec = specRepository.save(personalBundleSpec);

        APurchaseOption option = personalBundleSpec.getOptions().get(0);

        PersonalTrainingBundle personalBundle = createPersonalBundle(1L, personalBundleSpec, option);
        workout = createWorkout(1L);
        workout = workoutRepository.save(workout);

        personalBundle.setCustomer(customer);
        personalBundle.setOption(option);

        personalBundle = repository.save(personalBundle);

        Date start = getNextMonday();
        Date end = addHours(start, 1);
        PersonalTrainingEvent event = createPersonalEvent(1L, "closed", start, end);
        event = eventRepository.save(event);
        session = personalBundle.createSession(event);
        personalBundle.addSession(session);
        personalBundle = repository.save(personalBundle);
        session = personalBundle.getSessions().get(0);


    }

    @After
    public void after() {
        repository.deleteAll();
        specRepository.deleteAll();
        customerRepository.deleteAll();
        workoutRepository.deleteAll();
    }


    @Test
    public void whenFindByIdOK() throws Exception {
        ResultActions result = mockMvc.perform(get("/trainingSessions/" + session.getId()))
                .andExpect(status().isOk());
        expectTrainingSession(result, session);
    }

    @Test
    public void whenAssignWorkoutOK() throws Exception {
        mockMvc
                .perform(get("/trainingSessions/" + session.getId() + "/workouts")
                        .param("workoutId", workout.getId().toString()))
                .andExpect(status().isOk());
    }

    @Test
    public void whenFindIdWithWorkoutOK() throws Exception {
        session.addWorkout(workout);
        session = sessionRepository.save(session);
        ResultActions result = mockMvc.perform(get("/trainingSessions/" + session.getId()))
                .andExpect(status().isOk());
        expectTrainingSession(result, session);
        expectWorkout(result, session.getWorkouts().get(0), "workouts[0]");
    }

    @Test
    public void whenRemoveWorkoutOK() throws Exception {
        Workout w = workout.createFromTemplate();
        w = workoutRepository.save(w);
        session.addWorkout(w);
        session = sessionRepository.save(session);
        mockMvc.perform(delete("/trainingSessions/" + session.getId() + "/workouts")
                        .param("workoutId", w.getId().toString()))
                .andExpect(status().isOk());
    }

}
