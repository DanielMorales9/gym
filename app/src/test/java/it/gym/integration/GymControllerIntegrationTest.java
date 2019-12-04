package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.Gym;
import it.gym.repository.GymRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static it.gym.utility.Fixture.createGym;
import static it.gym.utility.HateoasTest.expectGym;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class GymControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private GymRepository gymRepository;

    private Gym gym;

    @Before
    public void before() {
        gym = createGym(1L);
        gym = gymRepository.save(gym);
    }


    @After
    public void after() {
        gymRepository.deleteAll();
    }

    @Test
    public void whenFindById_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/gyms/"+gym.getId()))
                .andExpect(status().isOk());
        expectGym(result, gym);
    }

    @Test
    public void whenPatch_OK() throws Exception {
        gym.setFridayOpen(false);
        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(patch("/gyms/"+gym.getId())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(gym)))
                .andExpect(status().isOk());
        expectGym(result, gym);
    }

}
