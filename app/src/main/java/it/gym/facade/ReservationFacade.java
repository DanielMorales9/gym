package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.*;
import jdk.nashorn.internal.runtime.regexp.joni.exception.InternalException;
import org.apache.commons.lang3.time.DateUtils;
import org.jetbrains.annotations.NotNull;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.security.Principal;
import java.util.Calendar;
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
    @Qualifier("mailService")
    @Autowired private MailService mailService;

    private ATrainingBundle getTrainingBundle(Long bundleId, Customer customer) {
        return customer.getCurrentTrainingBundles()
                .stream().filter(b -> b.getId().equals(bundleId))
                .findAny()
                .orElseThrow(() -> new BadRequestException("Non possiedi questo pacchetto"));
    }

    private void simpleReservationChecks(Gym gym, Customer customer, ATrainingBundle bundle, Date startTime,
                                         Date endTime,
                                         boolean checkIsReservedOnTime,
                                         boolean checkIsPast,
                                         boolean checkNumEvents) {

        if (checkIsPast) checkPast(startTime);

        gymService.checkGymHours(gym, startTime, endTime);

        checkBundleIsReservable(customer, bundle);

        if (checkIsReservedOnTime && isNotOnTime(startTime, gym)) {
            throw new BadRequestException(
                    String.format("E' necessario prenotare almeno %s ore prima",
                            gym.getReservationBeforeHours() ));
        }

        List<AEvent> events = this.eventService.findAllEventsLargerThanInterval(startTime, endTime);

        hasHolidays(events);

        if (checkNumEvents) {
            isTimeAvailable(gym, startTime, endTime);
        }

    }

    private Long checkOverlappingEvents(Gym gym, Date startTime, Date endTime) {
        Integer minutesBetweenEvents = gym.getMinutesBetweenEvents();
        int minutes = minutesBetweenEvents != null ? minutesBetweenEvents : 0;

        Date rangeStart = addMinutes(startTime, -minutes);
        Date rangeEnd = addMinutes(endTime, minutes);

        return eventService.findOverlappingEvents(rangeStart, rangeEnd).stream()
                .filter(e -> "P".equals(e.getType()) || "C".equals(e.getType())).count();

    }

    @NotNull
    private Date addMinutes(Date time, int minutes) {
        Calendar cal;
        cal = Calendar.getInstance();
        cal.setTime(time);
        cal.add(Calendar.MINUTE, minutes);
        return cal.getTime();
    }

    private void isTimeAvailable(Gym gym, Date day, Date end) {
        Long nEventCount = this.checkOverlappingEvents(gym, day, end);
        if (gym.getNumEvents(day) <= nEventCount) {
            throw new BadRequestException("Non abbiamo posti disponibili in questo orario");
        }
    }

    private void isEventReservable(ATrainingEvent event) {
        if (!event.isReservable()) {
            throw new MethodNotAllowedException("Non è possibile prenotare questo evento");
        }
    }

    private void checkBundleIsReservable(Customer customer, ATrainingBundle bundle) {
        if (bundle.isExpired()) {
            List<ATrainingBundle> expiredBundles = deleteExpiredBundles(customer);
            expiredBundles.forEach(trainingBundle -> trainingBundle.setExpiredAt(new Date()));
            customer.addToPreviousTrainingBundles(expiredBundles);
            customerService.save(customer);
            sendExpiredBundleEmail(customer, bundle);
            throw new MethodNotAllowedException("Hai completato tutte le sessioni " +
                    "di allenamento disponibili in questo pacchetto");
        }
    }

    private void sendExpiredBundleEmail(Customer customer, ATrainingBundle bundle) {
        List<AUser> admins = userService.findAllAdmins();

        String subject = String.format("Notifica Terminazione Pacchetto di allenamento  %s",
                bundle.getName());

        String adminMessage = String.format(
                "Il cliente %s %s ha terminato il pacchetto %s.\n" +
                "Verifica lo stato del pacchetto al seguente" +
                " link https://www.goodfellas.fitness/admin/bundle/%s\n",
                customer.getFirstName(), customer.getLastName(),
                bundle.getName(), bundle.getId());

        String customerMessage = String.format(
                "Gentile %s %s,\n" +
                "Hai terminato il pacchetto %s.\n" +
                "Verifica lo stato del pacchetto al seguente" +
                " link https://www.goodfellas.fitness/customer/bundle/%s.\n" +
                "Rivolgiti in segreteria per rinnovare il tuo pacchetto o sceglierne un altro.",
                customer.getFirstName(), customer.getLastName(),
                bundle.getName(), bundle.getId());

        mailService.sendSimpleMail(customer.getEmail(), subject, customerMessage);

        admins.forEach(a -> {
            mailService.sendSimpleMail(a.getEmail(), subject,
                    String.format("Gentile %s %s,\n\n%s",
                            a.getFirstName(), a.getLastName(), adminMessage));
        });
    }

    public void isAvailable(Long gymId, Long customerId, Long bundleId, Event event, String roleName) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        boolean checkIsReservedOnTime = "CUSTOMER".equals(roleName);
        boolean checkIsPast = "CUSTOMER".equals(roleName);
        boolean checkNumEvents = "CUSTOMER".equals(roleName);
        simpleReservationChecks(gym, customer, bundle,
                event.getStartTime(), event.getEndTime(),
                checkIsReservedOnTime, checkIsPast, checkNumEvents);
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

    public boolean isNotOnTime(Date startTime, Gym gym) {
        logger.info("Checking whether the date is before certain amount of hours");
        Date date = DateUtils.addHours(startTime, - gym.getReservationBeforeHours());
        Date now = new Date();
        return date.before(now);
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
                                         String roleName) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        boolean checkIsReservedOnTime = "CUSTOMER".equals(roleName);
        boolean checkIsPast = checkIsReservedOnTime;
        boolean checkNumEvents = checkIsPast;
        simpleReservationChecks(gym, customer, bundle, event.getStartTime(), event.getEndTime(),
                checkIsReservedOnTime,
                checkIsPast,
                checkNumEvents);

        logger.info("Creating personal training event");
        ATrainingEvent evt = createPersonalTrainingEvent(bundle, event);

        return makeReservation(customer, bundle, evt);
    }

    public Reservation createReservationWithExistingEvent(Long gymId,
                                                          Long customerId,
                                                          Long eventId,
                                                          Long bundleId,
                                                          String roleName) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        ATrainingEvent evt = (ATrainingEvent) eventService.findById(eventId);

        boolean checkIsPast = "CUSTOMER".equals(roleName);
        boolean checkIsReservedOnTime = checkIsPast;
        boolean checkNumEvents = checkIsPast;
        simpleReservationChecks(gym, customer, bundle, evt.getStartTime(), evt.getEndTime(),
                checkIsReservedOnTime, checkIsPast, checkNumEvents);

        return makeReservation(customer, bundle, evt);
    }

    public Reservation deleteReservation(Long eventId, Long reservationId, Long gymId, String email, String roleName) {
        logger.info("Getting reservation by id");
        Gym gym = this.gymService.findById(gymId);
        ATrainingEvent event = (ATrainingEvent) this.eventService.findById(eventId);
        Reservation res = this.service.findById(reservationId);

        logger.info("Getting session by reservation from event");
        ATrainingSession session = event.getSession(res);
        logger.info("Getting bundle from session");
        ATrainingBundle bundle = session.getTrainingBundle();

        boolean canCancel;
        if (!bundle.getUnlimitedDeletions()) {
            canCancel = bundle.getNumDeletions() > 0;
        }
        else {
            canCancel = true;
        }

        boolean isPastEvt = isPast(event.getStartTime());
        boolean notOnTime = isNotOnTime(event.getStartTime(), gym);
        boolean youAreCustomer = "CUSTOMER".equals(roleName);
        boolean isAPersonal = "P".equals(event.getType());

        if (youAreCustomer) {
            if (isPastEvt) {
                sendDeleteReservationAttemptEmail(email, event);
                throw new BadRequestException("Non è possibile annulare una prenotazione ad un allenamento passato. " +
                        "Rivolgiti in segreteria per maggiori informazioni");
            }
            else if (isAPersonal) {
                if (notOnTime) {
                    sendDeleteReservationAttemptEmail(email, event);
                    throw new BadRequestException(
                            String.format("E' necessario annullare una prenotazione almeno %s ore prima. " +
                                          "Rivolgiti in segreteria per maggiori informazioni",
                                    gym.getReservationBeforeHours()));
                }
                else if (!canCancel) {
                    sendDeleteReservationAttemptEmail(email, event);
                    throw new BadRequestException("Hai terminato il numero massimo di cancellazioni. " +
                            "Rivolgiti in segreteria per maggiori informazioni");

                }
            }
        }

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

            logger.info("Saving training event");
            this.eventService.save(event);

        }

        return res;
    }

    private void sendDeleteReservationAttemptEmail(String email, ATrainingEvent event) {
        AUser customer = userService.findByEmail(email);
        List<AUser> admins = userService.findAllAdmins();

        String subject = String.format("Tentativo di annullamento prenotatione di %s %s",
                customer.getFirstName(), customer.getLastName());

        String message = String.format(
                        "Il cliente %s %s ha tentato di annulare la prenotazione di %s dalle %s alle %s.\n" +
                        "Verifica lo stato dellla prenotazione al seguente" +
                        " link https://www.goodfellas.fitness/admin/events/%s\n",
                customer.getFirstName(), customer.getLastName(),
                event.getName(), event.getStartTime(), event.getEndTime(),
                event.getId());
        admins.forEach(a -> {
            mailService.sendSimpleMail(a.getEmail(), subject,
                    String.format("Gentile %s %s,\n\n%s",  a.getFirstName(), a.getLastName(), message));
        });
    }

    public Reservation confirm(Long reservationId) {
        Reservation res = this.service.findById(reservationId);
        res.setConfirmed(true);
        res = this.service.save(res);
        return res;
    }
}
