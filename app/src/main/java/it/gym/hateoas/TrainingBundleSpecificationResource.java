package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.ATrainingBundleSpecification;
import org.springframework.hateoas.RepresentationModel;

public class TrainingBundleSpecificationResource
    extends RepresentationModel<TrainingBundleSpecificationResource> {

  @JsonUnwrapped private ATrainingBundleSpecification model;

  TrainingBundleSpecificationResource(ATrainingBundleSpecification model) {
    this.model = model;
  }
}
