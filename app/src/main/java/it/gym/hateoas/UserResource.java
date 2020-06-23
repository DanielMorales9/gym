package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.model.AUser;
import org.springframework.hateoas.RepresentationModel;

public class UserResource extends RepresentationModel<UserResource> {

    private final Long id;
    private final String firstName;
    private final String lastName;

    public UserResource(AUser customer) {
        this.id = customer.getId();
        this.firstName = customer.getFirstName();
        this.lastName = customer.getLastName();
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
