package it.goodfellas.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.Column;
import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import java.util.Date;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@ExposesResourceFor(value = ATrainingBundle.class)
public class PersonalTrainingBundle extends ATrainingBundle {

    @Column(name="numSessions")
    private Integer numSessions;

    public Integer getNumSessions() {
        return numSessions;
    }

    void setNumSessions(Integer numSessions) {
        this.numSessions = numSessions;
    }

    @Override
    public int compareTo(ATrainingBundle aTrainingBundle) {
        return  this.getSessions().size() -
                aTrainingBundle.getSessions()
                .size();
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
                .map(session -> !session.getCompleted())
                .reduce(Boolean::logicalAnd).orElse(true);
    }

    @Override
    public Reservation book(Customer c, Date startTime, Date endTime) {
        PersonalTrainingSession session = new PersonalTrainingSession(this,
                startTime, endTime, false);
        return new Reservation(session, c, startTime, endTime, false);
    }

    @Override
    public void addSession(ATrainingSession session) {
        this.getSessions().add(session);
    }

}
