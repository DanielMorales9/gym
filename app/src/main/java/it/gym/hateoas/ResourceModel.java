package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import org.springframework.hateoas.ResourceSupport;

class ResourceModel<T> extends ResourceSupport {

    @JsonUnwrapped
    private T model;

    ResourceModel(T model) {
        this.model = model;
    }

}
