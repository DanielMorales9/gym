package it.gym.hateoas;

import it.gym.controller.SaleController;
import it.gym.model.Sale;
import it.gym.utility.Constants;
import org.springframework.hateoas.Resources;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import java.util.List;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class SaleAssembler  extends ResourceAssemblerSupport<Sale, SaleResource> {



    public SaleAssembler() {
        super(Sale.class, SaleResource.class);
    }

    @Override
    public SaleResource toResource(Sale sale) {
        SaleResource resource = new SaleResource(sale);
        resource.add(linkTo(SaleController.class).slash(Constants.SALE_BASE_PATH)
                .slash(sale.getId()).withSelfRel());

        resource.setCustomer(new CustomerAssembler().toResource(sale.getCustomer()));
        resource.setAdmin(new AdminAssembler().toResource(sale.getAdmin()));

        List<SalesLineItemResource> slines = new SalesLineItemAssembler()
                .toResources(sale.getSalesLineItems());
        resource.setSalesLineItems(new Resources<>(slines));
        return resource;
    }
}