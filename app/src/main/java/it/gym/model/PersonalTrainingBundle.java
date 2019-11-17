package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.ArrayList;
import java.util.Date;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@ExposesResourceFor(value = ATrainingBundle.class)
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class PersonalTrainingBundle extends ATrainingBundle {

    @Column(name="num_sessions")
    private Integer numSessions;

    public Integer getNumSessions() {
        return numSessions;
    }

    public void setNumSessions(Integer numSessions) {
        this.numSessions = numSessions;
    }

    @Override
    public int compareTo(ATrainingBundle aTrainingBundle) {
        return this.getSessions().size() - aTrainingBundle.getSessions().size();
    }

    @Override
    public String getType() {
        return "P";
    }

    @Override
    public Boolean isExpired() {
        Integer size = (this.getSessions() == null) ? 0 : this.getSessions().size();
        return this.numSessions.equals(size);
    }

    @Override
    public Boolean isDeletable() {
        if (this.getSessions() == null) {
            return true;
        }
        return this.getSessions().stream()
                .map(ATrainingSession::isDeletable)
                .reduce(Boolean::logicalAnd).orElse(true);
    }

    @Override
    public ATrainingSession createSession(Date startTime, Date endTime) {
        PersonalTrainingSession session = new PersonalTrainingSession();
        session.setCompleted(false);
        session.setEndTime(endTime);
        session.setStartTime(startTime);
        session.setTrainingBundle(this);
        return session;
    }

    @Override
    public void addSession(ATrainingSession session) {
        if (this.getSessions() == null) {
            this.setSessions(new ArrayList<>());
        }

        this.getSessions().add(session);
    }

}
