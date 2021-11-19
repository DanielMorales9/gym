package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Generated;
import org.springframework.hateoas.server.ExposesResourceFor;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@ExposesResourceFor(value = ATrainingBundle.class)
@Generated //exclude coverage analysis on generated methods
public class PersonalTrainingBundle extends ATrainingBundle {

    @Override
    public int compareTo(ATrainingBundle aTrainingBundle) {
        return this.getSessions().size() - aTrainingBundle.getSessions().size();
    }

    @Override
    public String getType() {
        return "P";
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
    public ATrainingSession createSession(ATrainingEvent event) {
        PersonalTrainingSession session = new PersonalTrainingSession();
        session.setCompleted(false);
        session.setStartTime(event.getStartTime());
        session.setEndTime(event.getEndTime());
        session.setTrainingBundle(this);
        return session;
    }

    @Override
    public String toString() {
        return "PersonalTrainingBundle{ " + super.toString() + " }";
    }

}
