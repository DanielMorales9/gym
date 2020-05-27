package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.ATrainingSession;
import org.springframework.hateoas.RepresentationModel;

public class TrainingSessionResource extends RepresentationModel<TrainingSessionResource> {

    @JsonUnwrapped
    private ATrainingSession model;

    TrainingSessionResource(ATrainingSession model) {
        this.model = model;
    }

}
