package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.*;
import java.util.Date;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@Data
@EqualsAndHashCode(callSuper = true)
public class CourseTrainingBundleSpecification extends ATrainingBundleSpecification {

    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;

    @Column(name="max_customers", nullable = false)
    private Integer maxCustomers;

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Integer getMaxCustomers() {
        return maxCustomers;
    }

    public void setMaxCustomers(Integer maxCustomers) {
        this.maxCustomers = maxCustomers;
    }

    @Override
    public String getType() {
        return "C";
    }

    @Override
    public ATrainingBundle createTrainingBundle() {
        return null;
    }


}
