package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.repository.EventRepository;
import it.gym.service.*;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Bean;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;

import static it.gym.utility.Calendar.getNextMonday;
import static it.gym.utility.Fixture.*;
import static org.apache.commons.lang3.time.DateUtils.addDays;
import static org.apache.commons.lang3.time.DateUtils.addHours;
import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;

@RunWith(SpringRunner.class)
public class EventFacadeTest {

    @MockBean
    private GymService gymService;

    @MockBean
    private ReservationService reservationService;

    @MockBean
    @Qualifier("trainingBundleService")
    private TrainingBundleService bundleService;

    @MockBean
    @Qualifier("trainingSessionService")
    private TrainingSessionService sessionService;

    @MockBean
    private UserService userService;
    @MockBean
    private EventService service;
    @MockBean
    private EventRepository repository;

    @TestConfiguration
    static class EventFacadeTestContextConfiguration {

        @Bean
        public EventFacade facade() {
            return new EventFacade();
        }
    }


    @Autowired
    EventFacade facade;

    @Test
    public void whenCreateHoliday() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> {
            AEvent argument = invocationOnMock.getArgument(0);
            argument.setId(1L);
            return argument;
        }).when(service).save(any());
        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setName("holiday");
        AEvent evt = facade.createHoliday(1L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createHoliday(1L, "holiday", start, end));
    }

    @Test
    public void whenCreateCourseEvent() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setId(1L);
        event.setName("course");

        CourseTrainingBundleSpecification spec = createCourseBundleSpec();
        CourseTrainingBundle bundle = createCourseBundle(1L, start, spec, spec.getOptions().get(0));
        Mockito.doReturn(bundle).when(bundleService).findById(1L);
        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doAnswer(inv -> inv.getArgument(0)).when(service).save(any());
        Mockito.doAnswer(inv -> inv.getArgument(0)).when(sessionService).save(any());

        AEvent evt = facade.createCourseEvent(1L, event);

        assertThat(evt).isNotNull();
        assertThat(evt.getName()).isEqualTo("course");
        assertThat(evt.getStartTime()).isEqualTo(start);
        assertThat(evt.getEndTime()).isEqualTo(end);
        assertThat(evt.getSession()).isNotNull();
        assertThat(evt.getType()).isEqualTo(CourseEvent.TYPE);
        assertThat(evt.getSession().getTrainingBundle().getSessions().size()).isEqualTo(1);

    }

    @Test
    public void deleteCourseEvent() {
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        // all what you need to create a course event
        CourseTrainingBundleSpecification spec = createCourseBundleSpec();
        CourseTrainingBundle bundle = createCourseBundle(1L, start, spec, spec.getOptions().get(0));
        ATrainingSession session = bundle.createSession(start, end);
        bundle.addSession(session);

        Mockito.doReturn(createCourseEvent(1L, "CourseEvent", session)).when(service).findById(1L);
        CourseEvent event = (CourseEvent) facade.deleteCourseEvent(1L);
        Mockito.verify(sessionService).delete(session);
        Mockito.verify(service).delete(event);
        assertThat(bundle.getSessions().size()).isEqualTo(0);
        assertThat(event).isNotNull();
    }

    @Test(expected = MethodNotAllowedException.class)
    public void deleteCourseEventUndeletableSession() {
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        Date endCourse = addDays(start, 30);

        // all what you need to create a course event
        CourseTrainingBundleSpecification spec = createCourseBundleSpec();
        CourseTrainingBundle bundle = createCourseBundle(1L, start, spec, spec.getOptions().get(0));
        ATrainingSession session = bundle.createSession(start, end);
        bundle.addSession(session);
        session.setCompleted(true);

        Mockito.doReturn(createCourseEvent(1L, "CourseEvent", session)).when(service).findById(1L);
        facade.deleteCourseEvent(1L);
    }

    @Test
    public void complete() {
        Date start = addDays(getNextMonday(), -30);
        Date end = addHours(start, 1);
        Date endCourse = addDays(start, 30);

        // all what you need to create a course event
        CourseTrainingBundleSpecification spec = createCourseBundleSpec();
        CourseTrainingBundle bundle = createCourseBundle(1L, start, spec, spec.getOptions().get(0));
        ATrainingSession session = bundle.createSession(start, end);
        bundle.addSession(session);

        CourseEvent courseEvent = createCourseEvent(1L, "CourseEvent", session);
        Mockito.doReturn(courseEvent).when(service).findById(1L);
        Mockito.doAnswer(inv -> inv.getArgument(0)).when(service).save(any());
        AEvent actual = facade.complete(1L);

        Mockito.verify(service).save(courseEvent);
        assertThat(actual.getSession().getCompleted()).isTrue();
        assertThat(actual).isEqualTo(courseEvent);
    }

    private CourseTrainingBundleSpecification createCourseBundleSpec() {
        CourseTrainingBundleSpecification spec = new CourseTrainingBundleSpecification();
        spec.setMaxCustomers(11);
        spec.setDescription("Description");
        spec.setName("corso");
        spec.setId(1L);
        TimeOption o = new TimeOption();
        o.setPrice(100.);
        o.setNumber(30);
        spec.setOptions(Collections.singletonList(o));
        spec.setDisabled(false);
        spec.setCreatedAt(new Date());
        return spec;
    }

    @Test
    public void editHoliday() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doReturn(createHoliday(1L, "'holiday", start, end)).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        event.setStartTime(start);
        Date newEnd = addHours(end, 1);
        event.setEndTime(newEnd);
        event.setName("holiday");
        AEvent evt = facade.editEvent(1L, 1L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createHoliday(1L, "holiday", start, newEnd));
    }

    @Test
    public void canEditHoliday() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doReturn(createHoliday(1L, "holiday", start, end)).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        event.setStartTime(start);
        Date newEnd = addHours(end, 1);
        event.setEndTime(newEnd);
        event.setName("holiday");
        facade.canEdit(1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test
    public void isHolidayAvailable() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doReturn(createHoliday(1L, "'holiday", start, end)).when(service).findById(1L);
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        event.setStartTime(start);
        Date newEnd = addHours(end, 1);
        event.setEndTime(newEnd);
        event.setName("holiday");
        facade.isAvailable(1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test
    public void whenCreateTimeOff() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer(2L);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(trainer).when(userService).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> {
            AEvent var = invocationOnMock.getArgument(0);
            var.setId(1L);
            return var;
        }).when(service).save(any());
        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setName("timeOff");
        AEvent evt = facade.createTimeOff(1L, 2L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createTimeOff(1L, "timeOff", start, end, trainer));
    }

    @Test
    public void editTimeOff() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer(2L);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(createTimeOff(1L, "timeOff", start, end, trainer)).when(service).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");
        AEvent evt = facade.editEvent(1L, 2L, event);
        Mockito.verify(gymService).findById(1L);
        assertThat(evt).isEqualTo(createTimeOff(1L, "timeOff", start, newEnd, trainer));
    }

    @Test
    public void canEditTimeOff() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer(2L);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(createTimeOff(1L, "timeOff", start, end, trainer)).when(service).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");
        facade.canEdit(1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test(expected = BadRequestException.class)
    public void canEditTimeOff_ReturnsBadRequest() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer(2L);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        AEvent timeOff = createTimeOff(1L, "timeOff", start, end, trainer);
        Mockito.doReturn(timeOff).when(service).findById(1L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());
        ArrayList<AEvent> list = new ArrayList<>();
        list.add(timeOff);
        list.add(createHoliday(1L, "name", start, end));
        Mockito.doReturn(list).when(service).findOverlappingEvents(any(), any());
        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");
        facade.canEdit(1L, event);
    }

    @Test
    public void isTimeOffAvailable() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer(2L);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(createTimeOff(1L, "timeOff", start, end, trainer)).when(service).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");
        
        facade.isAvailable(1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test(expected = BadRequestException.class)
    public void whenIsTimeOffAvailable_ReturnException() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        AUser trainer = createTrainer(2L);

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(createTimeOff(1L, "timeOff", start, end, trainer)).when(service).findById(2L);
        Mockito.doReturn(true).when(gymService).isWithinWorkingHours(any(), any(), any());
        Mockito.doReturn(Collections.singletonList(createHoliday(2L, "test", start, end)))
                .when(service).findOverlappingEvents(any(), any());
        Mockito.doAnswer(invocationOnMock -> invocationOnMock.getArgument(0)).when(service).save(any());

        Event event = new Event();
        Date newEnd = addHours(end, 1);
        event.setStartTime(start);
        event.setEndTime(newEnd);
        event.setName("timeOff");

        facade.isAvailable(1L, event);
        Mockito.verify(gymService).findById(1L);
    }

    @Test
    public void deleteHoliday() {
        facade.delete(1L);
        Mockito.verify(service).findById(1L);
        Mockito.verify(service).delete(any());
    }

}
