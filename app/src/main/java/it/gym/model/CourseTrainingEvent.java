package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import it.gym.exception.MethodNotAllowedException;
import lombok.Generated;
import org.springframework.hateoas.server.ExposesResourceFor;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@ExposesResourceFor(value = AEvent.class)
@Generated //exclude coverage analysis on generated methods
public class CourseTrainingEvent extends ATrainingEvent {

    public static final String TYPE = "C";

    @OneToMany(
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            mappedBy = "event",
            fetch = FetchType.EAGER)
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
        return nReservations < ((CourseTrainingBundleSpecification) this.getSpecification()).getMaxCustomers();
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    @Override
    public Reservation createReservation(Customer customer) {
        Reservation reservation = new Reservation();
        reservation.setUser(customer);
        reservation.setConfirmed(true);
        return reservation;
    }

    @Override
    public void deleteReservation(Reservation res) {
        this.reservations.remove(res);
    }

    @Override
    public List<ATrainingBundle> deleteSessionsFromBundles() {
        return reservations.stream()
                .map(Reservation::getSession)
                .map(ATrainingSession::deleteMeFromBundle)
                .distinct()
                .collect(Collectors.toList());
    }

    @Override
    public boolean isSessionDeletable() {
        return this.reservations
                .stream()
                .map(Reservation::getSession)
                .map(ATrainingSession::isDeletable)
                .reduce(Boolean::logicalAnd)
                .orElse(true);
    }

    @Override
    public void complete() {
        this.reservations.forEach(r -> r.getSession().complete());
    }


    @Override
    public void addReservation(Reservation res) {
        if (reservations == null)
            reservations = new ArrayList<>();

        long nReservations = reservations
                .stream()
                .filter(reservation -> reservation.getUser().equals(res.getUser()))
                .count();
        if (nReservations > 0)
            throw new MethodNotAllowedException("Hai già prenotato il corso");

        reservations.add(res);
    }

    @Override
    public String toString() {
        return "CourseEvent {" +
                " id " + this.getId() +
                " name " +  getName() +
                " startTime " + this.getStartTime() +
                " endTime " + this.getEndTime() +
                " } ";
    }

}
