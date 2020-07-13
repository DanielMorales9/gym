package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Objects;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class CourseTrainingBundleSpecification extends ATrainingBundleSpecification {

    public static final String TYPE = "C";

    @Column(name="max_customers")
    private Integer maxCustomers;

    @Override
    public Integer getMaxCustomers() {
        return maxCustomers;
    }

    public void setMaxCustomers(Integer maxCustomers) {
        this.maxCustomers = maxCustomers;
    }

    @Override
    public String getType() {
        return TYPE;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        CourseTrainingBundleSpecification that = (CourseTrainingBundleSpecification) o;
        return Objects.equals(maxCustomers, that.maxCustomers);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), maxCustomers);
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
    public CourseTrainingBundleSpecification eager() {
        super.eager();
        return this;
    }

    @Override
    public String toString() {
        return "CourseTrainingBundleSpecification{" +
                "maxCustomers=" + maxCustomers +
                '}';
    }
}
