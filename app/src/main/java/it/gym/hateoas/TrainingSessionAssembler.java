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
        super(ATrainingBundle.class, TrainingSessionResource.class);
    }

    @Override
    public TrainingSessionResource toResource(ATrainingSession session) {
        TrainingSessionResource resource = new TrainingSessionResource(session);
        resource.add(linkTo(TrainingSessionRepository.class).slash("sessions")
                .slash(session.getId()).withSelfRel());
        return resource;
    }
}
