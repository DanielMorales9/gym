package it.goodfellas.hateoas;

import it.goodfellas.model.ATrainingBundle;
import org.springframework.hateoas.Resources;

public class TrainingBundleResource extends ResourceModel<ATrainingBundle> {

    private TrainingBundleSpecificationResource bundleSpecificationResource;

    private Resources<TrainingSessionResource> sessions;

    TrainingBundleResource(ATrainingBundle model) {
        super(model);
    }

    public TrainingBundleSpecificationResource getBundleSpecificationResource() {
        return bundleSpecificationResource;
    }

    public void setBundleSpecificationResource(TrainingBundleSpecificationResource bundleSpecificationResource) {
        this.bundleSpecificationResource = bundleSpecificationResource;
    }

    public Resources<TrainingSessionResource> getSessions() {
        return sessions;
    }

    public void setSessions(Resources<TrainingSessionResource> sessions) {
        this.sessions = sessions;
    }
}
