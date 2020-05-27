package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import it.gym.exception.BadRequestException;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

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
}
