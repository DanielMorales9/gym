package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.util.List;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class CourseTrainingBundleSpecification extends ATrainingBundleSpecification {

    public static final String TYPE = "C";

    @Column(name = "number")
    private Integer number;

    @Column(name="max_customers")
    private Integer maxCustomers;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name="bundle_spec_id")
    private List<TimeOption> options;

    public Integer getNumber() {
        return number;
    }

    public void setNumber(Integer number) {
        this.number = number;
    }

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

    public List<TimeOption> getOptions() {
        return options;
    }

    public void setOptions(List<TimeOption> options) {
        this.options = options;
    }
}
