package it.gym.pojo;

import java.util.Date;

public class UserDTO {
    private final Long id;
    private final String firstName;
    private final String lastName;
    private final String email;
    private final Date createdAt;
    private final String phoneNumber;
    private final String type;
    private final boolean verified;

    public UserDTO(Long id,
                   String firstName,
                   String lastName,
                   String email,
                   Date createdAt,
                   String phoneNumber,
                   String type,
                   boolean verified) {
        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.createdAt = createdAt;
        this.phoneNumber = phoneNumber;
        this.type = type;
        this.verified = verified;
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
}
