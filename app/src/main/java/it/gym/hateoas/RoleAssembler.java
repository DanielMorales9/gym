package it.gym.hateoas;

import it.gym.model.Role;
import it.gym.repository.RoleRepository;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class RoleAssembler extends ResourceAssemblerSupport<Role, RoleResource> {


    public RoleAssembler() {
        super(Role.class, RoleResource.class);
    }

    @Override
    public RoleResource toResource(Role role) {
        RoleResource resource = new RoleResource(role);
        resource.add(linkTo(RoleRepository.class).slash("roles")
                .slash(role.getId()).withSelfRel());
        return resource;
    }
}
