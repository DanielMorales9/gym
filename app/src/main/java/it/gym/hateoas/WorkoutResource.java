package it.gym.hateoas;

import it.gym.model.AUser;
import it.gym.model.Workout;

public class WorkoutResource extends ResourceModel<Workout> {

    WorkoutResource(Workout model) {
        super(model);
    }

}
