package it.gym.model;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Collections;
import java.util.List;

@Entity
@DiscriminatorValue(value="T")
public class Trainer extends AUser {

    @Override
    public List<Role> defaultRoles() {
        return Collections.singletonList(new Role(2L, "TRAINER"));
    }

    @Override
    public String getType() {
        return "T";
    }
}
