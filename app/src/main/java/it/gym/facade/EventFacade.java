package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

import static it.gym.utility.CheckEvents.hasHolidays;

@Component
@Transactional
public class EventFacade {

    private static final Logger logger = LoggerFactory.getLogger(EventFacade.class);

    private static final String PRESENT_EVENTS_EX = "Ci sono già altri eventi";


    @Autowired private EventService service;
    @Autowired private GymService gymService;
    @Autowired private UserService userService;
    @Qualifier("trainingBundleService")
    @Autowired private TrainingBundleService bundleService;

    @Qualifier("trainingBundleSpecificationService")
    @Autowired private TrainingBundleSpecificationService specService;

    public List<AEvent> findAllEventsByInterval(Date startTime, Date endTime) {
        return service.findAllEvents(startTime, endTime);
    }

    public List<AEvent> findAllTimesOffByTrainerId(Long trainerId, Date startTime, Date endTime) {
        return this.service.findAllTimesOffById(trainerId, startTime, endTime);
    }

    public List<AEvent> findAllHolidays(Date startTime, Date endTime) {
        return this.service.findAllHolidays(startTime, endTime);
    }

    public AEvent createHoliday(Long gymId, Event event) {
        Gym gym = gymService.findById(gymId);

        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        gymService.checkGymHours(gym, startTime, endTime);
        checkNoOtherEvents(event);

        Holiday holiday = new Holiday();
        holiday.setName(event.getName());
        holiday.setStartTime(event.getStartTime());
        holiday.setEndTime(event.getEndTime());

        return this.service.save(holiday);
    }

    public AEvent delete(Long id) {
        AEvent event = this.service.findById(id);
        this.service.delete(event);
        return event;
    }

    public AEvent editEvent(Long gymId, Long id, Event event) {
        Gym gym = gymService.findById(gymId);
        AEvent evt = this.service.findById(id);

        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        gymService.checkGymHours(gym, startTime, endTime);
        checkNoOtherEventsExceptMe(event);

        evt.setName(event.getName());
        evt.setStartTime(event.getStartTime());
        evt.setEndTime(event.getEndTime());

        return this.service.save(evt);
    }

    public AEvent createTimeOff(Long gymId, Long trainerId, Event event) {
        Gym gym = gymService.findById(gymId);
        AUser trainer = userService.findById(trainerId);

        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        gymService.checkGymHours(gym, startTime, endTime);
        checkNoOtherEvents(event);

        TimeOff timeOff = new TimeOff();
        timeOff.setName(event.getName());
        timeOff.setStartTime(event.getStartTime());
        timeOff.setEndTime(event.getEndTime());
        timeOff.setUser(trainer);

        return service.save(timeOff);
    }

    public void canEdit(Long gymId, Event event) {
        Gym gym = gymService.findById(gymId);

        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        gymService.checkGymHours(gym, startTime, endTime);
        checkNoOtherEventsExceptMe(event);
    }

    public void isAvailable(Long gymId, Event event) {
        Gym gym = gymService.findById(gymId);

        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        gymService.checkGymHours(gym, startTime, endTime);
        checkNoOtherEvents(event);
    }

    private void checkNoOtherEventsExceptMe(Event event) {
        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();
        List<AEvent> events = this.service.findOverlappingEvents(startTime, endTime);
        logger.info(events.toString());
        if (events.size() > 1)
            throw new BadRequestException(PRESENT_EVENTS_EX);
    }

    private void checkNoOtherEvents(Event event) {
        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();
        List<AEvent> events = this.service.findOverlappingEvents(startTime, endTime);
        logger.debug(events.toString());
        if (!events.isEmpty())
            throw new BadRequestException(PRESENT_EVENTS_EX);
    }

    private void checkNoHolidays(Date startTime, Date endTime) {
        List<AEvent> events = this.service.findOverlappingEvents(startTime, endTime);
        hasHolidays(events);
    }

    public AEvent createCourseEvent(Long gymId, Event evt) {
        logger.debug("Looking up gymId");
        Gym gym = gymService.findById(gymId);
        logger.debug("Looking up specId");
        CourseTrainingBundleSpecification spec = (CourseTrainingBundleSpecification)
                this.specService.findById(evt.getId());

        Date startTime = evt.getStartTime();
        Date endTime = evt.getEndTime();

        logger.debug("Checking gym hours");
        gymService.checkGymHours(gym, startTime, endTime);

        logger.debug("Checking no holidays");
        checkNoHolidays(startTime, endTime);

        logger.debug("Creating CourseEvent");
        CourseTrainingEvent event = new CourseTrainingEvent();
        event.setStartTime(startTime);
        event.setEndTime(endTime);
        event.setName(evt.getName());
        event.setSpecification(spec);

        logger.debug("Saving CourseEvent");
        return service.save(event);
    }

    public AEvent deleteEvent(Long id) {
        ATrainingEvent event = (ATrainingEvent) service.findById(id);

        if (!event.isSessionDeletable())
            throw new MethodNotAllowedException("Il corso non è cancellabile");

        logger.info("Deleting sessions from bundles");
        List<ATrainingBundle> bundles = event.deleteSessionsFromBundles();

        logger.info("Deleting training event");
        this.service.delete(event);

        logger.info("Saving bundle event");
        this.bundleService.saveAll(bundles);

        return event;
    }

    public List<AEvent> findAllCourseEvents(Date startTime, Date endTime) {
        return service.findAllCourseEvents(startTime, endTime);
    }

    public AEvent complete(Long eventId) {
        ATrainingEvent event = (ATrainingEvent) service.findById(eventId);
        event.complete();
        return service.save(event);
    }

    public List<AEvent> findPersonalByInterval(Long customerId, Date startTime, Date endTime) {
        return service.findPersonalByInterval(customerId, startTime, endTime);
    }

    public List<AEvent> findTrainingByInterval(Date startTime, Date endTime) {
        return service.findTrainingByInterval(startTime, endTime);
    }

    public AEvent findById(Long id) {
        return this.service.findById(id);
    }
}
