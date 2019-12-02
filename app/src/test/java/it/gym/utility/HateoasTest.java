package it.gym.utility;

import it.gym.model.*;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class HateoasTest {

    public static ResultActions expectAdmin(ResultActions result, Admin admin, String prefix) throws Exception {
        prefix = handlePrefix(prefix);
        return expectUser(result, admin, prefix);
    }

    public static ResultActions expectAdmin(ResultActions result, Admin admin) throws Exception {
        return expectAdmin(result, admin, null);
    }

    public static ResultActions expectAdminRoles(ResultActions result, List<Role> roles) throws Exception {
        return expectAdminRoles(result, roles, null);
    }

    public static ResultActions expectAdminRoles(ResultActions result, List<Role> roles, String prefix) throws Exception {
        prefix = handlePrefixForArray(prefix);

        for (int i = 0; i < 3; i++) {
            result = result
                    .andExpect(jsonPath("$"+prefix+"["+i+"].id").value(roles.get(i).getId()))
                    .andExpect(jsonPath("$"+prefix+"["+i+"].name").value(roles.get(i).getName()));
        }

        return result;
    }


    public static ResultActions expectGym(ResultActions result, Gym gym, String prefix) throws Exception {
        prefix = handlePrefix(prefix);
        return result.andExpect(jsonPath("$"+prefix+"id").value(gym.getId()));

    }

    public static ResultActions expectGym(ResultActions result, Gym gym) throws Exception {
        return expectGym(result, gym, null);
    }

    private static String handlePrefixForArray(String prefix) {
        return handlePrefix(prefix, true);
    }

    private static String handlePrefix(String prefix) {
        return handlePrefix(prefix, false);
    }

    private static String handlePrefix(String prefix, boolean isArray) {
        prefix = handleNullPrefix(prefix);
        if (!prefix.equals("")) {
            if (!isArray) {
                prefix = prefix.endsWith(".") ? prefix : prefix + ".";
            }
            prefix = prefix.startsWith(".") ? prefix : "." + prefix;
        }
        else if (!isArray) {
            prefix = ".";
        }
        return prefix;
    }

    private static String handleNullPrefix(String prefix) {
        prefix = prefix == null ? "" : prefix;
        return prefix;
    }

    public static ResultActions expectTrainingBundleSpec(ResultActions result,
                                                         PersonalTrainingBundleSpecification bundle) throws Exception {
        return expectTrainingBundleSpec(result, bundle, null);
    }

    public static ResultActions expectTrainingBundleSpec(ResultActions result,
                                                         PersonalTrainingBundleSpecification bundle,
                                                         String prefix) throws Exception {
        prefix = handlePrefix(prefix, false);
        return result
                .andExpect(jsonPath("$"+prefix+"id").value(bundle.getId()))
                .andExpect(jsonPath("$"+prefix+"name").value(bundle.getName()))
                .andExpect(jsonPath("$"+prefix+"price").value(bundle.getPrice()))
                .andExpect(jsonPath("$"+prefix+"disabled").value(bundle.getDisabled()))
                .andExpect(jsonPath("$"+prefix+"numSessions").value(bundle.getNumSessions()))
                .andExpect(jsonPath("$"+prefix+"description").value(bundle.getDescription()));
    }

    public static ResultActions expectTrainingBundleSpec(ResultActions result,
                                                         CourseTrainingBundleSpecification bundle) throws Exception {
        return expectTrainingBundleSpec(result, bundle, null);
    }

    public static ResultActions expectTrainingBundleSpec(ResultActions result,
                                                         CourseTrainingBundleSpecification bundle,
                                                         String prefix) throws Exception {
        prefix = handlePrefix(prefix, false);
        return result
                .andExpect(jsonPath("$"+prefix+"id").value(bundle.getId()))
                .andExpect(jsonPath("$"+prefix+"name").value(bundle.getName()))
                .andExpect(jsonPath("$"+prefix+"price").value(bundle.getPrice()))
                .andExpect(jsonPath("$"+prefix+"disabled").value(bundle.getDisabled()))
                .andExpect(jsonPath("$"+prefix+"maxCustomers").value(bundle.getMaxCustomers()))
                .andExpect(jsonPath("$"+prefix+"description").value(bundle.getDescription()));
    }

    public static ResultActions expectSale(ResultActions result, Sale sale) throws Exception {
        return expectSale(result, sale, null);
    }

    public static ResultActions expectSale(ResultActions result,
                                           Sale sale,
                                           String prefix) throws Exception {
        prefix = handlePrefix(prefix, false);
        return result
                .andExpect(jsonPath("$"+prefix+"id").value(sale.getId()))
                .andExpect(jsonPath("$"+prefix+"amountPayed").value(sale.getAmountPayed()))
                .andExpect(jsonPath("$"+prefix+"totalPrice").value(sale.getTotalPrice()));

    }

    public static ResultActions expectCustomer(ResultActions result, Customer customer, String prefix) throws Exception {
        prefix = handlePrefix(prefix, false);
        result = expectUser(result, customer, prefix);
        return result
                .andExpect(jsonPath("$"+prefix+"height").value(customer.getHeight()))
                .andExpect(jsonPath("$"+prefix+"weight").value(customer.getWeight()));
    }

    public static ResultActions expectCustomer(ResultActions result, Customer customer) throws Exception {
        return expectCustomer(result, customer, null);
    }

    public static ResultActions expectUser(ResultActions result, AUser user, String prefix) throws Exception {
        return result
                .andExpect(jsonPath("$"+prefix+"id").value(user.getId()))
                .andExpect(jsonPath("$"+prefix+"email").value(user.getEmail()))
                .andExpect(jsonPath("$"+prefix+"firstName").value(user.getFirstName()))
                .andExpect(jsonPath("$"+prefix+"lastName").value(user.getLastName()))
                .andExpect(jsonPath("$"+prefix+"verified")  .value(user.isVerified()));
    }

    public static ResultActions expectedSalesLineItem(ResultActions result, SalesLineItem expected) throws Exception {
        return expectedSalesLineItem(result, expected, null);
    }

    public static ResultActions expectedSalesLineItem(ResultActions result,
                                                      SalesLineItem expected,
                                                      String prefix) throws Exception {
        prefix = handlePrefix(prefix);
        result = result.andExpect(jsonPath("$"+prefix+"id").value(expected.getId()));
        return result;
    }

    public static ResultActions expectTrainingBundle(ResultActions result,
                                                     PersonalTrainingBundle trainingBundle,
                                                     String prefix) throws Exception {
        prefix = handlePrefix(prefix);
        return result.andExpect(jsonPath("$"+prefix+"id").value(trainingBundle.getId()))
                .andExpect(jsonPath("$"+prefix+"numSessions").value(trainingBundle.getNumSessions()))
                .andExpect(jsonPath("$"+prefix+"price").value(trainingBundle.getPrice()))
                .andExpect(jsonPath("$"+prefix+"description").value(trainingBundle.getDescription()))
                .andExpect(jsonPath("$"+prefix+"name").value(trainingBundle.getName()));
    }
}
