package it.gym.controller;

import it.gym.facade.ReservationFacade;
import it.gym.hateoas.ReservationAssembler;
import it.gym.hateoas.ReservationResource;
import it.gym.model.Reservation;
import it.gym.model.Role;
import it.gym.pojo.Event;
import java.security.Principal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RepositoryRestController
@RequestMapping("/reservations")
@PreAuthorize("isAuthenticated()")
public class ReservationController {

  private static final Logger logger =
      LoggerFactory.getLogger(ReservationController.class);

  @Autowired private ReservationFacade facade;

  @PostMapping(path = "/{gymId}")
  public ResponseEntity<ReservationResource> createReservationFromBundle(
      @PathVariable Long gymId,
      @RequestParam("customerId") Long customerId,
      @RequestParam("bundleId") Long bundleId,
      @RequestBody Event event,
      Principal principal) {

    Role r = facade.getRoleFromPrincipal(principal);
    Reservation res =
        facade.createReservation(
            gymId, customerId, bundleId, event, r.getName());

    return ResponseEntity.ok(new ReservationAssembler().toModel(res));
  }

  @GetMapping(path = "/{gymId}")
  public ResponseEntity<ReservationResource> createReservationFromEvent(
      @PathVariable Long gymId,
      @RequestParam("customerId") Long customerId,
      @RequestParam("eventId") Long eventId,
      @RequestParam("bundleId") Long bundleId,
      Principal principal) {

    Role r = facade.getRoleFromPrincipal(principal);
    Reservation res =
        facade.createReservationWithExistingEvent(
            gymId, customerId, eventId, bundleId, r.getName());

    return ResponseEntity.ok(new ReservationAssembler().toModel(res));
  }

  @DeleteMapping(path = "/{reservationId}")
  public ResponseEntity<ReservationResource> delete(
      @PathVariable Long reservationId,
      @RequestParam Long eventId,
      @RequestParam Long gymId,
      Principal principal) {

    Role r = facade.getRoleFromPrincipal(principal);
    String email = principal.getName();
    Reservation res =
        facade.deleteReservation(
            eventId, reservationId, gymId, email, r.getName());

    return ResponseEntity.ok(new ReservationAssembler().toModel(res));
  }

  @GetMapping(path = "/{reservationId}/confirm")
  @ResponseBody
  @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
  public ResponseEntity<ReservationResource> confirm(
      @PathVariable Long reservationId) {

    logger.info("confirming session");
    Reservation res = facade.confirm(reservationId);

    return ResponseEntity.ok(new ReservationAssembler().toModel(res));
  }
}
