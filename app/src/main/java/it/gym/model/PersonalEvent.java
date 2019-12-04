package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;
import java.util.List;

@Entity
@DiscriminatorValue(value="P")
@JsonTypeName("P")
@ExposesResourceFor(value = AEvent.class)
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class PersonalEvent extends ATrainingEvent {

    public static final String TYPE = "P";

    @OneToOne(cascade = CascadeType.ALL)
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
    public boolean deleteReservation(Reservation res) {
        return true;
    }
}
