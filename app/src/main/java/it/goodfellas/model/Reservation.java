package it.goodfellas.model;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "reservations")
public class Reservation {

    @Id
    @SequenceGenerator(name = "reservations_res_id_seq",
            sequenceName = "reservations_res_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "reservations_res_id_seq")
    @Column(name="res_id")
    private Long id;

    @ManyToOne
    private Customer user;

    @Temporal(TemporalType.TIMESTAMP)
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    private Date endTime;

    @OneToOne(cascade = CascadeType.ALL)
    private ATrainingSession session;

    private Boolean isConfirmed;

    public Reservation() {}

    Reservation(PersonalTrainingSession session,
                Customer c,
                Date startTime,
                Date endTime,
                boolean isConfirmed) {
        this.session = session;
        this.user = c;
        this.startTime = startTime;
        this.endTime = endTime;
        this.isConfirmed = isConfirmed;
    }

    public ATrainingSession getSession() {
        return session;
    }

    public void setSession(ATrainingSession session) {
        this.session = session;
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

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

    @Override
    public boolean equals(Object o) {
        Reservation u = (Reservation) o;
        return u.getId().equals(this.getId());
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Customer getUser() {
        return user;
    }

    public void setUser(Customer user) {
        this.user = user;
    }
}
