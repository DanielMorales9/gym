package it.goodfellas.hateoas;

import it.goodfellas.model.ATrainingBundle;
import it.goodfellas.repository.TrainingBundleRepository;
import it.goodfellas.utility.Constants;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class TrainingBundleAssembler extends ResourceAssemblerSupport<ATrainingBundle,
        TrainingBundleResource> {

    public TrainingBundleAssembler() {
        super(ATrainingBundle.class, TrainingBundleResource.class);
    }

    @Override
    public TrainingBundleResource toResource(ATrainingBundle bundle) {
        TrainingBundleResource resource = new TrainingBundleResource(bundle);
        resource.add(linkTo(TrainingBundleRepository.class).slash(Constants.BUNDLE_BASE_PATH)
                .slash(bundle.getId()).withSelfRel());

        TrainingBundleSpecificationResource res = new TrainingBundleSpecificationAssembler()
                .toResource(bundle.getBundleSpec());
        resource.setBundleSpecificationResource(res);
        resource.setSessions(new Resources<>(new TrainingSessionAssembler().toResources(bundle.getSessions())));
        return resource;
    }
}
