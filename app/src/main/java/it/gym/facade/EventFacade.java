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
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import static it.gym.utility.CheckEvents.hasHolidays;

@Component
@Transactional
public class EventFacade {

    private static final Logger logger = LoggerFactory.getLogger(EventFacade.class);

    private static final String PRESENT_EVENTS_EX = "Ci sono già altri eventi";

    @Autowired private EventService service;

    @Qualifier("trainingSessionService")
    @Autowired private TrainingSessionService sessionService;

    @Autowired private GymService gymService;

    @Autowired private UserService userService;

    @Qualifier("trainingBundleService")
    @Autowired private TrainingBundleService bundleService;

    @Autowired private ReservationService reservationService;

    @Qualifier("trainingBundleSpecificationService")
    @Autowired private TrainingBundleSpecificationService specService;

    public List<AEvent> findAllEventsByInterval(Date startTime,
                                                Date endTime,
                                                Collection<String> types,
                                                Long customerId,
                                                Long trainerId) {
        Stream<AEvent> s = service.findAllEvents(startTime, endTime)
                .stream()
                .filter(c -> types.contains(c.getType()));

        if (customerId != null) {
            s = s.filter(c -> {
                if (PersonalTrainingEvent.TYPE.equals(c.getType())) {
                    return ((PersonalTrainingEvent) c).getReservations().get(0).getUser()
                            .getId().equals(customerId);
                }
                else {
                    return true;
                }
            });
        }

        if (trainerId != null) {
            s = s.filter(c -> {
                if (TimeOff.TYPE.equals(c.getType())) {
                    return ((TimeOff) c).getUser()
                            .getId().equals(trainerId);
                }
                else {
                    return true;
                }
            });
        }

        return s.collect(Collectors.toList());
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
        event.setExternal(evt.getExternal());
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
        List<Reservation> reservations = event.getReservations();

        List<ATrainingSession> sessions = reservations.stream()
                .map(Reservation::getSession).collect(Collectors.toList());

        logger.info("Deleting sessions");
        this.sessionService.deleteAll(sessions);

        logger.info("Deleting reservations");
        this.reservationService.deleteAll(reservations);

        logger.info("Deleting training event");
        this.service.delete(event);

        logger.info("Saving bundle event");
        this.bundleService.saveAll(bundles);

        return event;
    }

    public AEvent complete(Long eventId) {
        ATrainingEvent event = (ATrainingEvent) service.findById(eventId);
        event.complete();
        List<ATrainingSession> sessions = event.getReservations().stream().map(Reservation::getSession).collect(Collectors.toList());
         sessionService.saveAll(sessions);
        return service.save(event);
    }

    public AEvent findById(Long id) {
        return this.service.findById(id);
    }
}
