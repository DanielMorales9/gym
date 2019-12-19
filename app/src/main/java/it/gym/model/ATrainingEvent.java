package it.gym.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import java.util.Date;

@Entity
@Inheritance(strategy= InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.STRING, length=1)
@Data
@EqualsAndHashCode(callSuper = false)
@Generated //exclude coverage analysis on generated methods
public abstract class ATrainingEvent extends AEvent {

    @OneToOne(cascade = CascadeType.ALL)
    private ATrainingSession session;

    @Override
    public ATrainingSession getSession() {
        return session;
    }

    public void setSession(ATrainingSession session) {
        this.session = session;
    }

    public abstract Reservation reserve(Customer customer);

    public abstract void deleteReservation(Reservation res);

    public abstract void deleteSession();
}
