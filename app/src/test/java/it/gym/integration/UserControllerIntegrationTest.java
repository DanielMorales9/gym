package it.gym.integration;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.repository.*;
import org.junit.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Collections;
import java.util.Date;
import java.util.List;

import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.internal.bytebuddy.matcher.ElementMatchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class UserControllerIntegrationTest extends AbstractIntegrationTest {

    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired private UserRepository repository;
    @Autowired private VerificationTokenRepository tokenRepository;
    @Autowired private GymRepository gymRepository;
    @Autowired private RoleRepository roleRepository;
    @Autowired private TrainingBundleSpecificationRepository bundleSpecRepository;
    @Autowired private TrainingBundleRepository bundleRepository;

    private Admin admin;
    private Gym gym;
    private List<Role> roles;

    @Before
    public void before() {
        gym = createGym(1L);
        roles = createAdminRoles();
        gym = gymRepository.save(gym);
        roles = roleRepository.saveAll(roles);
        admin = createAdmin(1L, "admin@admin.com", roles);
        admin = repository.save(admin);
        VerificationToken token = createToken(1L, "admin_token", admin, addHours(new Date(), 2));
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
    public void whenGet_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users"))
                .andExpect(status().isOk());
        for (int i = 0; i < 1; i++) {
            expectAdmin(result, admin, "content["+i+"]");
            expectAdminRoles(result, roles, "content["+i+"].roles");
        }
    }

    @Test
    public void findUserId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/" + admin.getId()))
                .andExpect(status().isOk());
        expectAdmin(result, admin);
        expectAdminRoles(result, roles, "roles");
    }

    @Test
    public void search_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/search?query=" + admin.getLastName()))
                .andExpect(status().isOk());

        expectAdmin(result, admin, "content["+0+"]");
        expectAdmin(result, admin, "content["+0+"]");
        expectAdminRoles(result, roles, "content["+0+"].roles");
    }

    @Test
    public void getRolesByUserId_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/" + admin.getId() + "/roles"))
                .andExpect(status().isOk());
        expectAdminRoles(result, roles);
    }

//    @Test
//    public void getGymByUserId_OK() throws Exception {
//        ResultActions result = mockMvc.perform(get("/users/" + admin.getId() + "/gym"))
//                .andExpect(status().isOk());
//        expectGym(result, gym);
//    }

    @Test
    public void findByEmail_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/users/findByEmail?email=" + admin.getEmail()))
                .andExpect(status().isOk());
        expectAdmin(result, admin);
        expectAdminRoles(result, roles, "roles");
    }

    @Test
    public void whenPatch_OK() throws Exception {
        admin.setFirstName("noAdmin");
        ObjectMapper objectMapper = new ObjectMapper();
        ResultActions result = mockMvc.perform(patch("/users/"+admin.getId())
                .contentType(MediaType.APPLICATION_JSON_VALUE)
                .content(objectMapper.writeValueAsString(admin)))
                .andExpect(status().isOk());
        expectAdmin(result, admin);
        expectAdminRoles(result, roles, "roles");
    }

    @Test
    public void deleteByUserId_OK() throws Exception {
        assertThat(repository.findAll().size() == 1).isTrue();
        mockMvc.perform(delete("/users/" + admin.getId())).andExpect(status().isOk());
        assertThat(repository.findAll().isEmpty()).isTrue();
        assertThat(tokenRepository.findAll().isEmpty()).isTrue();
    }

    @Test
    public void deleteByUserId_throwsException() throws Exception {
        Customer customer = createCustomer(1L, "customer@customer.com", "", "customer", "customer", true, null);
        ATrainingBundleSpecification spec = createPersonalBundleSpec(1L, "personal", 11);
        spec = bundleSpecRepository.save(spec);
        ATrainingBundle bundle = spec.createTrainingBundle();
        customer.addToCurrentTrainingBundles(Collections.singletonList(bundle));
        customer = repository.save(customer);
        mockMvc.perform(delete("/users/" + customer.getId()))
                .andExpect(status().isBadRequest());

        customer.setCurrentTrainingBundles(null);
        repository.save(customer);
        bundleRepository.deleteAll();
        bundleSpecRepository.deleteAll();

    }

}
