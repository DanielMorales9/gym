package it.goodfellas.model;

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

    public PersonalTrainingBundleSpecification() {}

    public PersonalTrainingBundleSpecification(Integer numSessions, String description, Double price) {
        this.numSessions = numSessions;
        this.description = description;
        this.price = price;

    }

    public Integer getNumSessions() {
        return numSessions;
    }

    public void setNumSessions(Integer numSessions) {
        this.numSessions = numSessions;
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
    public String toString() {
        return this.name;
    }
}
