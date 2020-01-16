package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.*;
import it.gym.utility.CheckEvents;
import jdk.nashorn.internal.runtime.regexp.joni.exception.InternalException;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static it.gym.utility.CheckEvents.checkPast;

@Component
@Transactional
public class ReservationFacade {

    private static final Logger logger = LoggerFactory.getLogger(ReservationFacade.class);

    @Autowired private ReservationService service;
    @Autowired private GymService gymService;
    @Autowired private CustomerService customerService;
    @Autowired private UserService userService;
    @Autowired private EventService eventService;
    @Qualifier("trainingSessionService")
    @Autowired private TrainingSessionService sessionService;
    @Qualifier("trainingBundleService")
    @Autowired private TrainingBundleService bundleService;

    private ATrainingBundle getTrainingBundle(Long bundleId, Customer customer) {
        return customer.getCurrentTrainingBundles()
                .stream().filter(b -> b.getId().equals(bundleId))
                .findAny()
                .orElseThrow(() -> new BadRequestException("Non possiedi questo pacchetto"));
    }

    private void simpleReservationChecks(Gym gym, Customer customer, ATrainingBundle bundle, Date startTime,
                                         Date endTime,
                                         String roleName) {

        if ("CUSTOMER".equals(roleName))
            checkPast(startTime);

        gymService.checkGymHours(gym, startTime, endTime);

        checkBundleIsReservable(customer, bundle);

        if ("CUSTOMER".equals(roleName))
            isReservedOnTime(startTime, gym);

        List<AEvent> events = this.eventService.findAllEventsLargerThanInterval(startTime, endTime);

        CheckEvents.hasHolidays(events);
    }

    private void isEventReservable(AEvent event) {
        if (!event.isReservable()) {
            throw new MethodNotAllowedException("Non è possibile prenotare questo evento");
        }
    }

    private void checkBundleIsReservable(Customer customer, ATrainingBundle bundle) {
        if (bundle.isExpired()) {
            List<ATrainingBundle> expiredBundles = deleteExpiredBundles(customer);
            customer.addToPreviousTrainingBundles(expiredBundles);
            customerService.save(customer);
            throw new MethodNotAllowedException("Hai completato tutte le sessioni di allenamento disponibili in questo pacchetto");
        }
        if (!customer.containsBundle(bundle)) {
            throw new MethodNotAllowedException("Non hai acquistato questo pacchetto");
        }
    }

    public void isAvailable(Long gymId, Long customerId, Long bundleId, Event event, String roleName) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        simpleReservationChecks(gym, customer, bundle, event.getStartTime(), event.getEndTime(), roleName);
    }

    public Reservation createReservationFromBundle(Long gymId, Long customerId, Long bundleId, Event event, String roleName) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        simpleReservationChecks(gym, customer, bundle, event.getStartTime(), event.getEndTime(), roleName);

        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        logger.info("Creating session");
        ATrainingSession session = bundle.createSession(startTime, endTime);
        session = sessionService.save(session);

        ATrainingEvent evt = new PersonalEvent();
        evt.setSession(session);
        evt.setEndTime(endTime);
        evt.setStartTime(startTime);
        evt.setName(String.format("Allenamento: %s", bundle.getName()));

        Reservation res = evt.reserve(customer);

        eventService.save(evt);

        bundle.addSession(session);
        bundleService.save(bundle);

        service.save(res);

        return res;
    }

    public Reservation createReservationFromEvent(Long gymId, Long customerId, Long eventId, String role) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        CourseEvent evt = (CourseEvent) eventService.findById(eventId);

        isEventReservable(evt);
        ATrainingSession session = evt.getSession();
        simpleReservationChecks(gym, customer, session.getTrainingBundle(),
                session.getStartTime(), session.getEndTime(), role);

        Reservation res;
        evt.reserve(customer);
        evt = (CourseEvent) this.eventService.save(evt);

        List<Reservation> reservationList = evt.getReservations();
        res = reservationList.get(reservationList.size()-1);

        return res;
    }

    public Reservation deleteReservations(Long eventId, Long reservationId, String roleName) {
        logger.info("Getting reservation by id");
        Reservation res = this.service.findById(reservationId);
        ATrainingEvent event = (ATrainingEvent) this.eventService.findById(eventId);

        ATrainingBundle bundle = event.getSession().getTrainingBundle();

        boolean evtCompleted = event.getSession().getCompleted();
        boolean resConfirmed = res.getConfirmed();

        boolean eitherCompletedOrConfirmed = resConfirmed || evtCompleted;
        boolean isPastEvt = isPast(event.getStartTime());
        boolean youAreCustomer = "CUSTOMER".equals(roleName);
        boolean isAPersonal = "P".equals(event.getType());

        if (youAreCustomer && eitherCompletedOrConfirmed && isPastEvt && isAPersonal)
            throw new BadRequestException("La prenotazione non può essere annullata. " +
                    "Rivolgiti in segreteria per annullare");

        event.deleteReservation(res);


        if (event.getType().equals("P")) {
            event.deleteSession();
            this.eventService.delete(event);
            this.bundleService.save(bundle);
        }
        else {
            this.eventService.save(event);
        }

        return res;
    }

    private boolean isPast(Date startTime) {
        return startTime.before(new Date());
    }

    public Reservation confirm(Long reservationId) {
        Reservation res = this.service.findById(reservationId);
        res.setConfirmed(true);
        res = this.service.save(res);
        return res;
    }

    public List<ATrainingBundle> deleteExpiredBundles(Customer customer) {
        logger.info("Checking whether the bundles are expired");
        List<ATrainingBundle> expiredBundles = customer
                .getCurrentTrainingBundles()
                .stream()
                .filter(ATrainingBundle::isExpired).collect(Collectors.toList());
        expiredBundles.forEach(customer::deleteBundle);
        return expiredBundles;
    }

    public void isReservedOnTime(Date startTime, Gym gym) {
        logger.info("Checking whether the date is before certain amount of hours");
        Date date = DateUtils.addHours(startTime, - gym.getReservationBeforeHours());
        Date now = new Date();
        if (date.before(now))
            throw new BadRequestException(
                    String.format("E' necessario prenotare almeno %s ore prima", gym.getReservationBeforeHours() ));
    }

    public Role getRoleFromPrincipal(Principal principal) {
        String email = principal.getName();
        AUser u = userService.findByEmail(email);
        return u.getRoles()
                .stream()
                .reduce((role, role2) -> role.getId() < role2.getId()? role : role2)
                .orElseThrow(() -> new InternalException("Nessun ruolo"));
    }
}
