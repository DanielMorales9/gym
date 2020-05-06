package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PersonalTrainingSession.class, name="P"),
        @JsonSubTypes.Type(value = CourseTrainingSession.class, name="C")
})
@Entity
@Table(name="sessions")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="session_type", discriminatorType=DiscriminatorType.STRING, length=1)
@Data
@EqualsAndHashCode
@Generated //exclude coverage analysis on generated methods
public abstract class ATrainingSession {

    @Id
    @SequenceGenerator(name = "sessions_session_id_seq",
            sequenceName = "sessions_session_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sessions_session_id_seq")
    @Column(name="session_id")
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time")
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time")
    private Date endTime;

    @ManyToOne
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "training_bundle_bundle_id")
    private ATrainingBundle trainingBundle;

    @Column(name = "is_completed")
    private Boolean isCompleted;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "session_id")
    private List<Workout> workouts;

    public boolean getCompleted() {
        return isCompleted;
    }

    public void setCompleted(Boolean completed) {
        isCompleted = completed;
    }

    public abstract String getType();
    public abstract boolean isDeletable();
    public abstract void complete();
    public abstract void deleteMeFromBundle();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @JsonIgnore
    public ATrainingBundle getTrainingBundle() {
        return trainingBundle;
    }

    public void setTrainingBundle(ATrainingBundle trainingBundle) {
        this.trainingBundle = trainingBundle;
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

    public List<Workout> getWorkouts() {
        return workouts;
    }

    public void setWorkouts(List<Workout> workouts) {
        this.workouts = workouts;
    }

    public void addWorkout(Workout w) {
        Workout child = w.createFromTemplate();
        if (this.getWorkouts() == null) {
            this.setWorkouts(new ArrayList<>());
        }
        this.getWorkouts().add(child);
    }

    public void removeWorkout(Workout w) {
        this.getWorkouts().remove(w);
    }
}
