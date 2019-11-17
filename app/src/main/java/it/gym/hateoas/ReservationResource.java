package it.gym.hateoas;

import it.gym.model.Reservation;

public class ReservationResource extends ResourceModel<Reservation> {

    private CustomerResource user;

    ReservationResource(Reservation model) {
        super(model);
    }

    public CustomerResource getUser() {
        return user;
    }

    public void setUser(CustomerResource user) {
        this.user = user;
    }
}
