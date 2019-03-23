package it.gym.hateoas;

import it.gym.model.SalesLineItem;

public class SalesLineItemResource extends ResourceModel<SalesLineItem> {

    private TrainingBundleSpecificationResource bundleSpecification;

    SalesLineItemResource(SalesLineItem model) {
        super(model);
    }

    public TrainingBundleSpecificationResource getBundleSpecification() {
        return bundleSpecification;
    }

    public void setBundleSpecification(TrainingBundleSpecificationResource bundleSpecification) {
        this.bundleSpecification = bundleSpecification;
    }
}
