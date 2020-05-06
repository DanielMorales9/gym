package it.gym.model;

import it.gym.exception.MethodNotAllowedException;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.ArrayList;
import java.util.Date;

@Entity
@DiscriminatorValue(value="C")
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class CourseTrainingSession extends ATrainingSession {

    @Override
    public String getType() {
        return "P";
    }

    @Override
    public void deleteMeFromBundle() {
        this.getTrainingBundle().getSessions().remove(this);
    }

    @Override
    public void addWorkout(Workout w) {
        Workout child = w.createFromTemplate();
        if (this.getWorkouts() == null) {
            this.setWorkouts(new ArrayList<>());
        }
        this.getWorkouts().add(w);
    }

    @Override
    public boolean isDeletable() {
        return !this.getCompleted();
    }

    @Override
    public void complete() {
        if (!this.getEndTime().before(new Date()))
            throw new MethodNotAllowedException("Impossibile completare la sessione");
        setCompleted(true);
    }
}
