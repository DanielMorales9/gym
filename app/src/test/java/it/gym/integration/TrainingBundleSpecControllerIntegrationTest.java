package it.gym.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.ATrainingBundleSpecification;
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

import static it.gym.utility.Fixture.createCourseBundleSpec;
import static it.gym.utility.Fixture.createPersonalBundleSpec;
import static it.gym.utility.HateoasTest.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TrainingBundleSpecControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private TrainingBundleSpecificationRepository repository;
    @Autowired private TrainingBundleRepository bundleRepository;
    private ATrainingBundleSpecification personalBundle;
    private ATrainingBundleSpecification courseBundle;

    @Before
    public void before() {
        personalBundle = createPersonalBundleSpec(1L, "personal");
        courseBundle = createCourseBundleSpec(1L, "course", new Date(), new Date());
        personalBundle = repository.save(personalBundle);
        courseBundle = repository.save(courseBundle);
    }

    @After
    public void after() {
        repository.deleteAll();
    }

    @Test
    public void findPersonalBundleSpecId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/" + personalBundle.getId()))
                .andExpect(status().isOk());
        logger.info(bundleRepository.findAll().toString());
        expectTrainingBundleSpec(result, (PersonalTrainingBundleSpecification) personalBundle);
    }

    @Test
    public void whenPatch_OK() throws Exception {
        personalBundle.setDescription("desco");
        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(patch("/bundleSpecs/"+personalBundle.getId())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(personalBundle)))
                .andExpect(status().isOk());
        expectTrainingBundleSpec(result, (PersonalTrainingBundleSpecification) personalBundle);
    }

    @Test
    public void findCourseBundleSpecId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/" + courseBundle.getId()))
                .andExpect(status().isOk());
        HateoasTest.expectTrainingBundleSpec(result, (CourseTrainingBundleSpecification) courseBundle);
    }

    @Test
    public void deletePersonalBundleSpecId_OK() throws Exception {
        mockMvc.perform(delete("/bundleSpecs/" + personalBundle.getId()))
                .andExpect(status().isOk());
        assertThat(repository.findAll().size()).isEqualTo(1);
    }

    @Test
    public void deleteCourseBundleSpecId_OK() throws Exception {
        mockMvc.perform(delete("/bundleSpecs/" + courseBundle.getId()))
                .andExpect(status().isOk());
        assertThat(repository.findAll().size()).isEqualTo(1);
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

        expectTrainingBundleSpec(result, (PersonalTrainingBundleSpecification) personalBundle, "content["+0+"]");
        expectTrainingBundleSpec(result, (CourseTrainingBundleSpecification) courseBundle, "content["+1+"]");
    }

    @Test
    public void whenSearch_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/search?query="+courseBundle.getName()))
                .andExpect(status().isOk());

        expectTrainingBundleSpec(result, (CourseTrainingBundleSpecification) courseBundle, "content["+0+"]");
    }

    @Test
    public void whenSearchNotDisabled_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/searchNotDisabled?query="+courseBundle.getName()))
                .andExpect(status().isOk());

        expectTrainingBundleSpec(result, (CourseTrainingBundleSpecification) courseBundle, "content["+0+"]");    }

    @Test
    public void whenGetNotDisabled_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundleSpecs/getNotDisabled"))
                .andExpect(status().isOk());

        expectTrainingBundleSpec(result, (PersonalTrainingBundleSpecification) personalBundle, "content["+0+"]");
        expectTrainingBundleSpec(result, (CourseTrainingBundleSpecification) courseBundle, "content["+1+"]");
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
        expected.setStartTime(new Date());
        expected.setEndTime(new Date());
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