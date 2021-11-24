package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.AUser;
import org.springframework.hateoas.RepresentationModel;

public class AUserResource extends RepresentationModel<AUserResource> {

  @JsonUnwrapped AUser model;

  AUserResource(AUser model) {
    this.model = model;
  }
}
