package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@ExposesResourceFor(value = ATrainingBundle.class)
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class CourseTrainingBundle extends ATrainingBundle {

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time")
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time")
    private Date endTime;

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    @Override
    public String getType() {
        return "C";
    }

    @Override
    public Boolean isExpired() {
        return new Date().after(endTime);
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
    public boolean isNotGroup() {
        return false;
    }

    @Override
    public ATrainingSession createSession(Date startTime, Date endTime) {
        CourseTrainingSession session = new CourseTrainingSession();
        session.setStartTime(startTime);
        session.setEndTime(endTime);
        session.setCompleted(false);
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

    @Override
    public int compareTo(ATrainingBundle o) {
        return  this.getSessions().size() - o.getSessions().size();
    }
}
