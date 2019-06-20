package it.gym.controller;

import it.gym.facade.TimeOffFacade;
import it.gym.hateoas.TimeOffAssembler;
import it.gym.hateoas.TimeOffResource;
import it.gym.model.TimeOff;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.Optional;


@RestController
@PropertySource("application.yml")
@RequestMapping("/timesOff")
@PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
public class TimeOffController {

    private static final Logger logger = LoggerFactory.getLogger(TimeOffController.class);

    @Autowired private TimeOffFacade facade;

    @GetMapping(path = "/isAvailable")
    @Transactional
    ResponseEntity<String> checkAvailableTime(@RequestParam("gymId") Long gymId,
                                              @RequestParam("startTime")
                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                      iso = DateTimeFormat.ISO.DATE_TIME)
                                                      Date startTime,
                                              @RequestParam("endTime")
                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                      iso = DateTimeFormat.ISO.DATE_TIME)
                                                      Date endTime,
                                              @RequestParam("type") String type) {
        logger.info("isAvailable");
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        facade.isAvailable(gymId, startTime, endTime, type);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/checkChange")
    @Transactional
    ResponseEntity<String> checkChange(@RequestParam("gymId") Long gymId,
                                       @RequestParam("startTime")
                                       @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                               iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                       @RequestParam("endTime")
                                       @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                               iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                       @RequestParam("type")
                                               String type) {
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        facade.checkChange(gymId, startTime, endTime, type);

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/book/{id}")
    @Transactional
    ResponseEntity<TimeOffResource> book(@PathVariable Long id,
                                         @RequestParam("gymId") Long gymId,
                                         @RequestParam("name") String name,
                                         @RequestParam("startTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
                                                 Date startTime,
                                         @RequestParam("endTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
                                                 Date endTime,
                                         @RequestParam("type") String type) {
        logger.info("Booking time off");
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        TimeOff timeOff = facade.book(gymId, id, name, startTime, endTime, type);

        return ResponseEntity.ok(new TimeOffAssembler().toResource(timeOff));

    }



    @GetMapping(path = "/change/{id}")
    @Transactional
    ResponseEntity<TimeOffResource> change(@PathVariable Long id,
                                           @RequestParam("name") String name,
                                           @RequestParam("gymId") Long gymId,
                                           @RequestParam("startTime")
                                           @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                   iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                           @RequestParam("endTime")
                                           @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                   iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                           @RequestParam("type")
                                                   String type) {
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        TimeOff time = facade.change(gymId, id, name, startTime, endTime, type);

        return ResponseEntity.ok(new TimeOffAssembler().toResource(time));

    }

    @DeleteMapping(path = "/{timesId}")
    @Transactional
    ResponseEntity<TimeOffResource> delete(@PathVariable Long timesId,
                                           @RequestParam(value = "type", defaultValue = "admin") String type,
                                           Principal principal) {
        String email = principal.getName();
        TimeOff timeOff = facade.delete(timesId, email, type);
        return ResponseEntity.ok(new TimeOffAssembler().toResource(timeOff));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<List<TimeOffResource>> findAllByInterval(@RequestParam(value = "id", required = false)
                                                              Long id,
                                                            @RequestParam(value = "type", required = false)
                                                              String type,
                                                            @RequestParam(value = "startTime")
                                                      @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                              iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                            @RequestParam(value = "endTime")
                                                      @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                              iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<TimeOff> res = facade.findByDateInterval(Optional.ofNullable(id),
                                                    Optional.ofNullable(type), startTime, endTime);

        return ResponseEntity.ok(new TimeOffAssembler().toResources(res));
    }


}
