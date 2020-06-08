package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;
import java.util.*;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@ExposesResourceFor(value = ATrainingBundle.class)
@Generated //exclude coverage analysis on generated methods
public class CourseTrainingBundle extends ATrainingBundle {

    @Override
    public String getType() {
        return "C";
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
        CourseTrainingSession session = new CourseTrainingSession();
        session.setStartTime(event.getStartTime());
        session.setEndTime(event.getEndTime());
        session.setCompleted(false);
        session.setTrainingBundle(this);
        return session;
    }

    @Override
    public int compareTo(ATrainingBundle o) {
        return  this.getSessions().size() - o.getSessions().size();
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getOption());
    }

    @Override
    public String toString() {
        return "CourseTrainingBundle{" + super.toString()+
                ", startTime=" + getStartTime() +
                ", endTime=" + getEndTime() +
                ", option=" + getOption().toString() +
                '}';
    }


}
