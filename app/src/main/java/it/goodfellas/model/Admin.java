package it.goodfellas.model;

import it.goodfellas.model.AUser;
import it.goodfellas.utility.Constants;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
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
