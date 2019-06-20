package it.gym.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name="times_off")
@Data
public class TimeOff {

    @Id
    @SequenceGenerator(name = "times_off_id_seq",
            sequenceName = "times_off_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "times_off_id_seq")
    @Column(name="time_off_id")
    private Long id;

    @Column(name="name")
    private String name;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private AUser user;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time")
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time")
    private Date endTime;

    @Column(name="type")
    private String type;

    public TimeOff() {

    }

    public TimeOff(String name, String type, AUser user, Date startTime, Date endTime) {
        this.name = name;
        this.type = type;
        this.user = user;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public AUser getUser() {
        return user;
    }

    public void setUser(AUser user) {
        this.user = user;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Override
    public String toString() {

        return " Tipo :" + this.type +
                " Nome :" + this.name +
                " User :" + this.user.toString() +
                " Data :" + this.startTime.toString();
    }
}
