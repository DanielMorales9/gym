package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;

@Entity
@DiscriminatorValue(value="H")
@JsonTypeName("H")
@ExposesResourceFor(value = AEvent.class)
@Data
@EqualsAndHashCode(callSuper = true)
public class Holiday extends AEvent {

    public static final String TYPE = "H";

    @Override
    public String getType() {
        return TYPE;
    }

    @Override
    public String toString() {

        return " Tipo :" + this.getType() +
                " Nome :" + this.getName() +
                " Palestra: " + this.getGym().toString() +
                " Data :" + this.getStartTime().toString();
    }
}
