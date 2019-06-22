package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;
import java.util.Date;

@Entity
@DiscriminatorValue(value="H")
@JsonTypeName("H")
@ExposesResourceFor(value = Event.class)
@Data
@EqualsAndHashCode
public class Holiday extends Event {

    private static final String TYPE = "H";

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Gym gym;

    public Gym getGym() {
        return gym;
    }

    public void setGym(Gym gym) {
        this.gym = gym;
    }

    @Override
    public String getType() {
        return TYPE;
    }

    @Override
    public String toString() {

        return " Tipo :" + this.getType() +
                " Nome :" + this.getName() +
                " Palestra: " + this.gym.toString() +
                " Data :" + this.getStartTime().toString();
    }
}
