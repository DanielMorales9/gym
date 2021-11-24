package it.gym.pojo;

import it.gym.model.Role;
import java.util.Date;
import java.util.List;
import java.util.Objects;

public class UserDTO {
  private final Long id;
  private final String firstName;
  private final String lastName;
  private final String email;
  private final Date createdAt;
  private final String phoneNumber;
  private final String type;
  private final boolean verified;
  private final boolean gender;
  private final List<Role> roles;

  public UserDTO(
      Long id,
      String firstName,
      String lastName,
      String email,
      Date createdAt,
      String phoneNumber,
      String type,
      boolean verified,
      boolean gender,
      List<Role> roles) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.createdAt = createdAt;
    this.phoneNumber = phoneNumber;
    this.type = type;
    this.verified = verified;
    this.gender = gender;
    this.roles = roles;
  }

  public boolean isVerified() {
    return verified;
  }

  public Long getId() {
    return id;
  }

  public String getType() {
    return type;
  }

  public String getPhoneNumber() {
    return phoneNumber;
  }

  public Date getCreatedAt() {
    return createdAt;
  }

  public String getEmail() {
    return email;
  }

  public String getLastName() {
    return lastName;
  }

  public String getFirstName() {
    return firstName;
  }

  public boolean isGender() {
    return gender;
  }

  @Override
  public boolean equals(Object o) {
    if (this == o) return true;
    if (o == null || getClass() != o.getClass()) return false;
    UserDTO that = (UserDTO) o;
    return verified == that.verified
        && gender == that.gender
        && Objects.equals(id, that.id)
        && Objects.equals(firstName, that.firstName)
        && Objects.equals(lastName, that.lastName)
        && Objects.equals(email, that.email)
        && Objects.equals(createdAt, that.createdAt)
        && Objects.equals(phoneNumber, that.phoneNumber)
        && Objects.equals(type, that.type);
  }

  @Override
  public int hashCode() {
    return Objects.hash(
        id,
        firstName,
        lastName,
        email,
        createdAt,
        phoneNumber,
        type,
        verified,
        gender);
  }

  @Override
  public String toString() {
    return "UserDTO{"
        + "id="
        + id
        + ", firstName='"
        + firstName
        + '\''
        + ", lastName='"
        + lastName
        + '\''
        + ", email='"
        + email
        + '\''
        + ", createdAt="
        + createdAt
        + ", phoneNumber='"
        + phoneNumber
        + '\''
        + ", type='"
        + type
        + '\''
        + ", verified="
        + verified
        + ", gender="
        + gender
        + '}';
  }

  public List<Role> getRoles() {
    return roles;
  }
}
