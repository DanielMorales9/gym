package it.gym.integration;

import it.gym.model.*;
import it.gym.repository.*;
import it.gym.utility.HateoasTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
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

    @Before
    public void before() {
        roles = createCustomerRoles();
        roles = roleRepository.saveAll(roles);
        gym = createGym(1L);
        gym = gymRepository.save(gym);
        customer = (Customer) createCustomer(1L,
                "customer@customer.com",
                "password",
                "customer",
                "customer",
                true,
                roles,
                gym);
        ATrainingBundleSpecification personal = createPersonalBundleSpec(1L, "personal");
        personal = bundleSpecRepository.save(personal);
        ATrainingBundle bundle = personal.createTrainingBundle();
        bundle = bundleRepository.save(bundle);
        customer.setCurrentTrainingBundles(Collections.singletonList(bundle));
        customer = repository.save(customer);
    }


    @After
    public void after() {
        customer.setCurrentTrainingBundles(null);
        customer = repository.save(customer);
        bundleRepository.deleteAll();
        bundleSpecRepository.deleteAll();
        repository.deleteAll();
        gymRepository.deleteAll();
        roleRepository.deleteAll();
    }

    @Test
    public void whenSearchCustomers_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/customers")).andExpect(status().isOk());
        result = expectCustomer(result, customer, "content[0]");
        result = expectCustomerRoles(result, roles, "content[0].roles");
        expectGym(result, gym, "content[0].gym").andReturn();
        List<ATrainingBundle> bundles = customer.getCurrentTrainingBundles();
        for (int i = 0; i < bundles.size(); i++) {
            result = expectTrainingBundle(result, (PersonalTrainingBundle) bundles.get(i),
                    "content[0].currentTrainingBundles["+i+"]");
        }
    }

    @Test
    public void whenSearchCustomersByLastName_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/customers/search?query="+customer.getLastName()))
                .andExpect(status().isOk());
        result = expectCustomer(result, customer, "content[0]");
        result = expectCustomerRoles(result, roles, "content[0].roles");
        expectGym(result, gym, "content[0].gym").andReturn();
        List<ATrainingBundle> bundles = customer.getCurrentTrainingBundles();
        for (int i = 0; i < bundles.size(); i++) {
            result = expectTrainingBundle(result, (PersonalTrainingBundle) bundles.get(i),
                    "content[0].currentTrainingBundles["+i+"]");
        }

    }

    @Test
    public void whenSearch_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/customers/search?query="+customer.getLastName()))
                .andExpect(status().isOk());
        result = expectCustomer(result, customer, "content[0]");
        result = HateoasTest.expectCustomerRoles(result, roles, "content[0].roles");
        expectGym(result, gym, "content[0].gym").andReturn();
        List<ATrainingBundle> bundles = customer.getCurrentTrainingBundles();
        for (int i = 0; i < bundles.size(); i++) {
            result = expectTrainingBundle(result, (PersonalTrainingBundle) bundles.get(i),
                    "content[0].currentTrainingBundles["+i+"]");
        }

    }

}
