package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.controller.UserController;
import it.gym.integration.AbstractIntegrationTest;
import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import org.junit.Before;
import org.junit.Test;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.runner.RunWith;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Optional;

import static it.gym.utility.Fixture.createAdmin;
import static org.assertj.core.internal.bytebuddy.matcher.ElementMatchers.is;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private UserRepository repository;

    @BeforeEach
    public void init() {
        logger.debug("init");
        AUser admin = createAdmin(1L);
        repository.save(admin);
    }

    @AfterEach
    public void after() {
        repository.deleteAll();
    }

    @Test
    public void find_userId_OK() throws Exception {
        mockMvc.perform(get("/users/1")).andExpect(status().isOk());
    }

}
