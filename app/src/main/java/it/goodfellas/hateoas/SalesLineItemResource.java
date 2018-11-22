package it.goodfellas.hateoas;

import it.goodfellas.model.SalesLineItem;

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
