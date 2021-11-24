package it.gym.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import it.gym.exception.BadRequestException;
import java.io.Serializable;
import java.util.*;
import javax.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(
      value = PersonalTrainingBundleSpecification.class,
      name = "P"),
  @JsonSubTypes.Type(
      value = CourseTrainingBundleSpecification.class,
      name = "C")
})
@Entity
@Table(name = "bundle_specs")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
    name = "bundle_spec_type",
    discriminatorType = DiscriminatorType.STRING,
    length = 1)
@Data
@EqualsAndHashCode
@Generated // exclude coverage analysis on generated methods
public abstract class ATrainingBundleSpecification
    implements Serializable, Eager<ATrainingBundleSpecification> {

  @Id
  @SequenceGenerator(
      name = "bundle_specs_spec_id_seq",
      sequenceName = "bundle_specs_spec_id_seq",
      allocationSize = 1)
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "bundle_specs_spec_id_seq")
  @Column(name = "bundle_spec_id")
  private Long id;

  @Column(name = "name", nullable = false)
  protected String name;

  @Column(name = "description", nullable = false)
  protected String description;

  @Column(name = "is_disabled", nullable = false)
  private Boolean isDisabled;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdAt;

  @Column(name = "unlimited_deletions")
  private Boolean unlimitedDeletions;

  @Column(name = "n_deletions")
  private Integer numDeletions;

  @OneToMany(cascade = CascadeType.ALL)
  @JoinColumn(name = "spec_id", nullable = false)
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

  public abstract ATrainingBundle createTrainingBundle(Long optionId);

  public void setOption(Long optionId, ATrainingBundle bundle) {
    List<APurchaseOption> options = this.getOptions();
    if (options == null) {
      throw new BadRequestException("L'opzione indicata non è disponibile");
    }
    Optional<APurchaseOption> op =
        options.stream().filter(o -> o.getId().equals(optionId)).findFirst();

    if (!op.isPresent()) {
      throw new BadRequestException("L'opzione indicata non è disponibile");
    }

    bundle.setOption(op.get());
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

  @Override
  public ATrainingBundleSpecification eager() {
    if (options != null) options.forEach(APurchaseOption::eager);
    else options = new ArrayList<>();
    return this;
  }

  @PrePersist
  protected void prePersist() {
    this.createdAt = new Date();
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    ATrainingBundleSpecification that = (ATrainingBundleSpecification) o;
    return Objects.equals(id, that.id)
        && Objects.equals(name, that.name)
        && Objects.equals(description, that.description)
        && Objects.equals(isDisabled, that.isDisabled)
        && Objects.equals(createdAt, that.createdAt)
        && Objects.equals(unlimitedDeletions, that.unlimitedDeletions)
        && Objects.equals(numDeletions, that.numDeletions)
        && Objects.equals(options, that.options);
  }

  @Override
  public int hashCode() {
    return Objects.hash(
        id,
        name,
        description,
        isDisabled,
        createdAt,
        unlimitedDeletions,
        numDeletions,
        options);
  }

  @Override
  public String toString() {
    return "ATrainingBundleSpecification{"
        + "id="
        + id
        + ", name='"
        + name
        + '\''
        + ", description='"
        + description
        + '\''
        + ", isDisabled="
        + isDisabled
        + ", createdAt="
        + createdAt
        + ", unlimitedDeletions="
        + unlimitedDeletions
        + ", numDeletions="
        + numDeletions
        + ", options="
        + options
        + '}';
  }

  public Integer getMaxCustomers() {
    return 1;
  }
}
