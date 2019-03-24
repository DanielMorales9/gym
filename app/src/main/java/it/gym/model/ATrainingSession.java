package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
@Table(name="sessions")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="session_type", discriminatorType=DiscriminatorType.STRING, length=1)
public abstract class ATrainingSession {

    @Id
    @SequenceGenerator(name = "sessions_session_id_seq",
            sequenceName = "sessions_session_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sessions_session_id_seq")
    @Column(name="session_id")
    private Long id;

    @ManyToOne
    @JsonIgnore
    private ATrainingBundle trainingBundle;

    ATrainingSession() {
    }

    public abstract String getType();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public abstract void deleteMeFromBundle();
    public abstract boolean isDeletable();
    public abstract void complete();

    @Override
    public boolean equals(Object o) {
        ATrainingSession u = (ATrainingSession) o;
        return u.getId().equals(this.getId());
    }

    public ATrainingBundle getTrainingBundle() {
        return trainingBundle;
    }

    public void setTrainingBundle(ATrainingBundle trainingBundle) {
        this.trainingBundle = trainingBundle;
    }

    public abstract boolean getCompleted();
}
