package it.gym.hateoas;

import it.gym.model.Role;
import it.gym.repository.RoleRepository;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

public class RoleAssembler
    extends RepresentationModelAssemblerSupport<Role, RoleResource> {

  public RoleAssembler() {
    super(Role.class, RoleResource.class);
  }

  @Override
  public RoleResource toModel(Role role) {
    RoleResource resource = new RoleResource(role);
    resource.add(
        linkTo(RoleRepository.class)
            .slash("roles")
            .slash(role.getId())
            .withSelfRel());
    return resource;
  }
}
