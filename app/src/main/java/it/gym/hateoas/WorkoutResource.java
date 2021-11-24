package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.Workout;
import org.springframework.hateoas.RepresentationModel;

public class WorkoutResource extends RepresentationModel<WorkoutResource> {

  @JsonUnwrapped private Workout model;

  WorkoutResource(Workout model) {
    this.model = model;
  }
}
