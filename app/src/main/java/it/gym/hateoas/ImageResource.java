package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.Image;
import it.gym.model.Sale;
import org.springframework.hateoas.RepresentationModel;

public class ImageResource extends RepresentationModel<ImageResource> {

  @JsonUnwrapped Image model;

  ImageResource(Image model) {
    this.model = model;
  }
}
