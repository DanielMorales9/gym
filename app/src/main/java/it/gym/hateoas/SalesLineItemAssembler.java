package it.gym.hateoas;

import it.gym.model.SalesLineItem;
import it.gym.utility.Constants;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class SalesLineItemAssembler extends ResourceAssemblerSupport<SalesLineItem, SalesLineItemResource> {
    public SalesLineItemAssembler() {
        super(SalesLineItem.class, SalesLineItemResource.class);
    }

    @Override
    public SalesLineItemResource toResource(SalesLineItem salesLineItem) {
        SalesLineItemResource sli =  new SalesLineItemResource(salesLineItem);
        sli.add(linkTo(SalesLineItem.class).slash(Constants.SALES_LINE_ITEM_BASE_PATH)
                .slash(salesLineItem.getId()).withSelfRel());

        sli.setBundleSpecification(new TrainingBundleSpecificationAssembler()
                .toResource(salesLineItem.getBundleSpecification()));
        return sli;
    }
}
