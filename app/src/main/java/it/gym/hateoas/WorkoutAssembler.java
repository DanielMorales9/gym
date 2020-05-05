package it.gym.hateoas;

import it.gym.model.AUser;
import it.gym.model.Workout;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingSessionRepository;
import it.gym.repository.UserRepository;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class WorkoutAssembler extends ResourceAssemblerSupport<Workout, WorkoutResource> {

    public WorkoutAssembler(){
        super(Workout.class, WorkoutResource.class);
    }

    @Override
    public WorkoutResource toResource(Workout workout) {
        return new WorkoutResource(workout);
    }
}
