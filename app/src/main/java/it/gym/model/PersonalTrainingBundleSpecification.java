package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
public class PersonalTrainingBundleSpecification extends ATrainingBundleSpecification {

    @Column(name="num_sessions", nullable = false)
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

    @Override
    public ATrainingBundle createTrainingBundle() {
        PersonalTrainingBundle ptb = new PersonalTrainingBundle();
        ptb.setNumSessions(numSessions);
        ptb.setPrice(this.getPrice());
        ptb.setDescription(this.getDescription());
        ptb.setName(this.getName());
        ptb.setBundleSpec(this);
        ptb.setExpired(false);
        return ptb;
    }

    @Override
    public int hashCode() {
        return getId().hashCode();
    }

    @Override
    public boolean equals(Object o) {
        PersonalTrainingBundleSpecification u = (PersonalTrainingBundleSpecification) o;
        return u != null && u.getId().equals(this.getId());
    }
}
