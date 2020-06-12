package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.Role;
import org.springframework.hateoas.RepresentationModel;

public class RoleResource extends RepresentationModel<RoleResource> {

    @JsonUnwrapped
    Role model;

    RoleResource(Role model) {
        this.model = model;
    }
}
