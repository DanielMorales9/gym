package it.gym.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import it.gym.model.CourseTrainingBundleSpecification;
import it.gym.model.PersonalTrainingBundleSpecification;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingBundleSpecificationRepository;
import it.gym.utility.HateoasTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Date;
import java.util.stream.Collectors;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.expectTrainingBundleSpec;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TrainingBundleSpecControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private TrainingBundleSpecificationRepository repository;
    @Autowired private TrainingBundleRepository bundleRepository;

    private PersonalTrainingBundleSpecification personalBundle;
    private CourseTrainingBundleSpecification courseBundle;

    @Before
    public void before() {
        personalBundle = (PersonalTrainingBundleSpecification)
                createPersonalBundleSpec(1L, "personal", 11);
        courseBundle = (CourseTrainingBundleSpecification)
                createCourseBundleSpec(1L, "course", 1, 1);
        personalBundle = repository.save(personalBundle);
        courseBundle = repository.save(courseBundle);
    }

    @After
    public void after() {
        bundleRepository.deleteAll();
        repository.deleteAll();
    }

    @Test
    public void findPersonalBundleSpecId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/" + personalBundle.getId()))
                .andExpect(status().isOk());
        logger.info(bundleRepository.findAll().toString());
        expectTrainingBundleSpec(result, personalBundle);
    }

    @Test
    public void whenPatch_OK() throws Exception {
        personalBundle.setDescription("desco");
        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(patch("/bundleSpecs/"+personalBundle.getId())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(personalBundle)))
                .andExpect(status().isOk());
        expectTrainingBundleSpec(result, personalBundle);
    }

    @Test
    public void findCourseBundleSpecId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/" + courseBundle.getId()))
                .andExpect(status().isOk());
        HateoasTest.expectTrainingBundleSpec(result, courseBundle);
    }

    @Test
    public void deletePersonalBundleSpecId_OK() throws Exception {
        mockMvc.perform(delete("/bundleSpecs/" + personalBundle.getId()))
                .andExpect(status().isOk());
        assertThat(repository.findAll().size()).isEqualTo(1);
    }

    @Test
    public void deletePersonalBundleSpecId_throwException() throws Exception {
        bundleRepository.save(personalBundle.createTrainingBundle());
        mockMvc.perform(delete("/bundleSpecs/" + personalBundle.getId()))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void deleteCourseBundleSpecId_OK() throws Exception {
        mockMvc.perform(delete("/bundleSpecs/" + courseBundle.getId()))
                .andExpect(status().isOk());
        assertThat(repository.findAll().size()).isEqualTo(1);
    }

    @Test
    public void deleteCourseBundleSpecId_throwsException() throws Exception {
        ATrainingBundle bundle = createCourseBundle(1L, getNextMonday(),
                courseBundle);
        bundleRepository.save(bundle);
        mockMvc.perform(delete("/bundleSpecs/" + courseBundle.getId()))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void deletePersonalBundleSpecId_throwsException() throws Exception {
        ATrainingBundle bundle = personalBundle.createTrainingBundle();
        ATrainingSession session = bundle.createSession(new Date(), new Date());
        session.setCompleted(true);
        bundle.addSession(session);
        bundleRepository.save(bundle);

        mockMvc.perform(delete("/bundleSpecs/" + personalBundle.getId()))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void postPersonalBundleSpec_OK() throws Exception {
        Object randomObj = new Object() {
            public final boolean disabled = false;
            public final String name = "pacchetto";
            public final String description = "pacchetto";
            public final Double price = 1.0;
            public final String type = "P";
            public final Integer numSessions = 11;
        };

        PersonalTrainingBundleSpecification expected = new PersonalTrainingBundleSpecification();
        expected.setNumSessions(11);
        expected.setName("pacchetto");
        expected.setDescription("pacchetto");
        expected.setDisabled(false);
        expected.setPrice(1.0);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(randomObj);
        logger.info(json);

        ResultActions result = mockMvc.perform(post("/bundleSpecs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
        Long id = repository.findAll()
                .stream()
                .filter(a -> a.getName().equals("pacchetto"))
                .limit(1)
                .collect(Collectors.toList())
                .get(0)
                .getId();
        expected.setId(id);
        expectTrainingBundleSpec(result, expected);
    }

    @Test
    public void whenFindAll_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs"))
                .andExpect(status().isOk());

        expectTrainingBundleSpec(result, personalBundle, "content["+0+"]");
        expectTrainingBundleSpec(result, courseBundle, "content["+1+"]");
    }

    @Test
    public void whenSearchWAllParameters_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/search" +
                "?name="+courseBundle.getName()+
                "&disabled=false"))
                .andExpect(status().isOk());

        expectTrainingBundleSpec(result, courseBundle, "content["+0+"]");
    }

    @Test
    public void whenSearchWDisabledTrue_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/search"+
                "?name="+courseBundle.getName()+
                "&disabled=true"))
                .andExpect(status().isOk());
        result.andExpect(jsonPath("$.content").isEmpty());
    }

    @Test
    public void whenSearchWOParameters_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/search"))
                .andExpect(status().isOk());
        expectTrainingBundleSpec(result, personalBundle, "content["+0+"]");
        expectTrainingBundleSpec(result, courseBundle, "content["+1+"]");
    }

    @Test
    public void whenSearchWDisabledFalse_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/search?disabled=false"))
                .andExpect(status().isOk());
        expectTrainingBundleSpec(result, personalBundle, "content["+0+"]");
        expectTrainingBundleSpec(result, courseBundle, "content["+1+"]");
    }

    @Test
    public void whenSearchNotDisabled_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/searchNotDisabled?" +
                "query="+courseBundle.getName()))
                .andExpect(status().isOk());

        expectTrainingBundleSpec(result, courseBundle, "content["+0+"]");    }

    @Test
    public void whenGetNotDisabled_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/getNotDisabled"))
                .andExpect(status().isOk());

        expectTrainingBundleSpec(result, personalBundle, "content["+0+"]");
        expectTrainingBundleSpec(result, courseBundle, "content["+1+"]");
    }


    @Test
    public void postCourseBundleSpec_OK() throws Exception {
        Object randomObj = new Object() {
            public final boolean disabled = false;
            public final String name = "pacchetto";
            public final String description = "pacchetto";
            public final Double price = 1.0;
            public final String type = "C";
            public final Integer maxCustomers = 11;
        };

        CourseTrainingBundleSpecification expected = new CourseTrainingBundleSpecification();
        expected.setName("pacchetto");
        expected.setDescription("pacchetto");
        expected.setDisabled(false);
        expected.setMaxCustomers(11);
        expected.setPrice(1.0);

        ObjectMapper objectMapper = new ObjectMapper();
        String json = objectMapper.writeValueAsString(randomObj);
        logger.info(json);

        ResultActions result = mockMvc.perform(post("/bundleSpecs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json))
                .andExpect(status().isOk());
        Long id = repository.findAll()
                .stream()
                .filter(a -> a.getName().equals("pacchetto"))
                .limit(1)
                .collect(Collectors.toList())
                .get(0)
                .getId();
        expected.setId(id);
        bundleRepository.deleteAll();
        HateoasTest.expectTrainingBundleSpec(result, expected);
    }
}
