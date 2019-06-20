package it.gym.controller;

import it.gym.facade.ReservationFacade;
import it.gym.hateoas.ReservationAssembler;
import it.gym.hateoas.ReservationResource;
import it.gym.hateoas.TrainingSessionAssembler;
import it.gym.hateoas.TrainingSessionResource;
import it.gym.model.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;

@RepositoryRestController
@RequestMapping("/reservations")
@PreAuthorize("isAuthenticated()")
public class ReservationController {

    private static final Logger logger = LoggerFactory.getLogger(ReservationController.class);

    @Autowired private ReservationFacade facade;

    @GetMapping(path = "/isAvailable")
    @Transactional
    @PreAuthorize("hasAuthority('CUSTOMER')")
    ResponseEntity<String> checkAvailableDay(@RequestParam("gymId") Long gymId,
                                             @RequestParam("customerId") Long customerId,
                                             @RequestParam("startTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm") Date startTime,
                                             @RequestParam("endTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm") Date endTime) {

        facade.isAvailable(gymId, customerId, startTime, endTime);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/book/{customerId}")
    @Transactional
    @PreAuthorize("hasAuthority('CUSTOMER')")
    ResponseEntity<ReservationResource> book(@PathVariable Long customerId,
                                             @RequestParam("gymId") Long gymId,
                                             @RequestParam("startTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm") Date startTime,
                                             @RequestParam("endTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm") Date endTime) {

        Reservation res = facade.book(gymId, customerId, startTime, endTime);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));

    }

    @DeleteMapping(path = "/{reservationId}")
    @Transactional
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<ReservationResource> cancel(@PathVariable Long reservationId,
                                               @RequestParam(value = "type", defaultValue = "customer") String type,
                                               Principal principal) {

        String email = principal.getName();
        Reservation res = facade.cancel(reservationId, email, type);

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

        Optional<Long> opt = Optional.ofNullable(id);
        List<Reservation> res = facade.findByDateInterval(opt, startTime, endTime);

        return ResponseEntity.ok(new ReservationAssembler().toResources(res));
    }

    @GetMapping(path="/complete/{sessionId}")
    @ResponseBody
    @PreAuthorize("hasAuthority('TRAINER')")
    ResponseEntity<TrainingSessionResource> complete(@PathVariable(value = "sessionId") Long sessionId) {

        logger.info("completing session");
        ATrainingSession session = facade.complete(sessionId);

        return ResponseEntity.ok(new TrainingSessionAssembler().toResource(session));
    }

    @GetMapping(path="/confirm/{reservationId}")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
    ResponseEntity<ReservationResource> confirm(@PathVariable(value = "reservationId") Long reservationId) {

        logger.info("confirming session");
        Reservation res = facade.confirm(reservationId);

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }

}
