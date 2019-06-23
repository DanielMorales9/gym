package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.EventService;
import it.gym.service.GymService;
import it.gym.service.ReservationService;
import it.gym.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Transactional
public class EventFacade {

    private static final String PRESENT_EVENTS_EX = "Ci sono già altri eventi";
    private static final String NOT_AUTHORIZED_EX = "Non è possibile chiudere la palestra con delle prenotazioni attive.";

    @Autowired private GymService gymService;
    @Autowired private ReservationService reservationService;
    @Autowired private UserService userService;
    @Autowired private EventService service;

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

        simpleCheckHoliday(gym, event);
        checkNoOtherEvents(event);

        Holiday holiday = new Holiday();
        holiday.setName(event.getName());
        holiday.setStartTime(event.getStartTime());
        holiday.setEndTime(event.getEndTime());
        holiday.setGym(gym);

        return this.service.save(holiday);
    }

    public AEvent delete(Long id) {
        AEvent event = this.service.findById(id);
        this.service.delete(event);
        return event;
    }

    public AEvent editHoliday(Long gymId, Long id, Event event) {
        Gym gym = gymService.findById(gymId);
        AEvent holiday = this.service.findById(id);

        simpleCheckHoliday(gym, event);
        checkNoOtherEventsExceptMe(holiday);

        holiday.setName(event.getName());
        holiday.setStartTime(event.getStartTime());
        holiday.setEndTime(event.getEndTime());

        return this.service.save(holiday);
    }

    public AEvent createTimeOff(Long gymId, Long trainerId, Event event) {
        Gym gym = gymService.findById(gymId);
        AUser trainer = userService.findById(trainerId);

        simpleCheckTimeOff(gym, event);
        checkNoOtherEvents(event);

        TimeOff timeOff = new TimeOff();
        timeOff.setName(event.getName());
        timeOff.setStartTime(event.getStartTime());
        timeOff.setEndTime(event.getEndTime());
        timeOff.setGym(gym);
        timeOff.setUser(trainer);

        return service.save(timeOff);
    }


    public AEvent editTimeOff(Long gymId, Long id, Event event) {
        Gym gym = gymService.findById(gymId);
        AEvent timeOff = this.service.findById(id);

        simpleCheckTimeOff(gym, event);
        checkNoOtherEventsExceptMe(timeOff);

        timeOff.setName(event.getName());
        timeOff.setStartTime(event.getStartTime());
        timeOff.setEndTime(event.getEndTime());

        return this.service.save(timeOff);
    }

    public void isTimeOffAvailable(Long gymId, Event event) {
        Gym gym = gymService.findById(gymId);

        simpleCheckTimeOff(gym, event);
        checkNoOtherEvents(event);
    }


    public void canEditTimeOff(Long gymId, Long id, Event event) {
        Gym gym = gymService.findById(gymId);
        AEvent timeOff = this.service.findById(id);

        simpleCheckTimeOff(gym, event);
        checkNoOtherEventsExceptMe(timeOff);
    }


    public void isHolidayAvailable(Long gymId, Event event) {
        Gym gym = gymService.findById(gymId);

        simpleCheckHoliday(gym, event);
        checkNoOtherEvents(event);
    }

    public void canEditHoliday(Long gymId, Long id, Event event) {
        Gym gym = gymService.findById(gymId);
        AEvent holiday = this.service.findById(id);

        simpleCheckHoliday(gym, event);
        checkNoOtherEventsExceptMe(holiday);
    }

    private void simpleCheckTimeOff(Gym gym, Event event) {
        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        gymService.simpleGymChecks(gym, startTime, endTime);

    }

    private void simpleCheckHoliday(Gym gym, Event event) {
        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        gymService.simpleGymChecks(gym, startTime, endTime);

        checkNoReservations(startTime, endTime);
    }

    private void checkNoOtherEventsExceptMe(AEvent event) {
        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();
        List<AEvent> events = this.service.findOverlappingEvents(startTime, endTime)
                .stream().filter(aEvent -> !event.equals(aEvent)).collect(Collectors.toList());
        if (!events.isEmpty())
            throw new BadRequestException(PRESENT_EVENTS_EX);
    }

    private void checkNoOtherEvents(Event event) {
        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();
        List<AEvent> events = this.service.findOverlappingEvents(startTime, endTime);
        if (!events.isEmpty())
            throw new BadRequestException(PRESENT_EVENTS_EX);
    }


    private void checkNoReservations(Date startTime, Date endTime) {
        Integer nReservations = this.reservationService.countByInterval(startTime, endTime);
        if (nReservations > 0)
            throw new BadRequestException(NOT_AUTHORIZED_EX);
    }
}
