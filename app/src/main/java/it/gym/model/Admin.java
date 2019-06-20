package it.gym.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Arrays;
import java.util.List;

@Entity
@DiscriminatorValue(value="A")
@Data
@EqualsAndHashCode(callSuper = true)
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
                new Role(1L, "ADMIN"),
                new Role(2L, "TRAINER"),
                new Role(3L, "CUSTOMER"));
    }

    @Override
    public String getType() {
        return "A";
    }
}
