package it.gym.hateoas;

import it.gym.model.Sale;
import org.springframework.hateoas.Resources;

public class SaleResource extends ResourceModel<Sale> {

    private Resources<SalesLineItemResource> salesLineItems;

    private CustomerResource customer;
    private AdminResource admin;


    public SaleResource(Sale model) {
        super(model);
    }

    public Resources<SalesLineItemResource> getSalesLineItems() {
        return salesLineItems;
    }

    public void setSalesLineItems(Resources<SalesLineItemResource> salesLineItems) {
        this.salesLineItems = salesLineItems;
    }

    public void setCustomer(CustomerResource customer) {
        this.customer = customer;
    }

    public CustomerResource getCustomer() {
        return customer;
    }

    public AdminResource getAdmin() {
        return admin;
    }

    public void setAdmin(AdminResource admin) {
        this.admin = admin;
    }
}
