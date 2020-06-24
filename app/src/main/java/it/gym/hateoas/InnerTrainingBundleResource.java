package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.model.ATrainingBundle;
import org.springframework.hateoas.RepresentationModel;

class InnerTrainingBundleResource extends RepresentationModel<InnerTrainingBundleResource> {

    private final Long id;
    private final String name;

    public InnerTrainingBundleResource(ATrainingBundle trainingBundle) {
        id = trainingBundle.getId();
        name = trainingBundle.getName();
    }

    @JsonProperty("id")
    public Long getBundleSpecId() {
        return id;
    }

    public String getName() {
        return name;
    }

}
