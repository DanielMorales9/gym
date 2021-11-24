package it.gym.integration;

import it.gym.model.*;
import it.gym.repository.*;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;

import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class CustomerControllerIntegrationTest extends AbstractIntegrationTest {

  private final Logger logger = LoggerFactory.getLogger(getClass());

  @Autowired private CustomerRepository repository;
  @Autowired private GymRepository gymRepository;
  @Autowired private RoleRepository roleRepository;
  @Autowired private TrainingBundleSpecificationRepository bundleSpecRepository;
  @Autowired private TrainingBundleRepository bundleRepository;

  private Gym gym;
  private List<Role> roles;
  private Customer customer;
  private PersonalTrainingBundle personal;

  @Before
  public void before() {
    roles = createCustomerRoles();
    roles = roleRepository.saveAll(roles);
    gym = createGym(1L);
    gym = gymRepository.save(gym);
    customer =
        createCustomer(
            1L,
            "customer@customer.com",
            "password",
            "customer",
            "customer",
            true,
            roles,
            true);

    customer = repository.save(customer);
    List<APurchaseOption> options =
        createSingletonBundlePurchaseOptions(30, 900.0, null);
    PersonalTrainingBundleSpecification personalSpec =
        createPersonalBundleSpec(1L, "personal", options);

    personalSpec = bundleSpecRepository.save(personalSpec);
    Long optionId = personalSpec.getOptions().get(0).getId();
    personal =
        (PersonalTrainingBundle) personalSpec.createTrainingBundle(optionId);
    personal.setCustomer(customer);
    personal = bundleRepository.save(personal);
  }

  @After
  public void after() {
    customer.setTrainingBundles(null);
    customer = repository.save(customer);
    bundleRepository.deleteAll();
    bundleSpecRepository.deleteAll();
    repository.deleteAll();
    gymRepository.deleteAll();
    roleRepository.deleteAll();
  }

  @Test
  public void whenFindBundlesWAllParametersOK() throws Exception {
    SimpleDateFormat fmt = new SimpleDateFormat("dd-MM-yyyy");
    String date = fmt.format(new Date());
    ResultActions result =
        mockMvc
            .perform(
                get(
                    "/customers/bundles"
                        + "?id="
                        + customer.getId()
                        + "&name="
                        + personal.getName()
                        + "&expired=false"
                        + "&date="
                        + date))
            .andExpect(status().isOk());
    expectTrainingBundle(result, personal, "content[0]");
  }

  @Test
  public void whenFindBundlesWoExpiredOK() throws Exception {
    SimpleDateFormat fmt = new SimpleDateFormat("dd-MM-yyyy");
    String date = fmt.format(new Date());
    ResultActions result =
        mockMvc
            .perform(
                get(
                    "/customers/bundles"
                        + "?id="
                        + customer.getId()
                        + "&name="
                        + personal.getName()
                        + "&date="
                        + date))
            .andExpect(status().isOk());
    expectTrainingBundle(result, personal, "content[0]");
  }

  @Test
  public void whenFindBundlesWoOK() throws Exception {
    ResultActions result =
        mockMvc
            .perform(
                get(
                    "/customers/bundles"
                        + "?id="
                        + customer.getId()
                        + "&expired=true"))
            .andExpect(status().isOk());

    result.andExpect(jsonPath("$.content").isEmpty());
  }
}
