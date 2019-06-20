package it.gym.hateoas;

import it.gym.model.Sale;
import lombok.Data;
import org.springframework.hateoas.Resources;

@Data
public class SaleResource extends ResourceModel<Sale> {

    private Resources<SalesLineItemResource> salesLineItems;

    private CustomerResource customer;

    private GymResource gym;

    SaleResource(Sale model) {
        super(model);
    }

    public Resources<SalesLineItemResource> getSalesLineItems() {
        return salesLineItems;
    }

    void setSalesLineItems(Resources<SalesLineItemResource> salesLineItems) {
        this.salesLineItems = salesLineItems;
    }

    public void setCustomer(CustomerResource customer) {
        this.customer = customer;
    }

    public CustomerResource getCustomer() {
        return customer;
    }

    public GymResource getGym() {
        return gym;
    }

    public void setGym(GymResource gymResource) {
        this.gym = gymResource;
    }
}
