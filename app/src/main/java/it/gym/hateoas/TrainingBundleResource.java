package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import org.springframework.hateoas.RepresentationModel;

public class TrainingBundleResource extends RepresentationModel<TrainingBundleResource> {

    @JsonUnwrapped
    private ATrainingBundle model;

    TrainingBundleResource(ATrainingBundle model) {
        this.model = model;
    }
}
