package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"reservations", "sessions"})
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
    public abstract List<ATrainingSession> deleteSessions();
    public abstract List<ATrainingBundle> deleteSessionsFromBundles();

    public abstract void deleteSession(Reservation res);
    @JsonIgnore
    public abstract ATrainingSession getSession(Reservation res);
    public abstract void complete();
    public abstract List<Reservation> deleteReservations();

}
