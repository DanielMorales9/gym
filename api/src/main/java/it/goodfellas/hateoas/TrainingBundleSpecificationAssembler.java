package it.goodfellas.hateoas;

import it.goodfellas.controller.TrainingReservationController;
import it.goodfellas.model.ATrainingBundleSpecification;
import it.goodfellas.utility.Constants;
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
        resource.add(linkTo(TrainingReservationController.class).slash(Constants.BUNDLE_SPECS_BASE_PATH)
                .slash(specs.getId()).withSelfRel());
        return resource;
    }
}
