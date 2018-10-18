package it.goodfellas.hateoas;

import it.goodfellas.model.Reservation;

public class ReservationResource extends ResourceModel<Reservation> {

    private CustomerResource customer;

    ReservationResource(Reservation model) {
        super(model);
    }

    public CustomerResource getCustomer() {
        return customer;
    }

    public void setCustomer(CustomerResource customer) {
        this.customer = customer;
    }
}
