package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.Generated;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Objects;

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
@Generated //exclude coverage analysis on generated methods
public abstract class ATrainingBundle implements Comparable<ATrainingBundle>, Serializable, Eager<ATrainingBundle> {

    @Id
    @SequenceGenerator(name = "bundles_bundle_id_seq",
            sequenceName = "bundles_bundle_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "bundles_bundle_id_seq")
    @Column(name="bundle_id")
    private Long id;

    @Column(name = "name")
    private String name;

    @Column(name = "createdat", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Column(name = "expired_at")
    @Temporal(TemporalType.TIMESTAMP)
    private Date expiredAt;

    @ManyToOne
    @JoinColumn(name = "bundle_spec_bundle_spec_id")
    private ATrainingBundleSpecification bundleSpec;

    @OneToMany(cascade = CascadeType.ALL, mappedBy = "trainingBundle")
    private List<ATrainingSession> sessions;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Customer customer;

    @Column(name = "unlimited_deletions")
    private Boolean unlimitedDeletions;

    @Column(name = "n_deletions")
    private Integer numDeletions;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time")
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time")
    private Date endTime;

    @OneToOne(cascade = {CascadeType.REFRESH, CascadeType.DETACH, CascadeType.MERGE})
    @JoinColumn(name = "option_id")
    private APurchaseOption option;

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public APurchaseOption getOption() {
        return option;
    }

    public void setOption(APurchaseOption option) {
        this.option = option;
    }

    public abstract String getType();
    public abstract Boolean isDeletable();

    @JsonIgnore
    public Boolean isExpired() {
        return this.getOption().isExpired(this);
    }

    @JsonIgnore
    public Double getPrice() {
        return getOption().getPrice();
    }

    public abstract ATrainingSession createSession(ATrainingEvent event);

    public void terminate() {
        this.setExpiredAt(new Date());
    }

    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

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

    public ATrainingBundleSpecification getBundleSpec() {
        return bundleSpec;
    }

    public void setBundleSpec(ATrainingBundleSpecification bundleSpec) {
        this.bundleSpec = bundleSpec;
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

    public void setExpiredAt(Date expiredAt) {
        this.expiredAt = expiredAt;
    }

    public Customer getCustomer() {
        return customer;
    }

    public void setCustomer(Customer customer) {
        this.customer = customer;
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
        return "id=" + id + ", name='" + name + ", createdAt=" + createdAt + ", " +
                "startTime=" + startTime + ", endTime=" + endTime;
    }

    protected void activateBundle(Date activationTime) {
        this.setStartTime(activationTime);
        this.setEndTime(this.getOption().getEndDate(this));
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        ATrainingBundle that = (ATrainingBundle) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }

    @Override
    public ATrainingBundle eager() {
        this.getSessions().forEach(ATrainingSession::eager);
        return this;
    }

    public void addSession(ATrainingSession session) {
        if (!this.hasSessions()) {
            this.setSessions(new ArrayList<>());
            this.activateBundle(session.getStartTime());
        }

        this.getSessions().add(session);
    }

    protected boolean hasSessions() {
        if (this.sessions != null) {
            return this.sessions.size() > 0;
        }
        else {
            return false;
        }
    }
}
