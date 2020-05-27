package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Generated;
import org.springframework.hateoas.server.ExposesResourceFor;

import javax.persistence.*;
import java.util.Collections;
import java.util.List;
import java.util.Objects;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@ExposesResourceFor(value = AEvent.class)
@Generated //exclude coverage analysis on generated methods
public class PersonalTrainingEvent extends ATrainingEvent {

    public static final String TYPE = "P";

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name = "reservation_res_id")
    private Reservation reservation;

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name = "session_session_id")
    private ATrainingSession session;

    @Override
    public String getType() {
        return "P";
    }

    public ATrainingSession getSession() {
        return session;
    }

    @Override
    public boolean isSessionDeletable() {
        return this.session.isDeletable();
    }

    @Override
    public void complete() {
        this.session.complete();
    }

    @Override
    public void removeWorkout(Workout w) {
        this.session.removeWorkout(w);
    }

    @Override
    public ATrainingSession getSession(Reservation res) {
        return session;
    }

    @Override
    public void deleteSession(Reservation res) {
        this.session = null;
    }

    @Override
    public void addSession(Long reservationId, ATrainingSession session) {
        this.session = session;
    }

    @Override
    public List<ATrainingBundle> deleteSessionsFromBundles() {
        session.deleteMeFromBundle();
        return Collections.singletonList(session.getTrainingBundle());
    }

    @Override
    public void addReservation(Reservation res) {
        this.reservation = res;
    }

    public void setSession(ATrainingSession session) {
        this.session = session;
    }

    @Override
    public boolean isReservable() {
        return true;
    }

    public Reservation getReservation() {
        return reservation;
    }

    public void setReservation(Reservation reservation) {
        this.reservation = reservation;
    }

    @Override
    public Reservation createReservation(Customer customer) {
        Reservation res = new Reservation();
        res.setConfirmed(false);
        res.setUser(customer);
        return res;
    }

    @Override
    public void deleteReservation(Reservation res) {
        this.reservation = null;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        if (!super.equals(o)) return false;
        PersonalTrainingEvent that = (PersonalTrainingEvent) o;
        return Objects.equals(reservation, that.reservation) &&
                Objects.equals(session, that.session);
    }

    @Override
    public int hashCode() {
        return super.hashCode();
    }

    @Override
    public String toString() {
        return "PersonalEvent{" +
                "startTime" + this.getStartTime() +
                "endTime" + this.getEndTime() +
                '}';
    }

}
