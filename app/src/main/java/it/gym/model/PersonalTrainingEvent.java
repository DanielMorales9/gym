package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Generated;
import org.springframework.hateoas.server.ExposesResourceFor;
import sun.reflect.generics.reflectiveObjects.NotImplementedException;

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

    @OneToOne(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "event"
    )
    private Reservation reservation;

    @Override
    public String getType() {
        return "P";
    }

    @Override
    public boolean isSessionDeletable() {
        return this.reservation.getSession().isDeletable();
    }

    @Override
    public void complete() {
        this.reservation.getSession().complete();
    }

    @Override
    public List<ATrainingBundle> deleteSessionsFromBundles() {
        return Collections.singletonList(reservation.getSession().deleteMeFromBundle());
    }

    @Override
    public void addReservation(Reservation res) {
        this.reservation = res;
    }

    @Override
    public boolean isReservable() {
        return true;
    }

    public List<Reservation> getReservations() {
        return Collections.singletonList(reservation);
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
        return Objects.equals(reservation, that.reservation);
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
