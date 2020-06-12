package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonUnwrapped;
import it.gym.model.Reservation;
import it.gym.model.Sale;
import org.springframework.hateoas.RepresentationModel;

public class ReservationResource extends RepresentationModel<ReservationResource> {

    @JsonUnwrapped
    Reservation model;

    ReservationResource(Reservation model) {
        this.model = model;
    }

}
