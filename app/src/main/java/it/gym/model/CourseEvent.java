package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import it.gym.exception.MethodNotAllowedException;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@ExposesResourceFor(value = AEvent.class)
@Data
@EqualsAndHashCode(callSuper = true)
@Generated //exclude coverage analysis on generated methods
public class CourseEvent extends ATrainingEvent {

    public static final String TYPE = "C";

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "event_id")
    private List<Reservation> reservations;

    @Override
    public String getType() {
        return "C";
    }

    @Override
    public boolean isReservable() {
        int nReservations;
        if (this.reservations == null) nReservations = 0;
        else nReservations = reservations.size();
        return nReservations < ((CourseTrainingSession) this.getSession()).getMaxCustomers() ;
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public void setReservations(List<Reservation> reservations) {
        this.reservations = reservations;
    }


    @Override
    public Reservation reserve(Customer customer) {
        if (reservations == null)
            reservations = new ArrayList<>();

        long res = reservations.stream().filter(reservation -> reservation.getUser().equals(customer)).count();
        if (res > 0)
            throw new MethodNotAllowedException("Hai già prenotato il corso");

        Reservation reservation = new Reservation();
        reservation.setUser(customer);
        reservation.setConfirmed(true);
        reservations.add(reservation);
        return reservation;
    }

    @Override
    public void deleteReservation(Reservation res) {
        this.reservations.remove(res);
    }

    @Override
    public void deleteSession() {
        this.setSession(null);
        // the session is shared among other users and it should not deleted
    }
}
