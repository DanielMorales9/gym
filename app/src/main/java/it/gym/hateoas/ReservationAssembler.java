package it.gym.hateoas;

import it.gym.model.Reservation;
import it.gym.repository.ReservationRepository;
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
        resource.add(linkTo(ReservationRepository.class).slash("reservations")
                .slash(reservation.getId()).withSelfRel());
        return resource;
    }
}
