package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import lombok.ToString;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@ExposesResourceFor(value = AEvent.class)
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class PersonalEvent extends ATrainingEvent {

    @OneToOne(cascade = CascadeType.ALL, orphanRemoval=true)
    @JoinColumn(name = "reservation_res_id")
    private Reservation reservation;

    @Override
    public String getType() {
        return "P";
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
    public Reservation reserve(Customer customer) {
        reservation = new Reservation();
        reservation.setConfirmed(false);
        reservation.setUser(customer);
        return reservation;
    }

    @Override
    public void deleteReservation(Reservation res) {
        this.reservation = null;
    }

    @Override
    public void deleteSession() {
        this.getSession().deleteMeFromBundle();
    }


    @Override
    public String toString() {
        return "PersonalEvent{" +
                "startTime" + this.getStartTime() +
                "endTime" + this.getEndTime() +
                '}';
    }
}
