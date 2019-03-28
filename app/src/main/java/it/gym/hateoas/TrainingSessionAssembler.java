package it.gym.hateoas;

import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import it.gym.repository.TrainingBundleRepository;
import it.gym.repository.TrainingSessionRepository;
import it.gym.utility.Constants;
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
        resource.add(linkTo(TrainingSessionRepository.class).slash(Constants.SESSION_BASE_PATH)
                .slash(session.getId()).withSelfRel());
        resource.add(linkTo(TrainingBundleRepository.class).slash(Constants.BUNDLE_BASE_PATH)
                .slash(session.getTrainingBundle().getId()).withRel(Constants.BUNDLE_BASE_PATH));
        return resource;
    }
}
