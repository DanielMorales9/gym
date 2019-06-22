package it.gym.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
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
@RestResource(path="bundles")
@Table(name="bundles")
@Inheritance(strategy=InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="bundle_type", discriminatorType=DiscriminatorType.STRING, length=1)
@Data
@EqualsAndHashCode
public abstract class ATrainingBundle implements Comparable<ATrainingBundle> {

    @Id
    @SequenceGenerator(name = "bundles_bundle_id_seq",
            sequenceName = "bundles_bundle_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bundles_bundle_id_seq")
    @Column(name="bundle_id")
    private Long id;

    @Column(name = "description")
    private String description;

    @Column(name = "name")
    private String name;

    @Column(name = "price")
    private Double price;

    @Column(name = "is_expired")
    private Boolean isExpired;

    @Column(name = "createdat", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @ManyToOne
    private ATrainingBundleSpecification bundleSpec;

    @OneToMany(cascade = CascadeType.ALL)
    private List<ATrainingSession> sessions;

    public abstract String getType();
    public abstract Boolean isExpired();
    public abstract Boolean isDeletable();

    public abstract ATrainingSession createSession(Date startTime, Date endTime);
    public abstract void addSession(ATrainingSession session);

    public Double getPrice() {
        return price;
    }

    public void setPrice(Double price) {
        this.price = price;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ATrainingBundleSpecification getBundleSpec() {
        return bundleSpec;
    }

    public void setBundleSpec(ATrainingBundleSpecification bundleSpec) {
        this.bundleSpec = bundleSpec;
    }

    public Boolean getExpired() {
        return isExpired;
    }

    public void setExpired(Boolean expired) {
        isExpired = expired;
    }

    public List<ATrainingSession> getSessions() {
        return sessions;
    }

    void setSessions(List<ATrainingSession> sessions) {
        this.sessions = sessions;
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

    @PrePersist
    protected void prePersist() {
        this.createdAt = new Date();
    }
}
