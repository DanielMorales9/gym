package it.gym.integration;

import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.ResultMatcher;

import static it.gym.utility.Fixture.createAdmin;
import static org.assertj.core.internal.bytebuddy.matcher.ElementMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private UserRepository repository;

    @Before
    public void before() {
        AUser admin = createAdmin(1L);
        repository.save(admin);
    }

    @After
    public void after() {
        repository.deleteAll();
    }

    @Test
    public void find_userId_OK() throws Exception {
        mockMvc.perform(get("/users/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.email").value("admin@admin.com"))
                .andExpect(jsonPath("$.firstName").value("admin"))
                .andExpect(jsonPath("$.lastName").value("admin"))
                .andExpect(jsonPath("$.verified").value(false))
                .andReturn();
    }

    @Test
    public void delete_userId_404() throws Exception {
        mockMvc.perform(delete("/users/1"))
                .andExpect(status().isNotFound())
                .andReturn();
    }
}
