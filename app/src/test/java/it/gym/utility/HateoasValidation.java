package it.gym.utility;

import it.gym.model.Admin;
import it.gym.model.Gym;
import it.gym.model.Role;
import org.jetbrains.annotations.NotNull;
import org.springframework.test.web.servlet.ResultActions;

import java.util.List;
import java.util.StringJoiner;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

public class HateoasValidation {

    public static ResultActions expectAdmin(ResultActions result, Admin admin, String prefix) throws Exception {
        prefix = handlePrefix(prefix);
        return result
                .andExpect(jsonPath("$"+prefix+"id").value(admin.getId()))
                .andExpect(jsonPath("$"+prefix+"email").value(admin.getEmail()))
                .andExpect(jsonPath("$"+prefix+"firstName").value(admin.getFirstName()))
                .andExpect(jsonPath("$"+prefix+"lastName").value(admin.getLastName()))
                .andExpect(jsonPath("$"+prefix+"verified").value(admin.isVerified()));
    }

    public static ResultActions expectAdmin(ResultActions result, Admin admin) throws Exception {
        return expectAdmin(result, admin, null);
    }

    public static ResultActions expectAdminRoles(ResultActions result, List<Role> roles) throws Exception {
        return expectAdminRoles(result, roles, null);
    }

    public static ResultActions expectAdminRoles(ResultActions result, List<Role> roles, String prefix) throws Exception {
        prefix = handlePrefixForArray(prefix);
        return result
                .andExpect(jsonPath("$"+prefix+"[0].id").value(roles.get(0).getId()))
                .andExpect(jsonPath("$"+prefix+"[0].name").value(roles.get(0).getName()))
                .andExpect(jsonPath("$"+prefix+"[1].id").value(roles.get(1).getId()))
                .andExpect(jsonPath("$"+prefix+"[1].name").value(roles.get(1).getName()))
                .andExpect(jsonPath("$"+prefix+"[2].id").value(roles.get(2).getId()))
                .andExpect(jsonPath("$"+prefix+"[2].name").value(roles.get(2).getName()));
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

}
