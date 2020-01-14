package it.gym.integration;

import it.gym.config.ApplicationTestConfig;
import it.gym.config.CustomPostgresContainer;
import it.gym.config.SecurityTestConfig;
import org.junit.ClassRule;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.test.web.servlet.MockMvc;

import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.boot.test.context.SpringBootTest.WebEnvironment.RANDOM_PORT;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = RANDOM_PORT)
@Import({ApplicationTestConfig.class, SecurityTestConfig.class})
@AutoConfigureMockMvc
@WithMockUser(username = "user@user.com", authorities = {"ADMIN", "TRAINER", "CUSTOMER"})
public abstract class AbstractIntegrationTest {

    @ClassRule
    public static CustomPostgresContainer sqlContainer = CustomPostgresContainer.getInstance();

    @Autowired
    public MockMvc mockMvc;

}
