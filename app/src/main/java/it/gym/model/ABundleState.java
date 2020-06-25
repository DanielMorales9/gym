package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Date;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = BundleCreateState.class, name="S"),
        @JsonSubTypes.Type(value = BundleActiveState.class, name="A"),
        @JsonSubTypes.Type(value = BundleCompleteState.class, name="C"),
})
@Entity
@Table(name="bundle_state")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="bundle_state_type", discriminatorType=DiscriminatorType.STRING, length=1)
@Data
@EqualsAndHashCode
@Generated //exclude coverage analysis on generated methods
public abstract class ABundleState implements Serializable, Eager<ABundleState> {

    @Id
    @SequenceGenerator(name = "bundle_state_id_seq",
            sequenceName = "bundle_state_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bundle_state_id_seq")
    @Column(name="bundle_state_id")
    private Long id;

    @Column(name = "date")
    private Date date;

    @ManyToOne
    @JsonIgnore
    @EqualsAndHashCode.Exclude
    @JoinColumn(name = "bundle_id")
    protected ATrainingBundle trainingBundle;


    public abstract String getType();

    public ABundleState() {}

    public ABundleState(ATrainingBundle trainingBundle) {
        this.trainingBundle = trainingBundle;
    }

    @Override
    public ABundleState eager() {
        return this;
    }

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

    public void onInit() {
        this.setDate(new Date());
    }

    public abstract void onActivate();
    public abstract void onComplete();

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }
}
