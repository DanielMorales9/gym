package it.gym.hateoas;

import it.gym.model.ATrainingBundle;
import org.springframework.hateoas.Resources;

public class TrainingBundleResource extends ResourceModel<ATrainingBundle> {

    TrainingBundleResource(ATrainingBundle model) {
        super(model);
    }
}
