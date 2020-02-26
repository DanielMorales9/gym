package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "bundle_spec_id", nullable = false)
    private List<TimeOption> options;

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
    public ATrainingBundle createTrainingBundle() {
        CourseTrainingBundle ctb = new CourseTrainingBundle();
        ctb.setName(this.getName());
        ctb.setBundleSpec(this);
        ctb.setUnlimitedDeletions(this.getUnlimitedDeletions());
        ctb.setNumDeletions(this.getNumDeletions());
        return ctb;
    }

    public List<TimeOption> getOptions() {
        return options;
    }

    public void setOptions(List<TimeOption> options) {
        this.options = options;
    }

    public void addOption(TimeOption option) {
        if (this.options == null) {
            this.options = new ArrayList<>();
        }
        this.options.add(option);
    }
}
