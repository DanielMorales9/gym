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

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PersonalTrainingEvent.class, name="P"),
        @JsonSubTypes.Type(value = CourseTrainingEvent.class, name="C"),
})
@RestResource(path="events")
@Table(name="events")
@Inheritance(strategy= InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.STRING, length=1)
@Entity
@Data
@EqualsAndHashCode(callSuper = true)
@JsonIgnoreProperties({"reservations", "sessions"})
@Generated //exclude coverage analysis on generated methods
public abstract class ATrainingEvent extends AEvent {

    @JsonIgnore
    public abstract boolean isReservable();
    @JsonIgnore
    public abstract Reservation createReservation(Customer customer);
    @JsonIgnore
    public abstract void addReservation(Reservation res);
    @JsonIgnore
    public abstract void deleteReservation(Reservation res);

    @JsonIgnore
    public abstract boolean isSessionDeletable();
    @JsonIgnore
    public abstract void addSession(Long reservationId, ATrainingSession session);
    @JsonIgnore
    public abstract List<ATrainingSession> deleteSessions();
    @JsonIgnore
    public abstract List<ATrainingBundle> deleteSessionsFromBundles();

    @JsonIgnore
    public abstract void deleteSession(Reservation res);
    @JsonIgnore
    public abstract ATrainingSession getSession(Reservation res);
    @JsonIgnore
    public abstract void complete();
    @JsonIgnore
    public abstract List<Reservation> deleteReservations();

}
