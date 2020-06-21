package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;

@Entity
@Table(name = "reservations")
@Generated //exclude coverage analysis on generated methods
public class Reservation implements Serializable {

    @Id
    @SequenceGenerator(name = "reservations_res_id_seq",
            sequenceName = "reservations_res_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reservations_res_id_seq")
    @Column(name="res_id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_user_id")
    private Customer user;

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private ATrainingEvent event;

    // This good as you can extend it to ManyToOne
    @OneToOne
    @JoinColumn(name = "session_id")
    private ATrainingSession session;

    @Column(name = "is_confirmed")
    private Boolean isConfirmed;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getConfirmed() {
        return isConfirmed;
    }

    public void setConfirmed(Boolean confirmed) {
        isConfirmed = confirmed;
    }

    public Customer getUser() {
        return user;
    }

    public void setUser(Customer user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Reservation that = (Reservation) o;
        return id.equals(that.id) &&
                Objects.equals(isConfirmed, that.isConfirmed);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, isConfirmed);
    }

    @JsonIgnore
    public ATrainingEvent getEvent() {
        return event;
    }

    public void setEvent(ATrainingEvent event) {
        this.event = event;
    }

    public ATrainingSession getSession() {
        return session;
    }

    public void setSession(ATrainingSession session) {
        this.session = session;
    }
}
