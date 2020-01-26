package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonTypeName;
import it.gym.exception.MethodNotAllowedException;
import lombok.Data;
import lombok.Generated;
import org.springframework.hateoas.ExposesResourceFor;

import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@DiscriminatorValue(value="C")
@JsonTypeName("C")
@ExposesResourceFor(value = AEvent.class)
@Generated //exclude coverage analysis on generated methods
public class CourseTrainingEvent extends ATrainingEvent {

    public static final String TYPE = "C";

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval=true, fetch = FetchType.EAGER)
    @JoinColumn(name = "event_id")
    private List<Reservation> reservations;

    @OneToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    @JoinTable(
            name="events_sessions",
            uniqueConstraints = @UniqueConstraint(columnNames = {"event_id", "session_id"}),
            joinColumns = @JoinColumn( name="event_id", referencedColumnName="event_id"),
            inverseJoinColumns = @JoinColumn( name="session_id", referencedColumnName="session_id")
    )
    @MapKeyColumn(name = "reservation_key")
    @JsonIgnore
    private Map<Long, ATrainingSession> sessions;

    @OneToOne
    @JoinColumn(name = "spec_id")
    private CourseTrainingBundleSpecification specification;

    @Override
    public String getType() {
        return "C";
    }

    @Override
    public boolean isReservable() {
        int nReservations;
        if (this.reservations == null) nReservations = 0;
        else nReservations = reservations.size();
        return nReservations < this.specification.getMaxCustomers();
    }

    public List<Reservation> getReservations() {
        return reservations;
    }

    public CourseTrainingBundleSpecification getSpecification() {
        return specification;
    }

    public void setSpecification(CourseTrainingBundleSpecification specification) {
        this.specification = specification;
    }

    public void setReservations(List<Reservation> reservations) {
        if (this.reservations == null)
            this.reservations = reservations;
        else {
            this.reservations.clear();
            if (reservations != null)
                this.reservations.addAll(reservations);
        }
    }

    @JsonIgnore
    public Map<Long, ATrainingSession> getSessions() {
        return sessions;
    }

    public void setSessions(Map<Long, ATrainingSession> sessions) {
        this.sessions = sessions;
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
    public List<ATrainingSession> deleteSessions() {
        ArrayList<ATrainingSession> mySession = new ArrayList<>(this.sessions.values());
        sessions = null;
        return mySession;
    }

    @Override
    public List<ATrainingBundle> deleteSessionsFromBundles() {
        Collection<ATrainingSession> sess = sessions.values();
        sess.forEach(ATrainingSession::deleteMeFromBundle);
        return sess.stream().map(ATrainingSession::getTrainingBundle).collect(Collectors.toList());
    }

    @Override
    public boolean isSessionDeletable() {
        return this.sessions.values()
                .stream()
                .map(ATrainingSession::isDeletable)
                .reduce(Boolean::logicalAnd)
                .orElse(true);
    }

    @Override
    public void complete() {
        this.sessions.values().forEach(ATrainingSession::complete);
    }

    @Override
    public List<Reservation> deleteReservations() {
        List<Reservation> clone = new ArrayList<>(reservations);
        reservations = null;
        return clone;
    }

    @Override
    @JsonIgnore
    public ATrainingSession getSession(Reservation res) {
        return sessions.get(res.getId());
    }

    @Override
    public void deleteSession(Reservation res) {
        this.sessions.remove(res.getId());
    }

    @Override
    public void addSession(Long reservationId, ATrainingSession session) {
        if (sessions == null) {
            sessions = new HashMap<>();
        }
        if (sessions.containsKey(reservationId))
            throw new MethodNotAllowedException("Questa sessione è stata già prenotata");
        this.sessions.put(reservationId, session);
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
