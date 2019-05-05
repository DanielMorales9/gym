package it.gym.model;

import javax.persistence.*;
import java.util.Arrays;
import java.util.List;

@Entity
@DiscriminatorValue(value="A")
public class Admin extends AUser {

    public Admin() {}

    public Admin(String firstName, String lastName, String email, String password, boolean verified) {
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.password = password;
        this.isVerified = verified;
    }

    @Override
    public List<Role> defaultRoles() {
        return Arrays.asList(
                new Role((long) 1, "ADMIN"),
                new Role((long) 2, "TRAINER"),
                new Role((long) 3, "CUSTOMER"));
    }

    @Override
    public String getType() {
        return "A";
    }
}
