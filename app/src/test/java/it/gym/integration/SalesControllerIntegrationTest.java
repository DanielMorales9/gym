package it.gym.integration;


import it.gym.model.*;
import it.gym.repository.*;
import it.gym.utility.Calendar;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.web.servlet.ResultActions;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static it.gym.utility.HateoasTest.*;
import static org.assertj.core.api.AssertionsForInterfaceTypes.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

public class SalesControllerIntegrationTest extends AbstractIntegrationTest {

    @Autowired private RoleRepository roleRepository;
    @Autowired private SaleRepository repository;
    @Autowired private SalesLineItemRepository sliRepository;
    @Autowired private UserRepository userRepository;
    @Autowired private GymRepository gymRepository;
    @Autowired private TrainingBundleSpecificationRepository bundleSpecRepository;
    @Autowired private TrainingBundleRepository bundleRepository;
    @Autowired private PaymentRepository payRepository;

    private final Logger logger = LoggerFactory.getLogger(getClass());

    private Customer customer;
    private Sale sale;
    private PersonalTrainingBundleSpecification personalSpec;
    private CourseTrainingBundleSpecification courseSpec;

    private SalesLineItem sli1;

    @Before
    public void before() {
        List<Role> roles = createCustomerRoles();
        roles = roleRepository.saveAll(roles);
        customer = createCustomer(1L,
                "customer@customer.com",
                "password",
                "customer",
                "customer",
                true,
                roles
        );
        customer = userRepository.save(customer);
        sale = createSale(1L, customer);

        List<APurchaseOption> options = createSingletonBundlePurchaseOptions(30, 900.0);
        personalSpec = createPersonalBundleSpec(1L, "personal", options);

        options = createSingletonTimePurchaseOptions(1, 100.0);
        courseSpec = createCourseBundleSpec(1L, "course", 11, options);

        personalSpec = bundleSpecRepository.save(personalSpec);
        courseSpec = bundleSpecRepository.save(courseSpec);
        APurchaseOption option = courseSpec.getOptions().get(0);
        CourseTrainingBundle course = createCourseBundle(1L, getNextMonday(), courseSpec, option);
        course = bundleRepository.save(course);

        sli1 = sale.addSalesLineItem(course);
        sale = repository.save(sale);
        sli1 = sale.getSalesLineItems().get(0);

    }

    @After
    public void after() {
        sliRepository.deleteAll();
        payRepository.deleteAll();
        repository.deleteAll();
        bundleRepository.deleteAll();
        bundleSpecRepository.deleteAll();
        userRepository.deleteAll();
        roleRepository.deleteAll();
        gymRepository.deleteAll();
    }

    @Test
    public void findSaleByIdOK() throws Exception {
        ResultActions result = mockMvc.perform(get("/sales/" + sale.getId()))
                .andExpect(status().isOk());

        expectSale(result, sale);
        expectSaleUser(result, customer, "customer");
    }

    @Test
    public void findSaleByIdGotNotFound() throws Exception {
        mockMvc.perform(get("/sales/" + 1000))
                .andExpect(status().isNotFound());
    }

    @Test
    public void whenCreateSaleOK() throws Exception {
        String path = "/sales";

        ResultActions result = mockMvc.perform(post(path)
                .param("customerId", String.valueOf(customer.getId())))
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
        expected.setCustomer(customer);

        expectSale(result, expected);
    }


