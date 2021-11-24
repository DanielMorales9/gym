package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Generated;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import java.util.List;

@Entity
@Generated // exclude coverage analysis on generated methods
public abstract class ATrainingEvent extends AEvent {

  @Column(name = "is_external")
  private boolean isExternal;

  @ManyToOne
  @JoinColumn(name = "spec_id")
  private ATrainingBundleSpecification specification;

  public ATrainingBundleSpecification getSpecification() {
    return specification;
  }

  public void setSpecification(ATrainingBundleSpecification specification) {
    this.specification = specification;
  }

  public void setExternal(boolean external) {
    isExternal = external;
  }

  public boolean isExternal() {
    return isExternal;
  }

  public boolean isTrainingEvent() {
    return true;
  }

  public abstract Reservation createReservation(Customer customer);

  @JsonIgnore
  public abstract boolean isReservable();

  public abstract List<Reservation> getReservations();

  // TODO remove
  public abstract void addReservation(Reservation res);
  // TODO remove
  public abstract void deleteReservation(Reservation res);

  @JsonIgnore
  public abstract boolean isSessionDeletable();

  public abstract List<ATrainingBundle> deleteSessionsFromBundles();

  public abstract void complete();

  @JsonIgnore
  public abstract boolean isDeletable();
}
