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
    @Column(name = "end_time")
    private Date endTime;

    @OneToOne(cascade = {CascadeType.REFRESH, CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST})
    @JoinColumn(name = "option_id")
    private APurchaseOption option;

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public APurchaseOption getOption() {
        return option;
    }

    public void setOption(APurchaseOption option) {
        this.option = option;
    }

    @Override
    public String getType() {
        return "C";
    }

    @Override
    public Boolean isExpired() {
        if (endTime == null) return this.option.isExpired(this);
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
        return this.option.getPrice(this);
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

    // TODO assign Option
    @Override
    public boolean assignOption(Long optionId) {
        List<APurchaseOption> options = ((CourseTrainingBundleSpecification) getBundleSpec()).getOptions();
        if(options == null)
            return false;

        Optional<APurchaseOption> op = options
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
            this.activateBundle(session.getStartTime());
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
                ", startTime=" + getStartTime() +
                ", endTime=" + endTime +
                ", option=" + option +
                '}';
    }


}
