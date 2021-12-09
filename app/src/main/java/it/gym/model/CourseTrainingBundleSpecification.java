package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import lombok.Generated;

@Entity
@DiscriminatorValue(value = "C")
@JsonTypeName("C")
@Generated // exclude coverage analysis on generated methods
public class CourseTrainingBundleSpecification
    extends ATrainingBundleSpecification {

  public static final String TYPE = "C";

  @Override
  public String getType() {
    return TYPE;
  }

  @Override
  public ATrainingBundle createTrainingBundle(Long optionId) {
    CourseTrainingBundle ctb = new CourseTrainingBundle();
    ctb.setName(this.getName());
    ctb.setBundleSpec(this);
    ctb.setUnlimitedDeletions(this.getUnlimitedDeletions());
    ctb.setNumDeletions(this.getNumDeletions());
    setOption(optionId, ctb);
    return ctb;
  }

  @Override
  public String toString() {
    return "CourseTrainingBundleSpecification{"
        + "maxCustomers="
        + getMaxCustomers()
        + '}';
  }
}
