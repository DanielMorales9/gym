package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

@Entity
@DiscriminatorValue(value="T")
@JsonTypeName("T")
@ExposesResourceFor(value = AEvent.class)
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class TimeOff extends AEvent {

    public static final String TYPE = "T";

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AUser user;

    public AUser getUser() {
        return user;
    }

    public void setUser(AUser user) {
        this.user = user;
    }

    public String getType() {
        return TYPE;
    }

    @Override
    public String toString() {
        return "TimeOff{" +
                "startTime" + this.getStartTime() +
                "endTime" + this.getEndTime() +
                '}';
    }
}
