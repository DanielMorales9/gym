package it.gym.pojo;

import it.gym.model.APurchaseOption;
import java.util.Date;
import java.util.List;

public class TrainingBundleSpecificationDTO {
  private final Long id;
  private final String name;
  private final String description;
  private final Date createdAt;
  private final Boolean disabled;
  private final String type;
  private final Integer numDeletions;
  private final Boolean unlimitedDeletions;
  private final Integer maxCustomers;
  private final List<APurchaseOption> options;

  public TrainingBundleSpecificationDTO(
      Long id,
      String name,
      String description,
      Date createdAt,
      Boolean disabled,
      String type,
      Integer numDeletions,
      Boolean unlimitedDeletions,
      Integer maxCustomers,
      List<APurchaseOption> options) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.disabled = disabled;
    this.type = type;
    this.numDeletions = numDeletions;
    this.unlimitedDeletions = unlimitedDeletions;
    this.maxCustomers = maxCustomers;
    this.options = options;
  }

  public Long getId() {
    return id;
  }

  public String getName() {
    return name;
  }

  public String getDescription() {
    return description;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public Boolean getDisabled() {
    return disabled;
  }

  public String getType() {
    return type;
  }

  public Integer getNumDeletions() {
    return numDeletions;
  }

  public Boolean getUnlimitedDeletions() {
    return unlimitedDeletions;
  }

  public Integer getMaxCustomers() {
    return maxCustomers;
  }

  public List<APurchaseOption> getOptions() {
    return options;
  }
}
