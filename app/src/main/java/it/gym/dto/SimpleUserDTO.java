package it.gym.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public class SimpleUserDTO {

  private final Long id;
  private final String firstName;
  private final String lastName;

  public SimpleUserDTO(Long id, String firstName, String lastName) {
    this.id = id;
    this.firstName = firstName;
    this.lastName = lastName;
  }

  @JsonProperty("id")
  public Long getCustomerId() {
    return id;
  }

  public String getFirstName() {
    return firstName;
  }

  public String getLastName() {
    return lastName;
  }
}
