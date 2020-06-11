package it.gym.hateoas;

import it.gym.controller.SaleController;
import it.gym.model.Sale;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class SaleAssembler  extends ResourceAssemblerSupport<Sale, SaleResource> {

    public SaleAssembler() {
        super(Sale.class, SaleResource.class);
    }

    @Override
    public SaleResource toResource(Sale sale) {
        SaleResource resource = new SaleResource(sale);
        resource.add(linkTo(SaleController.class)
                .slash(sale.getId()).withSelfRel());
        return resource;
    }
}
