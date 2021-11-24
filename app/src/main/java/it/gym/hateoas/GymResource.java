package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.Gym;
import org.springframework.hateoas.RepresentationModel;

public class GymResource extends RepresentationModel<GymResource> {

  @JsonUnwrapped Gym model;

  GymResource(Gym model) {
    this.model = model;
  }
}
