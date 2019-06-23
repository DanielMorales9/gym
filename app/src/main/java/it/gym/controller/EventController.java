package it.gym.controller;

import it.gym.facade.EventFacade;
import it.gym.hateoas.EventAssembler;
import it.gym.hateoas.EventResource;
import it.gym.model.AEvent;
import it.gym.pojo.Event;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;


@RestController
@RequestMapping("/events")
@PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
public class EventController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    @Autowired private EventFacade facade;

    @PostMapping(path = "/{gymId}/holiday")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<EventResource> createHoliday(@PathVariable Long gymId,
                                                @RequestBody Event event) {
        logger.info("Create holiday");

        AEvent holiday = facade.createHoliday(gymId, event);

        return ResponseEntity.ok(new EventAssembler().toResource(holiday));

    }

    @DeleteMapping(path = "/holiday/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<EventResource> deleteHoliday(@PathVariable Long id) {
        logger.info("Deleting holiday");

        AEvent holiday = facade.delete(id);

        return ResponseEntity.ok(new EventAssembler().toResource(holiday));

    }

    @PatchMapping(path = "/{gymId}/holiday/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<EventResource> editHoliday(@PathVariable Long gymId,
                                              @PathVariable Long id,
                                              @RequestBody Event event) {
        logger.info("Edit holiday");

        AEvent holiday = facade.editHoliday(gymId, id, event);

        return ResponseEntity.ok(new EventAssembler().toResource(holiday));

    }

    @PostMapping(path = "/{gymId}/holiday/isAvailable")
    ResponseEntity<String> isHolidayAvailable(@PathVariable Long gymId,
                                              @RequestBody Event event) {
        logger.info("Create holiday");

        facade.isHolidayAvailable(gymId, event);

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PostMapping(path = "/{gymId}/holiday/{id}/canEdit")
    ResponseEntity<String> canEditHoliday(@PathVariable Long gymId,
                                          @PathVariable Long id,
                                          @RequestBody Event event) {
        logger.info("canEdit holiday");

        facade.canEditHoliday(gymId, id, event);

        return new ResponseEntity<>(HttpStatus.OK);

    }


    @PostMapping(path = "/{gymId}/timeOff")
    ResponseEntity<EventResource> createTimeOff(@PathVariable Long gymId,
                                                @RequestParam Long trainerId,
                                                @RequestBody Event event) {
        logger.info("Create timeOff");

        AEvent timeOff = facade.createTimeOff(gymId, trainerId, event);

        return ResponseEntity.ok(new EventAssembler().toResource(timeOff));

    }

    @DeleteMapping(path = "/timeOff/{id}")
    ResponseEntity<EventResource> deleteTimeOff(@PathVariable Long id) {
        logger.info("Deleting timeOff");

        AEvent timeOff = facade.delete(id);

        return ResponseEntity.ok(new EventAssembler().toResource(timeOff));

    }

    @PatchMapping(path = "/{gymId}/timeOff/{id}")
    @PreAuthorize("hasAuthority('TRAINER')")
    ResponseEntity<EventResource> editTimeOff(@PathVariable Long gymId,
                                              @PathVariable Long id,
                                              @RequestBody Event event) {
        logger.info("Edit TimeOff");

        AEvent timeOff = facade.editTimeOff(gymId, id, event);

        return ResponseEntity.ok(new EventAssembler().toResource(timeOff));

    }

    @PostMapping(path = "/{gymId}/timeOff/isAvailable")
    ResponseEntity<String> isTimeOffAvailable(@PathVariable Long gymId,
                                              @RequestBody Event event) {
        logger.info("isAvailable timeOff");

        facade.isTimeOffAvailable(gymId, event);

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PostMapping(path = "/{gymId}/timeOff/{id}/canEdit")
    ResponseEntity<String> canEditTimeOff(@PathVariable Long gymId,
                                          @PathVariable Long id,
                                          @RequestBody Event event) {
        logger.info("canEdit timeOff");

        facade.canEditTimeOff(gymId, id, event);

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @GetMapping("/timeOff")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<List<EventResource>> findAllTimesOffByTrainerId(@RequestParam
                                                                           Long trainerId,
                                                                   @RequestParam(value = "startTime")
                                                                   @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                           iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                                   @RequestParam(value = "endTime")
                                                                   @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                           iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findAllTimesOffByTrainerId(trainerId, startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }

    @GetMapping("/holiday")
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<List<EventResource>> findAllHolidaysByInterval(@RequestParam(value = "startTime")
                                                                   @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                           iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                                  @RequestParam(value = "endTime")
                                                                   @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                           iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findAllHolidays(startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<List<EventResource>> findAllEventsByInterval(@RequestParam(value = "startTime")
                                                                @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                        iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                                @RequestParam(value = "endTime")
                                                                @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                        iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findAllEventsByInterval(startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }


}
