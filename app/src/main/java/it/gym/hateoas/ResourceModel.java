package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import org.springframework.hateoas.EntityModel;

class ResourceModel<T> extends EntityModel<T> {

  @JsonUnwrapped private T model;

  ResourceModel(T model) {
    this.model = model;
  }
}
