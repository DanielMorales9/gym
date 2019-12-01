package it.gym.integration;

import it.gym.model.Admin;
import it.gym.model.Gym;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.repository.GymRepository;
import it.gym.repository.RoleRepository;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import org.junit.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.internal.bytebuddy.matcher.ElementMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private UserRepository repository;
    @Autowired private VerificationTokenRepository tokenRepository;
    @Autowired private GymRepository gymRepository;
    @Autowired private RoleRepository roleRepository;

    private Admin admin;
    private Gym gym;
    private List<Role> roles;

    @Before
    public void before() {
        gym = createGym(1L);
        roles = createAdminRoles();
        gym = gymRepository.save(gym);
        roles = roleRepository.saveAll(roles);
        admin = createAdmin(1L, "admin@admin.com", gym, roles);
        admin = repository.save(admin);
        logger.info(admin.toString());
        VerificationToken token = createToken(1L, "admin_token", admin);
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
    public void findUserId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/" + admin.getId()))
                .andExpect(status().isOk());
        result = expectAdmin(result, admin);
        result = expectAdminRoles(result, roles, "roles");
        expectGym(result, gym, "gym").andReturn();
    }

    @Test
    public void getRolesByUserId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/" + admin.getId() + "/roles"))
                .andExpect(status().isOk());
        expectAdminRoles(result, roles).andReturn();
    }

    @Test
    public void getGymByUserId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/" + admin.getId() + "/gym"))
                .andExpect(status().isOk());
        expectGym(result, gym).andReturn();
    }

    @Test
    public void findByEmail_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/findByEmail?email=" + admin.getEmail()))
                .andExpect(status().isOk());
        result = expectAdmin(result, admin);
        roles.sort((o1, o2) -> (int) (o1.getId() - o2.getId()));
        result = expectAdminRoles(result, roles, "roles");
        expectGym(result, gym, "gym").andReturn();
    }

    @Test
    public void deleteByUserId_OK() throws Exception {
        assertThat(repository.findAll().size() == 1).isTrue();
        mockMvc.perform(delete("/users/" + admin.getId())).andExpect(status().isOk());
        assertThat(repository.findAll().isEmpty()).isTrue();
        assertThat(tokenRepository.findAll().isEmpty()).isTrue();
    }

}
