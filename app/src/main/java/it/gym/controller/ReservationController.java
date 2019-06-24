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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;

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
    ResponseEntity<ReservationResource> createReservation(@PathVariable Long gymId,
                                                          @RequestParam("customerId") Long customerId,
                                                          @RequestParam("bundleId") Long bundleId,
                                                          @RequestBody Event event) {

        Reservation res = facade.createReservation(gymId, customerId, bundleId, event);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));

    }

    @DeleteMapping(path = "/{reservationId}")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<ReservationResource> delete(@PathVariable Long reservationId,
                                               @RequestParam(value = "type", defaultValue = "customer") String type,
                                               Principal principal) {

        String email = principal.getName();
        Reservation res = facade.deleteReservations(reservationId, email, type);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }


    @GetMapping
    ResponseEntity<List<ReservationResource>> getReservations(@RequestParam(value = "id", required = false) Long id,
                                                              @RequestParam(value = "startTime")
                                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                      Date startTime,
                                                              @RequestParam(value = "endTime")
                                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                      Date endTime) {
        List<Reservation> res;
        if (id == null) {
            res = facade.findByDateInterval(startTime, endTime);
        } else {
            res = facade.findByDateIntervalAndId(id, startTime, endTime);
        }

        return ResponseEntity.ok(new ReservationAssembler().toResources(res));
    }

    @GetMapping(path = "/{reservationId}/complete")
    @ResponseBody
    @PreAuthorize("hasAuthority('TRAINER')")
    ResponseEntity<ReservationResource> complete(@PathVariable Long reservationId) {

        logger.info("completing session");
        Reservation reservation = facade.complete(reservationId);

        return ResponseEntity.ok(new ReservationAssembler().toResource(reservation));
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
