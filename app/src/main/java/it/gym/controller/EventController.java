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

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<EventResource> findById(@PathVariable Long id) {
        AEvent res = facade.findById(id);

        return ResponseEntity.ok(new EventAssembler().toResource(res));
    }

    @PostMapping(path = "/{gymId}/holiday")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<EventResource> createHoliday(@PathVariable Long gymId,
                                                @RequestBody Event event) {
        logger.info("Create holiday");

        AEvent holiday = facade.createHoliday(gymId, event);

        return ResponseEntity.ok(new EventAssembler().toResource(holiday));

    }

    @DeleteMapping(path = "/holiday/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<EventResource> deleteHoliday(@PathVariable Long id) {
        logger.info("Deleting holiday");

        AEvent holiday = facade.delete(id);

        return ResponseEntity.ok(new EventAssembler().toResource(holiday));

    }

    @PatchMapping(path = "/{gymId}/holiday/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<EventResource> editHoliday(@PathVariable Long gymId,
                                              @PathVariable Long id,
                                              @RequestBody Event event) {
        logger.info("Edit holiday");

        AEvent holiday = facade.editEvent(gymId, id, event);

        return ResponseEntity.ok(new EventAssembler().toResource(holiday));

    }

    @PostMapping(path = "/{gymId}/holiday/isAvailable")
    public ResponseEntity<String> isHolidayAvailable(@PathVariable Long gymId,
                                              @RequestBody Event event) {
        logger.info("is holiday available");

        facade.isAvailable(gymId, event);

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @PostMapping(path = "/{gymId}/canEdit")
    public ResponseEntity<String> canEditEvent(@PathVariable Long gymId,
                                        @RequestBody Event event) {
        logger.info("canEdit event");

        facade.canEdit(gymId, event);

        return new ResponseEntity<>(HttpStatus.OK);

    }


    @PostMapping(path = "/{gymId}/timeOff")
    public ResponseEntity<EventResource> createTimeOff(@PathVariable Long gymId,
                                                @RequestParam Long trainerId,
                                                @RequestBody Event event) {
        logger.info("Create timeOff");

        AEvent timeOff = facade.createTimeOff(gymId, trainerId, event);

        return ResponseEntity.ok(new EventAssembler().toResource(timeOff));

    }

    @PostMapping(path = "/{gymId}/course")
    public ResponseEntity<EventResource> createCourseEvent(@PathVariable Long gymId,
                                                           @RequestBody Event event) {
        logger.debug("Creating CourseEvent");

        AEvent course = facade.createCourseEvent(gymId, event);

        logger.info("Returning CourseEvent");
        logger.info(course.toString());
        return ResponseEntity.ok(new EventAssembler().toResource(course));

    }

    @DeleteMapping(path = "/course/{id}")
    public ResponseEntity<EventResource> deleteCourseEvent(@PathVariable Long id) {
        logger.info("Deleting course event");

        AEvent timeOff = facade.deleteEvent(id);

        return ResponseEntity.ok(new EventAssembler().toResource(timeOff));

    }

    @DeleteMapping(path = "/timeOff/{id}")
    public ResponseEntity<EventResource> deleteTimeOff(@PathVariable Long id) {
        logger.info("Deleting timeOff");

        AEvent timeOff = facade.delete(id);

        return ResponseEntity.ok(new EventAssembler().toResource(timeOff));

    }

    @PatchMapping(path = "/{gymId}/timeOff/{id}")
    @PreAuthorize("hasAuthority('TRAINER')")
    public ResponseEntity<EventResource> editTimeOff(@PathVariable Long gymId,
                                              @PathVariable Long id,
                                              @RequestBody Event event) {
        logger.info("Edit TimeOff");

        AEvent timeOff = facade.editEvent(gymId, id, event);

        return ResponseEntity.ok(new EventAssembler().toResource(timeOff));

    }

    @PostMapping(path = "/{gymId}/timeOff/isAvailable")
    public ResponseEntity<String> isTimeOffAvailable(@PathVariable Long gymId,
                                              @RequestBody Event event) {
        logger.info("isAvailable timeOff");

        facade.isAvailable(gymId, event);

        return new ResponseEntity<>(HttpStatus.OK);

    }

    @GetMapping("/timeOff")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventResource>> findAllTimesOffByTrainerId(@RequestParam
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
    public ResponseEntity<List<EventResource>> findAllHolidaysByInterval(@RequestParam(value = "startTime")
                                                                  @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                          iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                                  @RequestParam(value = "endTime")
                                                                  @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                          iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findAllHolidays(startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }

    @GetMapping("/personal")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventResource>> findPersonalByInterval(@RequestParam Long customerId,
                                                               @RequestParam(value = "startTime")
                                                               @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                       iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                               @RequestParam(value = "endTime")
                                                               @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                       iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findPersonalByInterval(customerId, startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }

    @GetMapping("/training")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventResource>> findTrainingByInterval(@RequestParam(value = "startTime")
                                                               @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                       iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                               @RequestParam(value = "endTime")
                                                               @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                       iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findTrainingByInterval(startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }

    @GetMapping("/course")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventResource>> findAllCoursesByInterval(@RequestParam(value = "startTime")
                                                                 @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                         iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                                 @RequestParam(value = "endTime")
                                                                 @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                         iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findAllCourseEvents(startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EventResource>> findAllEventsByInterval(@RequestParam(value = "startTime")
                                                                @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                        iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                                @RequestParam(value = "endTime")
                                                                @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                                        iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<AEvent> res = facade.findAllEventsByInterval(startTime, endTime);

        return ResponseEntity.ok(new EventAssembler().toResources(res));
    }

    @GetMapping(path = "/{eventId}/complete")
    @ResponseBody
    @PreAuthorize("hasAuthority('TRAINER')")
    public ResponseEntity<EventResource> complete(@PathVariable Long eventId) {

        logger.info("completing session");
        AEvent event = facade.complete(eventId);

        return ResponseEntity.ok(new EventAssembler().toResource(event));
    }


}
