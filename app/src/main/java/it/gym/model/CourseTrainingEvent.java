package it.gym.model;

import com.fasterxml.jackson.annotation.JsonTypeName;
import it.gym.exception.MethodNotAllowedException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import javax.persistence.*;
import lombok.Generated;
import org.springframework.hateoas.server.ExposesResourceFor;

@Entity
@DiscriminatorValue(value = "C")
@JsonTypeName("C")
@ExposesResourceFor(value = AEvent.class)
@Generated // exclude coverage analysis on generated methods
public class CourseTrainingEvent extends ATrainingEvent {

  public static final String TYPE = "C";

  @OneToMany(
      cascade = CascadeType.ALL,
      orphanRemoval = true,
      mappedBy = "event",
      fetch = FetchType.EAGER)
  private List<Reservation> reservations;

  @Column(name = "max_customers")
  private Integer maxCustomers;

  public Integer getMaxCustomers() {
    return maxCustomers;
  }

  public void setMaxCustomers(Integer maxCustomers) {
    this.maxCustomers = maxCustomers;
  }

  @Override
  public String getType() {
    return "C";
  }

  @Override
  public boolean isReservable() {
    int nReservations;
    if (this.reservations == null) nReservations = 0;
    else nReservations = reservations.size();
    return nReservations < getMaxCustomers();
  }

  public List<Reservation> getReservations() {
    if (reservations != null) return reservations;
    return new ArrayList<>();
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
    return this.reservations.stream()
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
  public boolean isDeletable() {
    return false;
  }

  @Override
  public void addReservation(Reservation res) {
    if (reservations == null) reservations = new ArrayList<>();

    long nReservations =
        reservations.stream()
            .filter(reservation -> reservation.getUser().equals(res.getUser()))
            .count();
    if (nReservations > 0)
      throw new MethodNotAllowedException("Hai già prenotato il corso");

    reservations.add(res);
  }

  @Override
  public String toString() {
    return "CourseEvent {"
        + " id "
        + this.getId()
        + " name "
        + getName()
        + " startTime "
        + this.getStartTime()
        + " endTime "
        + this.getEndTime()
        + " } ";
  }
}
