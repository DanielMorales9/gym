package it.gym.hateoas;

import it.gym.model.ATrainingBundle;
import it.gym.repository.TrainingBundleRepository;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class TrainingBundleAssembler extends ResourceAssemblerSupport<ATrainingBundle, TrainingBundleResource> {

    public TrainingBundleAssembler() {
        super(ATrainingBundle.class, TrainingBundleResource.class);
    }

    @Override
    public TrainingBundleResource toResource(ATrainingBundle bundle) {
        TrainingBundleResource resource = new TrainingBundleResource(bundle);
        resource.add(linkTo(TrainingBundleRepository.class).slash("bundles")
                .slash(bundle.getId()).withSelfRel());

        return resource;
    }
}
