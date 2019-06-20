package it.gym.hateoas;

import it.gym.controller.ReservationController;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.utility.Constants;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class TrainingBundleSpecificationAssembler
        extends ResourceAssemblerSupport<ATrainingBundleSpecification, TrainingBundleSpecificationResource> {

    public TrainingBundleSpecificationAssembler(){
        super(ATrainingBundleSpecification.class, TrainingBundleSpecificationResource.class);

    }

    @Override
    public TrainingBundleSpecificationResource toResource(ATrainingBundleSpecification specs) {
        TrainingBundleSpecificationResource resource = new TrainingBundleSpecificationResource(specs);
        resource.add(linkTo(ReservationController.class).slash(Constants.BUNDLE_SPECS_BASE_PATH)
                .slash(specs.getId()).withSelfRel());
        return resource;
    }
}
