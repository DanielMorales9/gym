package it.gym.model;

import it.gym.exception.MethodNotAllowedException;
import java.util.Date;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

@Entity
@DiscriminatorValue(value = "P")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated // exclude coverage analysis on generated methods
public class PersonalTrainingSession extends ATrainingSession {

  @Override
  public String getType() {
    return "P";
  }

  @Override
  public ATrainingBundle deleteMeFromBundle() {
    this.getTrainingBundle().getSessions().remove(this);
    return this.getTrainingBundle();
  }

  @Override
  public boolean isDeletable() {
    return !this.getCompleted();
  }

  @Override
  public void complete() {
    if (!this.getEndTime().before(new Date()))
      throw new MethodNotAllowedException("Impossibile completare la sessione");
    setCompleted(true);
  }
}
