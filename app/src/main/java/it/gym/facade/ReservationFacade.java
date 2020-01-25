package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.*;
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
import static it.gym.utility.CheckEvents.hasHolidays;

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

        hasHolidays(events);
    }

    private void isEventReservable(ATrainingEvent event) {
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

    private List<ATrainingBundle> deleteExpiredBundles(Customer customer) {
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

    private boolean isPast(Date startTime) {
        return startTime.before(new Date());
    }

    private ATrainingEvent createPersonalTrainingEvent(ATrainingBundle bundle, Event event) {
        ATrainingEvent evt = new PersonalTrainingEvent();
        evt.setStartTime(event.getStartTime());
        evt.setEndTime(event.getEndTime());
        evt.setName(String.format("Allenamento: %s", bundle.getName()));
        return evt;
    }

    private Reservation makeReservation(Customer customer, ATrainingBundle bundle, ATrainingEvent evt) {
        isEventReservable(evt);

        logger.info("Creating reservation");
        Reservation res = evt.createReservation(customer);

        logger.info("Saving reservation");
        res = service.save(res);

        logger.info("Creating training session");
        ATrainingSession session = bundle.createSession(evt);

        logger.info("Saving created session");
        session = sessionService.save(session);

        logger.info("Adding reservation to training event");
        evt.addReservation(res);

        logger.info("Adding training session to the training event");
        evt.addSession(res.getId(), session);

        logger.info("Saving training event");
        eventService.save(evt);

        logger.info("Adding training session to bundle");
        bundle.addSession(session);

        logger.info("Saving training session into bundle");
        bundleService.save(bundle);

        return res;
    }


    public Reservation createReservation(Long gymId,
                                         Long customerId,
                                         Long bundleId,
                                         Event event,
                                         String role) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        simpleReservationChecks(gym, customer, bundle, event.getStartTime(), event.getEndTime(), role);

        logger.info("Creating personal training event");
        ATrainingEvent evt = createPersonalTrainingEvent(bundle, event);

        return makeReservation(customer, bundle, evt);
    }

    public Reservation createReservationWithExistingEvent(Long gymId,
                                                          Long customerId,
                                                          Long eventId,
                                                          Long bundleId,
                                                          String role) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        ATrainingEvent evt = (ATrainingEvent) eventService.findById(eventId);

        simpleReservationChecks(gym, customer, bundle, evt.getStartTime(), evt.getEndTime(), role);

        return makeReservation(customer, bundle, evt);
    }

    public Reservation deleteReservation(Long eventId, Long reservationId, String roleName) {
        logger.info("Getting reservation by id");
        ATrainingEvent event = (ATrainingEvent) this.eventService.findById(eventId);
        Reservation res = this.service.findById(reservationId);

        boolean isSessionConfirmed = event.getSession(res).getCompleted();
        boolean isReservationConfirmed = res.getConfirmed();

        boolean eitherCompletedOrConfirmed = isReservationConfirmed || isSessionConfirmed;
        boolean isPastEvt = isPast(event.getStartTime());
        boolean youAreCustomer = "CUSTOMER".equals(roleName);
        boolean isAPersonal = "P".equals(event.getType());

        if (youAreCustomer && eitherCompletedOrConfirmed && isPastEvt && isAPersonal)
            throw new BadRequestException("La prenotazione non può essere annullata. " +
                    "Rivolgiti in segreteria per annullare");

        logger.info("Getting session by reservation from event");
        ATrainingSession session = event.getSession(res);

        logger.info(session.toString());

        logger.info("Getting bundle from session");
        ATrainingBundle bundle = session.getTrainingBundle();

        logger.info("Deleting session from bundle");
        session.deleteMeFromBundle();

        logger.info("Saving bundle event");
        this.bundleService.save(bundle);

        if (event.getType().equals("P")) {
            logger.info("Deleting personal training event");
            this.eventService.delete(event);
        } else {
            logger.info("Deleting reservation from event");
            event.deleteReservation(res);

            logger.info("Deleting session by reservation from event");
            event.deleteSession(res);

            logger.info("Deleting session");
            this.sessionService.delete(session);

            logger.info("Deleting reservation");
            this.service.delete(res);

            logger.info("Saving training event");
            this.eventService.save(event);

        }

        return res;
    }

    public Reservation confirm(Long reservationId) {
        Reservation res = this.service.findById(reservationId);
        res.setConfirmed(true);
        res = this.service.save(res);
        return res;
    }
}