    @Test
    public void whenAddSliOK() throws Exception {
        String path = String.format("/sales/%d/salesLineItems", sale.getId());

        Long optionId = personalSpec.getOptions().get(0).getId();
        ResultActions result = mockMvc.perform(put(path)
                .param("bundleSpecId", personalSpec.getId().toString())
                .param("optionId", optionId.toString()))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(false);
        expected.setCustomer(customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");

        expectSaleUser(result, customer, "customer");

    }

    @Test
    public void whenAddSliByOptionOK() throws Exception {
        APurchaseOption option = courseSpec.getOptions().get(0);
        String path = String.format("/sales/%s/salesLineItems", sale.getId());

        ResultActions result = mockMvc.perform(put(path)
                .param("bundleSpecId", courseSpec.getId().toString())
                .param("optionId", option.getId().toString()))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(false);
        expected.setCustomer(customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");

        expectSaleUser(result, customer, "customer");

    }

    @Test
    public void whenAddSliThenItFails() throws Exception {
        String path = "/sales/addSalesLineItem";

        mockMvc.perform(get(path)
                        .param("bundleSpecId", courseSpec.getId().toString())
                        .param("saleId", sale.getId().toString()))
                .andExpect(status().isBadRequest());
    }

    @Test
    public void whenDeleteSliOK() throws Exception {
        String path = "/sales/" + sale.getId() + "/salesLineItems/" + sli1.getId();

        ResultActions result = mockMvc.perform(delete(path))
                .andExpect(status().isOk());

        ArrayList<SalesLineItem> sli = new ArrayList<>();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(false);
        expected.setCustomer(customer);

        expectSale(result, expected);
        result = result.andExpect(jsonPath("$.salesLineItems").value(sli));
        assertThat(sliRepository.findAll()).isEmpty();
        logger.info(bundleRepository.findAll().toString());
        assertThat(bundleRepository.findAll().size()).isEqualTo(0);
        bundleSpecRepository.findById(courseSpec.getId()).get();
    }

    @Test
    public void whenConfirmSaleOK() throws Exception {
        String path = String.format("/sales/%d/confirm", sale.getId());

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(true);
        expected.setCustomer(customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");

        Customer c = customer;
        expectSaleUser(result, c, "customer");
        c.setCurrentTrainingBundles(null);
        userRepository.save(c);

    }

    @Test
    public void whenDeleteSaleOK() throws Exception {
        String path = "/sales/" + sale.getId();

        List<SalesLineItem> sli = sliRepository.findAll();
        ResultActions result = mockMvc.perform(delete(path))
                .andExpect(status().isOk());


        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setCompleted(true);
        expected.setCustomer(customer);
        expected.setSalesLineItems(sli);

        expectSale(result, expected);
        expectSalesLineItems(result, sli, "salesLineItems");

        Customer c = customer;
        expectSaleUser(result, c, "customer");
        assertThat(repository.findAll()).isEmpty();
        assertThat(sliRepository.findAll()).isEmpty();
        assertThat(bundleRepository.findAll().size()).isEqualTo(0);
        bundleSpecRepository.findById(courseSpec.getId()).get();
    }

    @Test
    public void whenSearchByDateAndIdOK() throws Exception {
        String path = "/sales/findByCustomer";

        ResultActions result = mockMvc.perform(get(path)
                .param("id", String.valueOf(sale.getCustomer().getId()))
                .param("date", Calendar.yesterday("dd-MM-yyyy")))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByDateAndIdAndPayedOK() throws Exception {
        String path = "/sales/search";

        ResultActions result = mockMvc.perform(get(path)
                .param("payed", String.valueOf(false))
                .param("id", String.valueOf(sale.getCustomer().getId()))
                .param("date", Calendar.yesterday("dd-MM-yyyy")))
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
            expected.setCustomer(customer);
            expected.setSalesLineItems(sli);

            expectSale(result, expected, "content[" + i + "]");
            expectSalesLineItems(result, sli, "content[" + i + "].salesLineItems");
        }
    }

    @Test
    public void whenPayOK() throws Exception {
        String path = "/sales/"+sale.getId()+"/pay?amount="+11.0;

        sale.setCompleted(true);
        sale = repository.save(sale);

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();
        List<Payment> payments = payRepository.findAll();

        logger.info(payments.toString());

        Payment payment = payments.get(0);

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(111.);
        expected.setCompleted(true);
        expected.setPayed(true);
        expected.setCustomer(customer);
        expected.setSalesLineItems(sli);

        expectSalesLineItems(result, sli, "salesLineItems");
        expectSaleUser(result, customer, "customer");
        expectPayment(result, payment, "payments[0]");

    }

    @Test
    public void whenDeletePaymentOK() throws Exception {
        Payment p = createPayment(1L, 11.0, new Date());
        sale.addPayment(p);
        sale = this.repository.save(sale);
        p = sale.getPayments().get(0);
        sale.setCompleted(true);

        String path = "/sales/"+sale.getId()+"/payments/"+ p.getId();

        ResultActions result = mockMvc.perform(delete(path))
                .andExpect(status().isOk());

        List<SalesLineItem> sli = sliRepository.findAll();
        List<Payment> payments = payRepository.findAll();

        logger.info(payments.toString());

        Sale expected = new Sale();
        expected.setId(sale.getId());
        expected.setAmountPayed(0.);
        expected.setPayedDate(null);
        expected.setCompleted(true);
        expected.setPayed(false);
        expected.setCustomer(customer);
        expected.setSalesLineItems(sli);

        expectSalesLineItems(result, sli, "salesLineItems");
        result.andExpect(jsonPath("$.payments").isEmpty());
        expectSaleUser(result, customer, "customer");

    }


    @Test
    public void whenFindAllOK() throws Exception {
        String path = "/sales/";

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenFindAllPayedOK() throws Exception {
        String path = "/sales?payed=false";

        ResultActions result = mockMvc.perform(get(path))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenFindUserSalesOK() throws Exception {
        String path = "/sales/findByCustomer";

        ResultActions result = mockMvc.perform(get(path)
                .param("id",customer.getId().toString()))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenFindUserSalesAndPayedOK() throws Exception {
        String path = "/sales/findByCustomer";

        ResultActions result = mockMvc.perform(get(path)
                .param("payed", String.valueOf(false))
                .param("id", customer.getId().toString()))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByDateOK() throws Exception {
        String path = "/sales/search";

        ResultActions result = mockMvc.perform(get(path)
                .param("date", Calendar.today("dd-MM-yyyy")))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByLastNameAndDateOK() throws Exception {
        String path = "/sales/search";

        ResultActions result = mockMvc.perform(get(path)
                .param("lastName", customer.getLastName())
                .param("date", Calendar.yesterday("dd-MM-yyyy")))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByLastNameAndDateAndPayedOK() throws Exception {
        String path = "/sales/search";

        ResultActions result = mockMvc.perform(get(path)
                .param("payed", String.valueOf(false))
                .param("lastName", customer.getLastName())
                .param("date", Calendar.yesterday("dd-MM-yyyy")))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByLastNameOK() throws Exception {
        String path = "/sales/search";

        ResultActions result = mockMvc.perform(get(path)
                .param("lastName", customer.getLastName()))
                .andExpect(status().isOk());

        expectSales(result);
    }

    @Test
    public void whenSearchByLastNameAndPayedOK() throws Exception {
        String path = "/sales/search";

        ResultActions result = mockMvc.perform(get(path)
                .param("payed", String.valueOf(false))
                .param("lastName", customer.getLastName()))
                .andExpect(status().isOk());

        expectSales(result);
    }


    private void expectSalesLineItems(ResultActions result, List<SalesLineItem> sli, String prefix) throws Exception {
        for (int i = 0; i < sli.size(); i++) {
            SalesLineItem sl = sli.get(i);
            expectedSalesLineItem(result, sl, prefix+"[" + i + "]");
        }
    }

}
