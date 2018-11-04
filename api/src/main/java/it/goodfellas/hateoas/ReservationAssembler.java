package it.goodfellas.hateoas;

import it.goodfellas.model.Reservation;
import it.goodfellas.repository.ReservationRepository;
import org.springframework.hateoas.mvc.ResourceAssemblerSupport;

import static org.springframework.hateoas.mvc.ControllerLinkBuilder.linkTo;

public class ReservationAssembler extends ResourceAssemblerSupport<Reservation,
        ReservationResource> {

    public ReservationAssembler() {
        super(Reservation.class, ReservationResource.class);
    }

    @Override
    public ReservationResource toResource(Reservation reservation) {
        ReservationResource resource = new ReservationResource(reservation);
        resource.setCustomer(new CustomerAssembler().toResource(reservation.getUser()));
        resource.add(linkTo(ReservationRepository.class).slash("reservations")
                .slash(reservation.getId()).withSelfRel());
        return resource;
    }
}