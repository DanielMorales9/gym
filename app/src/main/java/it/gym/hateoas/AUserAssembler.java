package it.gym.hateoas;

import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

public class AUserAssembler
    extends RepresentationModelAssemblerSupport<AUser, AUserResource> {

  public AUserAssembler() {
    super(AUser.class, AUserResource.class);
  }

  @Override
  public AUserResource toModel(AUser user) {
    AUserResource resource = new AUserResource(user);
    resource.add(
        linkTo(UserRepository.class)
            .slash("users")
            .slash(user.getId())
            .withSelfRel());
    return resource;
  }
}
