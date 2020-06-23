package it.gym.controller;

import it.gym.facade.EventFacade;
import it.gym.hateoas.EventAssembler;
import it.gym.hateoas.EventResource;
import it.gym.hateoas.TrainingBundleResource;
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

import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.List;


@RestController
@RequestMapping("/events")
@PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
public class EventController {

    private static final Logger logger = LoggerFactory.getLogger(EventController.class);

    @Autowired private EventFacade facade;

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EventResource> findById(@PathVariable Long id) {
        AEvent res = facade.findById(id);

        return ResponseEntity.ok(new EventAssembler().toModel(res));
    }

    @GetMapping(path = "/{eventId}/complete")
    @ResponseBody
    @PreAuthorize("hasAuthority('TRAINER')")
    public ResponseEntity<EventResource> complete(@PathVariable Long eventId) {

        logger.info("completing session");
        AEvent event = facade.complete(eventId);

        return ResponseEntity.ok(new EventAssembler().toModel(event));
    }

    @PostMapping(path = "/{gymId}/holiday")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<EventResource> createHoliday(@PathVariable Long gymId,
                                                       @RequestBody Event event) {
        logger.info("Create holiday");

        AEvent holiday = facade.createHoliday(gymId, event);

        return ResponseEntity.ok(new EventAssembler().toModel(holiday));

    }

    @DeleteMapping(path = "/holiday/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<EventResource> deleteHoliday(@PathVariable Long id) {
        logger.info("Deleting holiday");

        AEvent holiday = facade.delete(id);

        return ResponseEntity.ok(new EventAssembler().toModel(holiday));

    }

    @PatchMapping(path = "/{gymId}/holiday/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<EventResource> editHoliday(@PathVariable Long gymId,
                                                     @PathVariable Long id,
                                                     @RequestBody Event event) {
        logger.info("Edit holiday");

        AEvent holiday = facade.editEvent(gymId, id, event);

        return ResponseEntity.ok(new EventAssembler().toModel(holiday));

    }

    @PostMapping(path = "/{gymId}/timeOff")
    public ResponseEntity<EventResource> createTimeOff(@PathVariable Long gymId,
                                                       @RequestParam Long trainerId,
                                                       @RequestBody Event event) {
        logger.info("Create timeOff");

        AEvent timeOff = facade.createTimeOff(gymId, trainerId, event);

        return ResponseEntity.ok(new EventAssembler().toModel(timeOff));

    }

    @PostMapping(path = "/{gymId}/course")
    public ResponseEntity<EventResource> createCourseEvent(@PathVariable Long gymId,
                                                           @RequestBody Event event) {
        logger.debug("Creating CourseEvent");

        AEvent course = facade.createCourseEvent(gymId, event);

        logger.info("Returning CourseEvent");
        logger.info(course.toString());
        return ResponseEntity.ok(new EventAssembler().toModel(course));

    }

    @DeleteMapping(path = "/course/{id}")
    public ResponseEntity<EventResource> deleteCourseEvent(@PathVariable Long id) {
        logger.info("Deleting course event");
        AEvent course = facade.deleteEvent(id);

        return ResponseEntity.ok(new EventAssembler().toModel(course));

    }

    @DeleteMapping(path = "/timeOff/{id}")
    public ResponseEntity<EventResource> deleteTimeOff(@PathVariable Long id) {
        logger.info("Deleting timeOff");

        AEvent timeOff = facade.delete(id);

        return ResponseEntity.ok(new EventAssembler().toModel(timeOff));

    }

    @PatchMapping(path = "/{gymId}/timeOff/{id}")
    @PreAuthorize("hasAuthority('TRAINER')")
    public ResponseEntity<EventResource> editTimeOff(@PathVariable Long gymId,
                                                     @PathVariable Long id,
                                                     @RequestBody Event event) {
        logger.info("Edit TimeOff");

        AEvent timeOff = facade.editEvent(gymId, id, event);

        return ResponseEntity.ok(new EventAssembler().toModel(timeOff));

    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public List<EventResource> findAllEventsByInterval(@RequestParam(value = "startTime")
                                                @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                        iso = DateTimeFormat.ISO.DATE_TIME)
                                                        Date startTime,
                                                @RequestParam(value = "endTime")
                                                @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                        iso = DateTimeFormat.ISO.DATE_TIME)
                                                        Date endTime,
                                                @RequestParam(value = "types")
                                                        HashSet<String> types,
                                                @RequestParam(required = false)
                                                        Long customerId,
                                                @RequestParam(required = false)
                                                        Long trainerId) {
        List<AEvent> events = facade.findAllEventsByInterval(startTime, endTime, types, customerId, trainerId);
        return new ArrayList<>(new EventAssembler().toCollectionModel(events).getContent());
    }

}
