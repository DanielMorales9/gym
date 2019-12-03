package it.gym.integration;


import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.*;
import it.gym.repository.*;
import it.gym.utility.Calendar;
import it.gym.utility.HateoasTest;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class SalesControllerIntegrationTest extends AbstractIntegrationTest {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired RoleRepository roleRepository;
    @Autowired SaleRepository repository;
    @Autowired SalesLineItemRepository sliRepository;
    @Autowired UserRepository userRepository;
    @Autowired GymRepository gymRepository;
    @Autowired TrainingBundleSpecificationRepository bundleSpecRepository;
    @Autowired TrainingBundleRepository bundleRepository;

    private List<Role> roles;
    private Gym gym;
    private AUser customer;
    private Sale sale;
    private ATrainingBundleSpecification personal;
    private ATrainingBundle bundle;
    private SalesLineItem sli0;

    @Before
    public void before() {
        roles = createCustomerRoles();
        roles = roleRepository.saveAll(roles);
        gym = createGym(1L);
        gym = gymRepository.save(gym);
        customer = createCustomer(1L,
                "customer@customer.com",
                "password",
                "customer",
                "customer",
                true,
                roles,
                gym);
        customer = userRepository.save(customer);
        sale = createSale(1L, customer, gym);
        personal = createPersonalBundleSpec(1L, "personal");
        personal = bundleSpecRepository.save(personal);
        bundle = personal.createTrainingBundle();
        bundleRepository.save(bundle);
        sli0 = sale.addSalesLineItem(bundle);
        sale = repository.save(sale);
        sli0 = sale.getSalesLineItems().get(0);

    }

    @After
    public void after() {
        sliRepository.deleteAll();
        repository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        gymRepository.deleteAll();
        bundleRepository.deleteAll();
        bundleSpecRepository.deleteAll();
    }

    @Test
    public void findSaleById_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/sales/" + sale.getId()))
                .andExpect(status().isOk());

        expectSale(result, sale);

        expectCustomer(result, (Customer) customer, "customer");
    }

    @Test
    public void findSaleUserById_OK() throws Exception {
        ResultActions result = mockMvc.perform(get("/sales/" + sale.getId() + "/customer"))
                .andExpect(status().isOk());
        expectCustomer(result, (Customer) customer);
    }

    @Test
    public void whenCreateSale_OK() throws Exception {
        String path = "/sales/createSale/" + gym.getId() + "/" + customer.getId();

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        Sale s = repository.findAll()
                .stream()
                .filter(sale1 -> !sale.getId().equals(sale1.getId()))
                .limit(1)
                .collect(Collectors.toList()).get(0);

        Sale expected = new Sale();
        expected.setId(s.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(false);
        expected.setGym(gym);
        expected.setCustomer((Customer) customer);

        expectSale(result, expected);
        expectGym(result, gym, "gym");
        expectCustomer(result, (Customer) customer, "customer");
    }


    @Test
    public void whenAddSli_OK() throws Exception {
        String path = "/sales/addSalesLineItem/" + sale.getId() + "/" + personal.getId();

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(false);
        expected.setGym(gym);
        expected.setCustomer((Customer) customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");

        expectGym(result, gym, "gym");
        expectCustomer(result, (Customer) customer, "customer");

    }

    @Test
    public void whenDeleteSli_OK() throws Exception {
        String path = "/sales/deleteSalesLineItem/" + sale.getId() + "/" + sli0.getId();

        ResultActions result = mockMvc.perform(delete(path))
                .andExpect(status().isOk());

        ArrayList<SalesLineItem> sli = new ArrayList<>();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(false);
        expected.setGym(gym);
        expected.setCustomer((Customer) customer);

        expectSale(result, expected);
        result = result.andExpect(jsonPath("$.salesLineItems").value(sli));
        expectGym(result, gym, "gym");
        expectCustomer(result, (Customer) customer, "customer");

    }

    @Test
    public void whenConfirmSale_OK() throws Exception {
        String path = "/sales/confirmSale/" + sale.getId();

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(true);
        expected.setGym(gym);
        expected.setCustomer((Customer) customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");
        expectGym(result, gym, "gym");

        Customer c = (Customer) customer;
        expectCustomer(result, c, "customer");
        c.setCurrentTrainingBundles(null);
        userRepository.save(c);

    }

    @Test
    public void whenFindSalesLineItems_OK() throws Exception {
        String path = "/sales/" + sale.getId() + "/salesLineItems";

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        expectSalesLineItems(result, sli, "");
    }

    @Test
    public void whenDeleteSale_OK() throws Exception {
        String path = "/sales/" + sale.getId();

        List<SalesLineItem> sli = sliRepository.findAll();
        ResultActions result = mockMvc.perform(delete(path))
                .andExpect(status().isOk());


        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(true);
        expected.setGym(gym);
        expected.setCustomer((Customer) customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");
        expectGym(result, gym, "gym");

        Customer c = (Customer) customer;
        expectCustomer(result, c, "customer");
        assertThat(repository.findAll().size()).isEqualTo(0);
    }

    @Test
    public void whenGetTotalPrice_OK() throws Exception {
        String path = "/sales/getTotalPrice/"+sale.getId();

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(true);
        expected.setGym(gym);
        expected.setCustomer((Customer) customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");
        expectGym(result, gym, "gym");
        expectCustomer(result, (Customer) customer, "customer");

    }

    @Test
    public void whenSearchByDateAndId_OK() throws Exception {
        String path = "/sales/searchByDateAndId?id="+sale.getCustomer().getId()+"&date="+Calendar.yesterday("dd-MM-yyyy");

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }

    private void expectSales(ResultActions result) throws Exception {
        List<SalesLineItem> sli = sliRepository.findAll();
        for (int i = 0; i < 1; i++) {

            Sale expected = new Sale();
            expected.setId(sale.getId());
            expected.setAmountPayed(0.);
            expected.setCompleted(true);
            expected.setGym(gym);
            expected.setCustomer((Customer) customer);
            expected.setSalesLineItems(sli);

            expectSale(result, expected, "content[" + i + "]");
            expectSalesLineItems(result, sli, "content[" + i + "].salesLineItems");
            expectGym(result, gym, "content[" + i + "].gym");
            expectCustomer(result, (Customer) customer, "content[" + i + "].customer");
        }
    }

    @Test
    public void whenPay_OK() throws Exception {
        String path = "/sales/pay/"+sale.getId()+"?amount="+11.0;

        sale.setCompleted(true);
        sale = repository.save(sale);
        logger.info(sale.toString());
        logger.info(sale.getSalesLineItems().toString());



        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(111.);
        expected.setCompleted(true);
        expected.setPayed(true);
        expected.setGym(gym);
        expected.setCustomer((Customer) customer);
        expected.setSalesLineItems(sli);

        expectSalesLineItems(result, sli, "salesLineItems");
        expectGym(result, gym, "gym");
        expectCustomer(result, (Customer) customer, "customer");

    }

    @Test
    public void whenFindCustomerBySale_OK() throws Exception {
        String path = "/sales/" + sale.getId() + "/customer";

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectCustomer(result, (Customer) customer);
    }

    @Test
    public void whenFindAll_OK() throws Exception {
        String path = "/sales/";

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenFindUserSales_OK() throws Exception {
        String path = "/sales/findUserSales?id="+customer.getId();

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByDate_OK() throws Exception {
        String path = "/sales/searchByDate?date="+ Calendar.today("dd-MM-yyyy");

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByLastNameAndDate_OK() throws Exception {
        String path = "/sales/searchByLastNameAndDate?lastName="+customer.getLastName()+"&date="
                +Calendar.yesterday("dd-MM-yyyy");

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByLastName_OK() throws Exception {
        String path = "/sales/searchByLastName?lastName="+customer.getLastName();

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }


    private ResultActions expectSalesLineItems(ResultActions result, List<SalesLineItem> sli, String prefix) throws Exception {
        for (int i = 0; i < sli.size(); i++) {
            SalesLineItem sl = sli.get(i);
            expectedSalesLineItem(result, sl, prefix+"[" + i + "]");
            expectTrainingBundleSpec(result,
                    (PersonalTrainingBundleSpecification) personal,
                    prefix+"[" + i + "].bundleSpecification");
            expectTrainingBundle(result,
                    (PersonalTrainingBundle) sl.getTrainingBundle(),
                    prefix+"[" + i + "].trainingBundle");
        }
        return result;
    }

}
