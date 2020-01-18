package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.data.repository.cdi.Eager;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

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

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name="bundle_specs_options",
            joinColumns = @JoinColumn( name="bundle_spec_id"),
            inverseJoinColumns = @JoinColumn( name="option_id")
    )
    private Set<TimeOption> options;

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
        return null;
    }

    public Set<TimeOption> getOptions() {
        return options;
    }

    public void setOptions(Set<TimeOption> options) {
        this.options = options;
    }

    public void addOption(TimeOption option) {
        if (this.options == null) {
            this.options = new HashSet<>();
        }
        this.options.add(option);
    }
}
