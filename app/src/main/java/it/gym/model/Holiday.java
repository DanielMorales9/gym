package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.DiscriminatorValue;
import javax.persistence.Entity;

@Entity
@DiscriminatorValue(value="H")
@JsonTypeName("H")
@ExposesResourceFor(value = AEvent.class)
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class Holiday extends AEvent {

    public static final String TYPE = "H";

    @Override
    public String getType() {
        return TYPE;
    }

    @Override
    public boolean isReservable() {
        return false;
    }

    @Override
    public ATrainingSession getSession() {
        return null;
    }

    @Override
    public String toString() {
        return "Holiday{" +
                "startTime" + this.getStartTime() +
                "endTime" + this.getEndTime() +
                '}';
    }
}
