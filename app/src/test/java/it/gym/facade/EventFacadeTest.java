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
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService specService;

    @MockBean
    @Qualifier("trainingSessionService")
    private TrainingSessionService sessionService;

    @MockBean
    private UserService userService;
    @MockBean
    private EventService service;
    @MockBean
    private EventRepository repository;
    @MockBean
    @Qualifier("mailService")
    private MailService mailService;


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
    public void whenCreateEvent() {
        Gym gym = createGym(1L);
        Date start = getNextMonday();
        Date end = addHours(start, 1);
        CourseTrainingBundleSpecification spec = createCourseBundleSpec();

        Event event = new Event();
        event.setStartTime(start);
        event.setEndTime(end);
        event.setExternal(false);
        event.setId(spec.getId());
        event.setName("course");

        Mockito.doReturn(gym).when(gymService).findById(1L);
        Mockito.doReturn(spec).when(specService).findById(spec.getId());
        Mockito.doAnswer(inv -> inv.getArgument(0)).when(service).save(any());

        CourseTrainingEvent evt = (CourseTrainingEvent) facade.createCourseEvent(1L, event);

        assertThat(evt).isNotNull();
        assertThat(evt.getName().equals("course")).isTrue();
        assertThat(evt.getStartTime()).isEqualTo(start);
        assertThat(evt.getEndTime()).isEqualTo(end);
        assertThat(evt.getReservations()).isNull();
        assertThat(evt.getSessions()).isNull();
        assertThat(evt.getType().equals(CourseTrainingEvent.TYPE))
        ;

    }

    @Test
    public void deleteCourseEvent() {
        Date start = getNextMonday();
        CourseEventFixture fixture = new CourseEventFixture().invoke(start);

        Reservation res = fixture.getReservation();
        CourseTrainingBundle bundle = fixture.getBundle();
        CourseTrainingEvent fixtureEvent = fixture.getEvent();

        Mockito.doReturn(fixtureEvent).when(service).findById(1L);

        CourseTrainingEvent event = (CourseTrainingEvent) facade.deleteEvent(1L);

        Mockito.verify(service).delete(event);
        Mockito.verify(bundleService).saveAll(Collections.singletonList(bundle));
//        Mockito.verify(reservationService).deleteAll(Collections.singletonList(res));
//        Mockito.verify(sessionService).deleteAll(Collections.singletonList(session));

//        assertThat(event.getReservations()).isNull();
//        assertThat(event.getSessions()).isNull();
        assertThat(event).isNotNull();
    }

    @Test(expected = MethodNotAllowedException.class)
    public void deleteCourseEventUnDeletableSession() {
        Date start = getNextMonday();
        CourseEventFixture fixture = new CourseEventFixture().invoke(start);

        CourseTrainingEvent fixtureEvent = fixture.getEvent();
        ATrainingSession session = fixture.getSession();
        session.setCompleted(true);

        Mockito.doReturn(fixtureEvent).when(service).findById(1L);
        facade.deleteEvent(1L);
    }

    @Test
    public void complete() {
        Date start = addDays(getNextMonday(), -30);
        CourseEventFixture fixture = new CourseEventFixture().invoke(start);
        fixture.getReservation().setConfirmed(true);

        CourseTrainingEvent event = fixture.getEvent();
        Mockito.doReturn(event).when(service).findById(1L);
        Mockito.doAnswer(inv -> inv.getArgument(0)).when(service).save(any());
        AEvent actual = facade.complete(1L);

        Mockito.verify(service).save(event);
        boolean allCompleted = event.getSessions()
                .values()
                .stream()
                .map(ATrainingSession::getCompleted)
                .reduce(Boolean::logicalAnd)
                .orElse(false);

        assertThat(allCompleted).isTrue();
        assertThat(actual).isEqualTo(event);
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
    public void deleteHoliday() {
        facade.delete(1L);
        Mockito.verify(service).findById(1L);
        Mockito.verify(service).delete(any());
    }

    private CourseTrainingBundleSpecification createCourseBundleSpec() {
        CourseTrainingBundleSpecification spec = new CourseTrainingBundleSpecification();
        spec.setMaxCustomers(11);
        spec.setDescription("Description");
        spec.setName("corso");
        spec.setId(1L);
        TimePurchaseOption o = new TimePurchaseOption();
        o.setPrice(100.);
        o.setNumber(30);
        spec.addOption(o);
        spec.setDisabled(false);
        spec.setCreatedAt(new Date());
        return spec;
    }

    private class CourseEventFixture {
        private Reservation res;
        private CourseTrainingEvent fixtureEvent;
        private CourseTrainingBundle bundle;
        private ATrainingSession session;

        public CourseTrainingBundle getBundle() {
            return bundle;
        }

        public CourseTrainingEvent getEvent() {
            return fixtureEvent;
        }

        public Reservation getReservation() {
            return res;
        }

        public ATrainingSession getSession() {
            return session;
        }

        public CourseEventFixture invoke(Date start) {
            Customer customer = createCustomer(1L,
                    "customer@customer.com",
                    "",
                    "customer",
                    "customer",
                    true,
                    null);
            CourseTrainingBundleSpecification spec = createCourseBundleSpec();
            TimePurchaseOption option = spec.getOptions().toArray(new TimePurchaseOption[]{})[0];

            bundle = createCourseBundle(1L, start, spec, option);

            fixtureEvent = createCourseEvent(1L, "CourseEvent", start, addHours(start, 1), spec);
            res = fixtureEvent.createReservation(customer);
            res.setId(1L);
            fixtureEvent.addReservation(res);
            session = bundle.createSession(fixtureEvent);
            bundle.addSession(session);
            fixtureEvent.addSession(res.getId(), session);
            return this;
        }
    }
}
