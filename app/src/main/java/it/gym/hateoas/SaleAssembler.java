package it.gym.hateoas;

import it.gym.controller.SaleController;
import it.gym.model.Sale;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

public class SaleAssembler extends RepresentationModelAssemblerSupport<Sale, SaleResource> {

    public SaleAssembler() {
        super(Sale.class, SaleResource.class);
    }

    @Override
    public SaleResource toModel(Sale sale) {
        SaleResource resource = new SaleResource(sale);
        resource.add(linkTo(SaleController.class)
                .slash(sale.getId()).withSelfRel());
        return resource;
    }
}
