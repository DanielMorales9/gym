package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Generated;

import javax.persistence.*;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
import java.util.List;

@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, property = "type", visible = true)
@JsonSubTypes({
  @JsonSubTypes.Type(value = Admin.class, name = "A"),
  @JsonSubTypes.Type(value = Customer.class, name = "C"),
  @JsonSubTypes.Type(value = Trainer.class, name = "T")
})
@Entity
@Table(name = "users")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(
    name = "user_type",
    discriminatorType = DiscriminatorType.STRING,
    length = 1)
@Data
@EqualsAndHashCode
@Generated // exclude coverage analysis on generated methods
public abstract class AUser
    implements DefaultRoles, Serializable, Eager<AUser> {

  @Id
  @SequenceGenerator(
      name = "users_user_id_seq",
      sequenceName = "users_user_id_seq",
      allocationSize = 1)
  @GeneratedValue(
      strategy = GenerationType.SEQUENCE,
      generator = "users_user_id_seq")
  @Column(name = "user_id")
  private Long id;

  @Column(name = "email", nullable = false, unique = true)
  @NotEmpty(message = "Email must not be empty")
  @Email(message = "Invalid Email")
  protected String email;

  @Column(name = "gender")
  protected Boolean gender; // woman is true, man is false

  @Column(name = "password")
  @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
  protected String password;

  @Column(name = "firstname", nullable = false)
  @NotNull
  @Size(min = 2, max = 30)
  protected String firstName;

  @Column(name = "lastname", nullable = false)
  @NotNull
  @Size(min = 2, max = 30)
  protected String lastName;

  @Column(name = "phone_number")
  protected String phoneNumber;

  @Column(name = "created_at", nullable = false, updatable = false)
  @Temporal(TemporalType.TIMESTAMP)
  private Date createdAt;

  @Column(name = "is_verified", nullable = false)
  private boolean isVerified;

  @ManyToMany(fetch = FetchType.EAGER)
  @JoinTable(
      name = "users_roles",
      uniqueConstraints =
          @UniqueConstraint(columnNames = {"user_id", "role_id"}),
      joinColumns =
          @JoinColumn(name = "user_id", referencedColumnName = "user_id"),
      inverseJoinColumns =
          @JoinColumn(name = "role_id", referencedColumnName = "role_id"))
  private List<Role> roles;

  @OneToOne(
      mappedBy = "user",
      cascade = CascadeType.ALL,
      fetch = FetchType.LAZY)
  @JsonIgnore
  private Image image;

  public abstract String getType();

  @JsonIgnore
  public abstract boolean isActive();

  @PrePersist
  protected void prePersist() {
    this.createdAt = new Date();
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Date createdAt) {
    this.createdAt = createdAt;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPassword() {
    return password;
  }

  public void setPassword(String password) {
    this.password = password;
  }

  public String getFirstName() {
    return firstName;
  }

  public void setFirstName(String firstName) {
    this.firstName = firstName;
  }

  public String getLastName() {
    return lastName;
  }

  public void setLastName(String lastName) {
    this.lastName = lastName;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public void setPhoneNumber(String phoneNumber) {
    this.phoneNumber = phoneNumber;
  }

  public List<Role> getRoles() {
    return roles;
  }

  public void setRoles(List<Role> roles) {
    this.roles = roles;
  }

  @Override
  public String toString() {
    return "User: " + this.firstName + ", " + this.lastName + ", " + this.email;
  }

  public boolean isVerified() {
    return this.isVerified;
  }

  public void setVerified(boolean verified) {
    isVerified = verified;
  }

  public void setGender(boolean gender) {
    this.gender = gender;
  }

  public Boolean isGender() {
    return gender;
  }

  public Image getImage() {
    return image;
  }

  public void setImage(Image image) {
    this.image = image;
  }

  @Override
  public AUser eager() {
    this.getRoles().forEach(Role::eager);
    return this;
  }
}
