package it.gym.hateoas;

import static org.springframework.hateoas.server.mvc.WebMvcLinkBuilder.linkTo;

import it.gym.model.Reservation;
import it.gym.repository.ReservationRepository;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;

public class ReservationAssembler
    extends RepresentationModelAssemblerSupport<
        Reservation, ReservationResource> {

  public ReservationAssembler() {
    super(Reservation.class, ReservationResource.class);
  }

  @Override
  public ReservationResource toModel(Reservation reservation) {
    ReservationResource resource = new ReservationResource(reservation);
    resource.add(
        linkTo(ReservationRepository.class)
            .slash("reservations")
            .slash(reservation.getId())
            .withSelfRel());
    return resource;
  }
}
