package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@Data
@EqualsAndHashCode(callSuper = true)
public class PersonalTrainingBundleSpecification extends ATrainingBundleSpecification {

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

}
