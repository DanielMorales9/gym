package it.gym.hateoas;

import it.gym.model.Admin;
import it.gym.repository.AdminRepository;
import it.gym.utility.Constants;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class AdminAssembler extends ResourceAssemblerSupport<Admin, AdminResource> {

    public AdminAssembler(){
        super(Admin.class, AdminResource.class);

    }

    @Override
    public AdminResource toResource(Admin admin) {
        AdminResource resource = new AdminResource(admin);
        resource.setRole(new Resources<>(new RoleAssembler().toResources(admin.getRoles())));
        resource.add(linkTo(AdminRepository.class).slash(Constants.ADMIN_BASE_PATH)
                .slash(admin.getId()).withSelfRel());
        return resource;
    }
}
