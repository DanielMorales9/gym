package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Generated;

import javax.persistence.Entity;
import java.util.List;

@Entity
@Generated //exclude coverage analysis on generated methods
public abstract class ATrainingEvent extends AEvent {

    @JsonIgnore
    public abstract boolean isReservable();
    public abstract Reservation createReservation(Customer customer);
    public abstract void addReservation(Reservation res);
    public abstract void deleteReservation(Reservation res);

    @JsonIgnore
    public abstract boolean isSessionDeletable();
    public abstract void addSession(Long reservationId, ATrainingSession session);

    public abstract List<ATrainingBundle> deleteSessionsFromBundles();

    public abstract void deleteSession(Reservation res);
    @JsonIgnore
    public abstract ATrainingSession getSession(Reservation res);
    public abstract void complete();

}
