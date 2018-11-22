package it.goodfellas.hateoas;

import it.goodfellas.model.ATrainingBundle;
import it.goodfellas.model.ATrainingSession;
import it.goodfellas.repository.TrainingBundleRepository;
import it.goodfellas.repository.TrainingSessionRepository;
import it.goodfellas.utility.Constants;
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
