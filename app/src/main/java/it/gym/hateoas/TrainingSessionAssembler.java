package it.gym.hateoas;

import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingSessionRepository;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class TrainingSessionAssembler extends ResourceAssemblerSupport<ATrainingSession,
        TrainingSessionResource> {

    public TrainingSessionAssembler() {
        super(ATrainingSession.class, TrainingSessionResource.class);
    }

    @Override
    public TrainingSessionResource toResource(ATrainingSession session) {
        return new TrainingSessionResource(session);
    }
}
