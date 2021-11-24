package it.gym.model;

import java.util.Collections;
import java.util.List;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

@Entity
@DiscriminatorValue(value = "T")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated // exclude coverage analysis on generated methods
public class Trainer extends AUser {

  @Override
  public List<Role> defaultRoles() {
    return Collections.singletonList(new Role(2L, "TRAINER"));
  }

  @Override
  public String getType() {
    return "T";
  }

  @Override
  public boolean isActive() {
    return false;
  }
}
