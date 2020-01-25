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
    public ATrainingSession createSession(ATrainingEvent event) {
        CourseTrainingSession session = new CourseTrainingSession();
        session.setStartTime(event.getStartTime());
        session.setEndTime(event.getEndTime());
        session.setCompleted(false);
        session.setTrainingBundle(this);
        return session;
    }

    @Override
    public boolean assignOption(Long optionId) {
        List<TimeOption> options = ((CourseTrainingBundleSpecification) getBundleSpec()).getOptions();
        if(options == null)
            return false;

        Optional<TimeOption> op = options
                .stream()
                .filter(o -> o.getId().equals(optionId))
                .findFirst();

        boolean present = op.isPresent();
        if (present) {
            this.option = op.get();
        }
        return present;
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

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), option);
    }

    @Override
    public String toString() {
        return "CourseTrainingBundle{" + super.toString()+
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", option=" + option +
                '}';
    }


}
