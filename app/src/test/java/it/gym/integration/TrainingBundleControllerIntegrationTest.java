package it.gym.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.CourseTrainingBundle;
import it.gym.model.PersonalTrainingBundle;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingBundleSpecificationRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.text.SimpleDateFormat;
import java.util.Date;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.expectTrainingBundle;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TrainingBundleControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired private TrainingBundleRepository repository;
    @Autowired private TrainingBundleSpecificationRepository specRepository;
    private ATrainingBundle personalBundle;
    private ATrainingBundle courseBundle;
    private ATrainingBundleSpecification courseBundleSpec;

    @Before
    public void before() {

        ATrainingBundleSpecification personalBundleSpec = createPersonalBundleSpec(1L, "personal", 11);
        courseBundleSpec = createCourseBundleSpec(1L, "course", 1, 1);

        courseBundleSpec = specRepository.save(courseBundleSpec);
        personalBundleSpec = specRepository.save(personalBundleSpec);

        courseBundle = createCourseBundle(1L, getNextMonday(), courseBundleSpec);
        personalBundle = createPersonalBundle(1L, personalBundleSpec);

        personalBundle = repository.save(personalBundle);
        courseBundle = repository.save(courseBundle);
    }

    @After
    public void after() {
        repository.deleteAll();
        specRepository.deleteAll();
    }

    @Test
    public void whenFindCoursesOK() throws Exception {
        SimpleDateFormat sm = new SimpleDateFormat("dd-MM-yyyy_HH:mm");
        String s = sm.format(addDays(getNextMonday(), 1));
        String e = sm.format(addDays(getNextMonday(), 2));
        ResultActions result = mockMvc.perform(get("/bundles/courses?startTime="+s+ "&endTime="+e))
                .andExpect(status().isOk());

        expectTrainingBundle(result, (CourseTrainingBundle) courseBundle, "["+0+"]");
    }

    @Test
    public void whenFindAllOK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundles"))
                .andExpect(status().isOk());

        expectTrainingBundle(result, (PersonalTrainingBundle) personalBundle, "content["+0+"]");
        expectTrainingBundle(result, (CourseTrainingBundle) courseBundle, "content["+1+"]");
    }

    @Test
    public void whenFindByIdOK() throws Exception {

        ResultActions result = mockMvc.perform(get("/bundles/"+courseBundle.getId()))
                .andExpect(status().isOk());

        expectTrainingBundle(result, (CourseTrainingBundle) courseBundle);
    }

    @Test
    public void whenFindByIdGotNotFound() throws Exception {
        mockMvc.perform(get("/bundles/1000"))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenSearchOK() throws Exception {

        ResultActions result = mockMvc.perform(get("/bundles/search?specId="+courseBundle
                .getBundleSpec().getId()))
                .andExpect(status().isOk());

        expectTrainingBundle(result, (CourseTrainingBundle) courseBundle, "content["+0+"]");
    }

    @Test
    public void whenSearchNotExpiredOK() throws Exception {

        ResultActions result = mockMvc.perform(get("/bundles/searchNotExpired?specId="+courseBundle
                .getBundleSpec().getId()))
                .andExpect(status().isOk());

        expectTrainingBundle(result, (CourseTrainingBundle) courseBundle, "["+0+"]");
    }

    @Test
    public void whenPostOK() throws Exception {
        Object cred = new Object() {
            public final String name = courseBundle.getName();
            public final Long specId = courseBundleSpec.getId();
            public final Date startTime = ((CourseTrainingBundle) courseBundle).getStartTime();
        };

        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(post("/bundles") .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cred)))
                .andExpect(status().isOk());

        ATrainingBundle course = repository.findATrainingBundleByBundleSpec_Id(courseBundleSpec.getId()).get(1);
        expectTrainingBundle(result, (CourseTrainingBundle) course);
    }

    @Test
    public void whenDeleteOK() throws Exception {
        ResultActions result = mockMvc.perform(delete("/bundles/"+courseBundle.getId()))
                .andExpect(status().isOk());

        expectTrainingBundle(result, (CourseTrainingBundle) courseBundle);

    }

    @Test
    public void whenPatchOK() throws Exception {
        Object cred = new Object() {
            public final String name = courseBundle.getName();
            public final Long id = courseBundle.getId();
            public final Date startTime = addDays(((CourseTrainingBundle) courseBundle).getStartTime(), 1);
            public final Date endTime = ((CourseTrainingBundle) courseBundle).getEndTime();
        };

        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(patch("/bundles/"+courseBundle.getId())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(cred)))
                .andExpect(status().isOk());

        expectTrainingBundle(result, (CourseTrainingBundle) courseBundle);

    }
}