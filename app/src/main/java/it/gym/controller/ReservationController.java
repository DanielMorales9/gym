package it.gym.controller;

import it.gym.facade.ReservationFacade;
import it.gym.hateoas.ReservationAssembler;
import it.gym.hateoas.ReservationResource;
import it.gym.model.Reservation;
import it.gym.pojo.Event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RepositoryRestController
@RequestMapping("/reservations")
@PreAuthorize("isAuthenticated()")
public class ReservationController {

    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    @Autowired private ReservationFacade facade;

    @PostMapping(path = "/{gymId}/isAvailable")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    ResponseEntity<String> isAvailable(@PathVariable Long gymId,
                                       @RequestParam("customerId") Long customerId,
                                       @RequestParam("bundleId") Long bundleId,
                                       @RequestBody Event event) {

        facade.isAvailable(gymId, customerId, bundleId, event);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @PostMapping(path = "/{gymId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    ResponseEntity<ReservationResource> createReservationFromBundle(@PathVariable Long gymId,
                                                                    @RequestParam("customerId") Long customerId,
                                                                    @RequestParam("bundleId") Long bundleId,
                                                                    @RequestBody Event event) {

        Reservation res = facade.createReservationFromBundle(gymId, customerId, bundleId, event);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));

    }

    @GetMapping(path = "/{gymId}")
    @PreAuthorize("hasAuthority('CUSTOMER')")
    ResponseEntity<ReservationResource> createReservationFromEvent(@PathVariable Long gymId,
                                                                   @RequestParam("customerId") Long customerId,
                                                                   @RequestParam("eventId") Long eventId) {

        Reservation res = facade.createReservationFromEvent(gymId, customerId, eventId);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));

    }

    @DeleteMapping(path = "/{reservationId}")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<ReservationResource> delete(@PathVariable Long reservationId,
                                               @RequestParam Long eventId,
                                               @RequestParam(value = "type", defaultValue = "customer") String type) {

        Reservation res = facade.deleteReservations(eventId, reservationId, type);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }


    @GetMapping(path = "/{reservationId}/confirm")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
    ResponseEntity<ReservationResource> confirm(@PathVariable Long reservationId) {

        logger.info("confirming session");
        Reservation res = facade.confirm(reservationId);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }

}
