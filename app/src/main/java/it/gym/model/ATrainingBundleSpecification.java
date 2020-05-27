package it.gym.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;


@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = PersonalTrainingBundleSpecification.class, name="P"),
        @JsonSubTypes.Type(value = CourseTrainingBundleSpecification.class, name="C")
})
@Entity
@Table(name="bundle_specs")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="bundle_spec_type", discriminatorType=DiscriminatorType.STRING, length=1)
@Data
@EqualsAndHashCode
@Generated //exclude coverage analysis on generated methods
public abstract class  ATrainingBundleSpecification implements Serializable, Eager<ATrainingBundleSpecification> {

    @Id
    @SequenceGenerator(name = "bundle_specs_spec_id_seq",
            sequenceName = "bundle_specs_spec_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bundle_specs_spec_id_seq")
    @Column(name="bundle_spec_id")
    private Long id;

    @Column(name = "name", nullable = false)
    protected String name;

    @Column(name = "description", nullable = false)
    protected String description;

    @Column(name = "is_disabled", nullable = false)
    private Boolean isDisabled;

    @Column(name = "createdat", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "unlimited_deletions")
    private Boolean unlimitedDeletions;

    @Column(name = "n_deletions")
    private Integer numDeletions;

    @OneToMany(cascade = CascadeType.ALL)
    @JoinColumn(name = "bundle_spec_id", nullable = false)
    private List<APurchaseOption> options;

    public List<APurchaseOption> getOptions() {
        return options;
    }

    public void setOptions(List<APurchaseOption> options) {
        this.options = options;
    }

    public void addOption(APurchaseOption option) {
        if (this.options == null) {
            this.options = new ArrayList<>();
        }
        this.options.add(option);
    }

    public abstract String getType();

    public abstract ATrainingBundle createTrainingBundle();

    public Integer getNumDeletions() {
        return numDeletions;
    }

    public void setNumDeletions(Integer numDeletions) {
        this.numDeletions = numDeletions;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Boolean getDisabled() {
        return isDisabled;
    }

    public void setDisabled(Boolean disabled) {
        isDisabled = disabled;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }


    public Boolean getUnlimitedDeletions() {
        return unlimitedDeletions;
    }

    public void setUnlimitedDeletions(Boolean unlimitedDeletions) {
        this.unlimitedDeletions = unlimitedDeletions;
    }

    @PrePersist
    protected void prePersist() {
        this.createdAt = new Date();
    }

    @Override
    public String toString() {
        return "Nome: " +
                this.name +
                ", Descrizione: " +
                this.description;
    }
}
