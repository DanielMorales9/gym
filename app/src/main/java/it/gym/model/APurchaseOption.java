package it.gym.model;

import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import java.io.Serializable;
import java.util.Date;
import java.util.Objects;
import javax.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(value = TimePurchaseOption.class, name = "T"),
  @JsonSubTypes.Type(value = BundlePurchaseOption.class, name = "B"),
  @JsonSubTypes.Type(value = OnDemandPurchaseOption.class, name = "D"),
})
@Entity
@Table(name = "options")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
    name = "option_type",
    discriminatorType = DiscriminatorType.STRING,
    length = 1)
@Data
@EqualsAndHashCode
@Generated // exclude coverage analysis on generated methods
public abstract class APurchaseOption
    implements Serializable, Eager<APurchaseOption> {

  @Id
  @SequenceGenerator(
      name = "options_id_seq",
      sequenceName = "options_id_seq",
      allocationSize = 1)
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "options_id_seq")
  @Column(name = "option_id")
  private Long id;

  @Column(name = "name", nullable = false)
  private String name;

  @Column(name = "price", nullable = false)
  private Double price;

  @Column(name = "created_at", nullable = false)
  private Date createdAt;

  @Column(name = "number")
  private Integer number;

  public Integer getNumber() {
    return number;
  }

  public void setNumber(Integer number) {
    this.number = number;
  }

  public abstract String getType();

  public abstract Double getPrice(ATrainingBundle bundle);

  public abstract Boolean isExpired(ATrainingBundle bundle);

  public Double getPrice() {
    return this.price;
  }

  public void setPrice(Double price) {
    this.price = price;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Date createdAt) {
    this.createdAt = createdAt;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  @PrePersist
  public void prePersist() {
    this.createdAt = new Date();
  }

  @Override
  public APurchaseOption eager() {
    return this;
  }

  public abstract Date getEndDate(ATrainingBundle bundle);

  public abstract Double getPercentageStatus(ATrainingBundle trainingBundle);

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    APurchaseOption that = (APurchaseOption) o;
    return Objects.equals(id, that.id)
        && Objects.equals(name, that.name)
        && Objects.equals(price, that.price)
        && Objects.equals(createdAt, that.createdAt)
        && Objects.equals(number, that.number);
  }

  @Override
  public int hashCode() {
    return Objects.hash(id, name, price, createdAt, number);
  }

  @Override
  public String toString() {
    return "APurchaseOption{"
        + "id="
        + id
        + ", name='"
        + name
        + '\''
        + ", price="
        + price
        + ", createdAt="
        + createdAt
        + ", number="
        + number
        + '}';
  }
}
