package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.repository.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithAnonymousUser;
import org.springframework.test.web.servlet.ResultActions;

import javax.print.attribute.standard.MediaPrintableArea;
import java.util.List;

import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class AuthenticationControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private UserRepository repository;
    @Autowired private CustomerRepository customerRepository;
    @Autowired private VerificationTokenRepository tokenRepository;
    @Autowired private GymRepository gymRepository;
    @Autowired private RoleRepository roleRepository;

    private Admin admin;
    private Gym gym;
    private List<Role> roles;
    private VerificationToken token;

    @Before
    public void before() {
        gym = createGym(1L);
        roles = createAdminRoles();
        gym = gymRepository.save(gym);
        roles = roleRepository.saveAll(roles);
        admin = createAdmin(1L, "admin@admin.com", gym, roles);
        admin = repository.save(admin);
        logger.info(admin.toString());
        token = createToken(1L, "admin_token", admin);
        tokenRepository.save(token);
    }

    @After
    public void after() {
        tokenRepository.deleteAll();
        repository.deleteAll();
        gymRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    public void whenRegister_OK() throws Exception {
        Customer customer = (Customer) createCustomer(1L,
                "customer@customer.com",
                "password",
                "customer",
                "customer",
                false, null, null);

        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(post("/authentication/registration?gymId=" + gym.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(customer)))
                .andExpect(status().isOk());
        customer = customerRepository.findAll().get(0);
        roles = customer.getRoles();
        logger.info(roles.toString());
        expectCustomer(result, customer);
        expectGym(result, customer.getGym(), "gym");
    }

    @Test
    @WithAnonymousUser
    public void whenConfirmRegistration_OK() throws Exception {
        Object cred = new Object() {
            public final String email = "admin@admin.com";
            public final String password = "password";
        };

        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(post("/authentication/confirmRegistration")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cred)))
                .andExpect(status().isOk());

        admin.setVerified(true);
        roles = admin.getRoles();
        expectAdmin(result, admin);
        expectAdminRoles(result, roles, "roles");
        expectGym(result, admin.getGym(), "gym");
    }

    @Test
    @WithAnonymousUser
    public void whenChangePassword_OK() throws Exception {
        Object cred = new Object() {
            public final String oldPassword = "password";
            public final String password = "password1";
            public final String confirmPassword = "password1";
        };

        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(post("/authentication/changePassword/"+admin.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(cred)))
                .andExpect(status().isOk());

        admin.setVerified(true);
        roles = admin.getRoles();
        expectAdmin(result, admin);
        expectAdminRoles(result, roles, "roles");
        expectGym(result, admin.getGym(), "gym");
    }

    @Test
    @WithAnonymousUser
    public void whenGetUserFromVerificationToken_OK() throws Exception {
        ResultActions result = mockMvc
                .perform(get("/authentication/getUserFromVerificationToken?token="+token.getToken()))
                .andExpect(status().isOk());

        roles = admin.getRoles();
        expectAdmin(result, admin);
        expectAdminRoles(result, roles, "roles");
        expectGym(result, admin.getGym(), "gym");
    }

    @Test
    @WithAnonymousUser
    public void whenForgotPassword_OK() throws Exception {
        admin.setVerified(true);
        admin = repository.save(admin);
        ResultActions result = mockMvc
                .perform(get("/authentication/forgotPassword?email="+admin.getEmail()))
                .andExpect(status().isOk());

        testExpectedAdmin(result);
    }

    @Test
    public void whenResendAnonymousToken_OK() throws Exception {
        ResultActions result = mockMvc
                .perform(get("/authentication/resendAnonymousToken?id="+admin.getId()))
                .andExpect(status().isOk());

        testExpectedAdmin(result);
    }

    @Test
    public void whenResendToken_OK() throws Exception {
        ResultActions result = mockMvc
                .perform(get("/authentication/resendToken?token="+token.getToken()))
                .andExpect(status().isOk());

        testExpectedAdmin(result);
    }

    private void testExpectedAdmin(ResultActions result) throws Exception {
        roles = admin.getRoles();
        expectAdmin(result, admin);
        expectGym(result, admin.getGym(), "gym");
        expectAdminRoles(result, roles, "roles");
    }
}