package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;

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

    @ManyToOne
    @JsonIgnore
    @EqualsAndHashCode.Exclude private ATrainingBundle trainingBundle;

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

    public ATrainingBundle getTrainingBundle() {
        return trainingBundle;
    }

    public void setTrainingBundle(ATrainingBundle trainingBundle) {
        this.trainingBundle = trainingBundle;
    }
}
