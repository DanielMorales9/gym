package it.gym.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.repository.CustomerRepository;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingBundleSpecificationRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Collections;
import java.util.List;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.expectTrainingBundle;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class TrainingBundleControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired private CustomerRepository customerRepository;
    @Autowired private TrainingBundleRepository repository;
    @Autowired private TrainingBundleSpecificationRepository specRepository;
    private PersonalTrainingBundle personalBundle;
    private CourseTrainingBundle courseBundle;

    @Autowired
    private ObjectMapper objectMapper;

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

        PersonalTrainingBundleSpecification personalBundleSpec = createPersonalBundleSpec(1L, "personal", 11);

        List<APurchaseOption> options = Collections.singletonList(createTimePurchaseOption(1, 100.0));
        CourseTrainingBundleSpecification courseBundleSpec = createCourseBundleSpec(1L, "course", 1, options);

        courseBundleSpec = specRepository.save(courseBundleSpec);
        personalBundleSpec = specRepository.save(personalBundleSpec);

        APurchaseOption option = courseBundleSpec.getOptions().get(0);

        courseBundle = createCourseBundle(1L, getNextMonday(), courseBundleSpec, option);
        courseBundle.setCustomer(customer);
        personalBundle = createPersonalBundle(1L, personalBundleSpec, option);
        personalBundle.setCustomer(customer);

        personalBundle = repository.save(personalBundle);
        courseBundle = repository.save(courseBundle);
    }

    @After
    public void after() {
        repository.deleteAll();
        specRepository.deleteAll();
        customerRepository.deleteAll();
    }

    @Test
    public void whenFindAllOK() throws Exception {
        ResultActions result = mockMvc.perform(get("/bundles"))
                .andExpect(status().isOk());

        expectTrainingBundle(result, personalBundle, "content["+0+"]");
        expectTrainingBundle(result, courseBundle, "content["+1+"]");
    }

    @Test
    public void whenFindByIdOK() throws Exception {

        ResultActions result = mockMvc.perform(get("/bundles/"+courseBundle.getId()))
                .andExpect(status().isOk());

        expectTrainingBundle(result, courseBundle);
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

        expectTrainingBundle(result, courseBundle, "content["+0+"]");
    }

    @Test
    public void whenDeleteOK() throws Exception {
        ResultActions result = mockMvc.perform(delete("/bundles/"+courseBundle.getId()))
                .andExpect(status().isOk());

        expectTrainingBundle(result, courseBundle);

    }

    @Test
    public void whenPatchOK() throws Exception {

        courseBundle.setName("Test");
        courseBundle.setBundleSpec(null);
        courseBundle.setCustomer(null);

        ResultActions result = mockMvc.perform(patch("/bundles/"+courseBundle.getId())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(courseBundle)))
                .andExpect(status().isOk());

        expectTrainingBundle(result, courseBundle);

    }

}
