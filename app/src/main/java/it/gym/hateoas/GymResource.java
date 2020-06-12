package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.Admin;
import it.gym.model.Gym;
import it.gym.model.SalesLineItem;
import org.springframework.hateoas.RepresentationModel;

public class GymResource extends RepresentationModel<GymResource> {

    @JsonUnwrapped
    Gym model;

    GymResource(Gym model) {
        this.model = model;
    }
}
