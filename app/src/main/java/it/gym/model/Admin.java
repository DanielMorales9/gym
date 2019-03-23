package it.gym.model;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Arrays;
import java.util.List;

@Entity
@DiscriminatorValue(value="A")
public class Admin extends AUser {

    @Override
    public List<Role> defaultRoles() {
        return Arrays.asList(
                new Role((long) 1, "ADMIN"),
                new Role((long) 2, "TRAINER"),
                new Role((long) 3, "CUSTOMER"));
    }
}
