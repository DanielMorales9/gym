package it.gym.model;

import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Collections;
import java.util.List;

@Entity
@DiscriminatorValue(value="T")
@Data
@EqualsAndHashCode(callSuper = true)
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
