package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.model.ATrainingBundleSpecification;
import org.springframework.hateoas.RepresentationModel;

class InnerTrainingBundleSpecificationResource extends RepresentationModel<InnerTrainingBundleSpecificationResource> {

    private final Long id;
    private final String name;
    private final String description;

    public InnerTrainingBundleSpecificationResource(ATrainingBundleSpecification trainingBundleSpec) {
        id = trainingBundleSpec.getId();
        name = trainingBundleSpec.getName();
        description = trainingBundleSpec.getDescription();
    }

    @JsonProperty("id")
    public Long getBundleSpecId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }
}
