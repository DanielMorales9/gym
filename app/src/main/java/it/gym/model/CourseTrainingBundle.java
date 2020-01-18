package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;

import static org.apache.commons.lang3.time.DateUtils.addMonths;

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

    @OneToOne(cascade = {CascadeType.REFRESH, CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "option_id")
    private TimeOption option;

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

    public TimeOption getOption() {
        return option;
    }

    public void setOption(TimeOption option) {
        this.option = option;
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
    public Double getPrice() {
        return this.option.getPrice();
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
    public void update() {
        setEndTime(addMonths(this.startTime, this.option.getNumber()));
    }

    @Override
    public int compareTo(ATrainingBundle o) {
        return  this.getSessions().size() - o.getSessions().size();
    }


}
