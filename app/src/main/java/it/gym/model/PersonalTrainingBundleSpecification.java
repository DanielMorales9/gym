package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

@Entity
@DiscriminatorValue(value = "P")
@JsonTypeName("P")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated // exclude coverage analysis on generated methods
public class PersonalTrainingBundleSpecification
    extends ATrainingBundleSpecification {

  @Override
  public String getType() {
    return "P";
  }

  @Override
  public ATrainingBundle createTrainingBundle(Long optionId) {
    PersonalTrainingBundle ptb = new PersonalTrainingBundle();
    ptb.setName(this.getName());
    ptb.setBundleSpec(this);
    ptb.setUnlimitedDeletions(this.getUnlimitedDeletions());
    ptb.setNumDeletions(this.getNumDeletions());
    setOption(optionId, ptb);
    return ptb;
  }

  @Override
  public PersonalTrainingBundleSpecification eager() {
    super.eager();
    return this;
  }
}
