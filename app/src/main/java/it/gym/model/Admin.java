package it.gym.model;

import java.util.Arrays;
import java.util.List;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

@Entity
@DiscriminatorValue(value = "A")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated // exclude coverage analysis on generated methods
public class Admin extends AUser {

  @Override
  public List<Role> defaultRoles() {
    return Arrays.asList(new Role(1L, "ADMIN"), new Role(2L, "TRAINER"));
  }

  @Override
  public String getType() {
    return "A";
  }

  @Override
  public boolean isActive() {
    return false;
  }
}
