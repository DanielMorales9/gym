package it.gym.hateoas;

import it.gym.model.Role;
import it.gym.repository.RoleRepository;
import it.gym.utility.Constants;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class RoleAssembler extends ResourceAssemblerSupport<Role, RoleResource> {


    public RoleAssembler() {
        super(Role.class, RoleResource.class);
    }

    @Override
    public RoleResource toResource(Role role) {
        RoleResource resource = new RoleResource(role);
        resource.add(linkTo(RoleRepository.class).slash(Constants.ROLE_BASE_PATH)
                .slash(role.getId()).withSelfRel());
        return resource;
    }
}
