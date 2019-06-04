package it.gym.model;

import lombok.Data;

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
    public boolean equals(Object obj) {
        AUser that = (Trainer) obj;
        return that != null && this.getId().equals(that.getId());
    }

    @Override
    public String getType() {
        return "T";
    }
}
