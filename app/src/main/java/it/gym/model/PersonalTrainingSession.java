package it.gym.model;

import it.gym.exception.NotAllowedException;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import java.util.Date;

@Entity
@DiscriminatorValue(value="P")
public class PersonalTrainingSession extends ATrainingSession {

    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;

    private Boolean isCompleted;

    public PersonalTrainingSession() {

    }

    @Override
    public String getType() {
        return "P";
    }

    PersonalTrainingSession(ATrainingBundle trainingBundle, Date startTime, Date endTime, boolean isCompleted) {
        this.setTrainingBundle(trainingBundle);
        this.startTime = startTime;
        this.endTime = endTime;
        this.isCompleted = isCompleted;
    }

    public Date getStartTime() {
        return startTime;
    }

    void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    @Override
    public void deleteMeFromBundle() {
        this.getTrainingBundle().getSessions().remove(this);
    }

    @Override
    public boolean isDeletable() {
        return startTime.after(new Date());
    }

    @Override
    public void complete() {
        if (!this.getEndTime().before(new Date()))
            throw new NotAllowedException("Impossibile completare la sessione");
        isCompleted = true;
    }

    public Date getEndTime() {
        return endTime;
    }

    void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public boolean getCompleted() {
        return isCompleted;
    }

    public void setCompleted(Boolean completed) {
        isCompleted = completed;
    }
}
