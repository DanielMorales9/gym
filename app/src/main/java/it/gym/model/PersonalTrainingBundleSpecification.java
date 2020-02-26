package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class PersonalTrainingBundleSpecification extends ATrainingBundleSpecification {

    @Column(name = "price", nullable = false)
    protected Double price;

    @Column(name="num_sessions")
    private Integer numSessions;

    public Integer getNumSessions() {
        return numSessions;
    }

    public void setNumSessions(Integer numSessions) {
        this.numSessions = numSessions;
    }

    @Override
    public String getType() {
        return "P";
    }

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    @Override
    public ATrainingBundle createTrainingBundle() {
        PersonalTrainingBundle ptb = new PersonalTrainingBundle();
        ptb.setName(this.getName());
        ptb.setBundleSpec(this);
        ptb.setUnlimitedDeletions(this.getUnlimitedDeletions());
        ptb.setNumDeletions(this.getNumDeletions());
        return ptb;
    }

}
