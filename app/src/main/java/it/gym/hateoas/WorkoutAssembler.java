package it.gym.hateoas;

import it.gym.model.Workout;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class WorkoutAssembler
    extends RepresentationModelAssemblerSupport<Workout, WorkoutResource> {

  public WorkoutAssembler() {
    super(Workout.class, WorkoutResource.class);
  }

  @Override
  public WorkoutResource toModel(Workout workout) {
    return new WorkoutResource(workout);
  }
}
