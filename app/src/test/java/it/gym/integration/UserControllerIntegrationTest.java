package it.gym.integration;

import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.expectAdminRoles;
import static it.gym.utility.HateoasTest.expectUser;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.repository.*;
import java.util.Date;
import java.util.List;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

public class UserControllerIntegrationTest extends AbstractIntegrationTest {

  @Autowired private UserRepository repository;
  @Autowired private VerificationTokenRepository tokenRepository;
  @Autowired private GymRepository gymRepository;
  @Autowired private RoleRepository roleRepository;
  @Autowired private TrainingBundleSpecificationRepository bundleSpecRepository;
  @Autowired private TrainingBundleRepository bundleRepository;

  private Admin admin;
  private List<Role> roles;

  @Before
  public void before() {
    Gym gym = createGym(1L);
    roles = createAdminRoles();
    gymRepository.save(gym);
    roles = roleRepository.saveAll(roles);
    admin = createAdmin(1L, "admin@admin.com", roles);
    admin = repository.save(admin);
    VerificationToken token =
        createToken(1L, "admin_token", admin, addHours(new Date(), 2));
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
    ResultActions result =
        mockMvc.perform(get("/users")).andExpect(status().isOk());
    for (int i = 0; i < 1; i++) {
      expectUser(result, admin, "content[" + i + "]");
    }
  }

  @Test
  public void findUserId_OK() throws Exception {
    ResultActions result =
        mockMvc
            .perform(get("/users/" + admin.getId()))
            .andExpect(status().isOk());
    expectUser(result, admin);
    //        expectAdminRoles(result, roles, "roles");
  }

  @Test
  public void search_OK() throws Exception {
    ResultActions result =
        mockMvc
            .perform(get("/users/search?query=" + admin.getLastName()))
            .andExpect(status().isOk());

    expectUser(result, admin, "content[" + 0 + "]");
    expectUser(result, admin, "content[" + 0 + "]");
  }

  @Test
  public void getRolesByUserId_OK() throws Exception {
    ResultActions result =
        mockMvc
            .perform(get("/users/" + admin.getId() + "/roles"))
            .andExpect(status().isOk());
    expectAdminRoles(result, roles);
  }

  @Test
  public void findByEmail_OK() throws Exception {
    ResultActions result =
        mockMvc
            .perform(get("/users/findByEmail?email=" + admin.getEmail()))
            .andExpect(status().isOk());
    expectUser(result, admin);
    expectAdminRoles(result, roles, "roles");
  }

  @Test
  public void whenPatch_OK() throws Exception {
    admin.setFirstName("noAdmin");
    ObjectMapper objectMapper = new ObjectMapper();
    ResultActions result =
        mockMvc
            .perform(
                patch("/users/" + admin.getId())
                    .contentType(MediaType.APPLICATION_JSON_VALUE)
                    .content(objectMapper.writeValueAsString(admin)))
            .andExpect(status().isOk());
    expectUser(result, admin);
    expectAdminRoles(result, roles, "roles");
  }

  @Test
  public void deleteByUserId_OK() throws Exception {
    assertThat(repository.findAll().size() == 1).isTrue();
    mockMvc
        .perform(delete("/users/" + admin.getId()))
        .andExpect(status().isOk());
    assertThat(repository.findAll().isEmpty()).isTrue();
    assertThat(tokenRepository.findAll().isEmpty()).isTrue();
  }

  @Test
  public void deleteByUserId_throwsException() throws Exception {
    Customer customer =
        createCustomer(
            1L,
            "customer@customer.com",
            "",
            "customer",
            "customer",
            true,
            null,
            true);

    List<APurchaseOption> options =
        createSingletonBundlePurchaseOptions(30, 900.0, null);
    PersonalTrainingBundleSpecification spec =
        createPersonalBundleSpec(1L, "personal", options);

    customer = repository.save(customer);
    spec = bundleSpecRepository.save(spec);
    Long optionId = spec.getOptions().get(0).getId();

    ATrainingBundle bundle = spec.createTrainingBundle(optionId);
    bundle.setCustomer(customer);
    bundleRepository.save(bundle);
    mockMvc
        .perform(delete("/users/" + customer.getId()))
        .andExpect(status().isBadRequest());

    bundleRepository.deleteAll();
    bundleSpecRepository.deleteAll();
  }

  @Test
  public void whenFindUsersByEventIdThenOk() throws Exception {
    mockMvc
        .perform(get("/users/events").param("eventId", String.valueOf(1)))
        .andExpect(status().isOk());
  }
}
