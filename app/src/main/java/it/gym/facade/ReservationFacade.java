package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.InternalServerException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
import it.gym.pojo.Event;
import it.gym.service.*;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Transactional
@PropertySource("application.yml")
public class ReservationFacade {

    private static final Logger logger = LoggerFactory.getLogger(ReservationFacade.class);

    @Autowired private ReservationService service;
    @Autowired private GymService gymService;
    @Autowired private CustomerService customerService;
    @Autowired private TrainerService trainerService;
    @Autowired
    private EventService eventService;
    @Qualifier("trainingSessionService")
    @Autowired private TrainingSessionService sessionService;
    @Autowired private TrainingBundleService bundleService;
    @Autowired private UserService userService;
    @Autowired private MailService mailService;

    @Value("${reservationBeforeHours}")
    Integer reservationBeforeHours;

    public void isAvailable(Long gymId, Long customerId, Long bundleId, Event event) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        simpleReservationChecks(customerId, event, gym, customer, bundle);
    }

    private ATrainingBundle getTrainingBundle(Long bundleId, Customer customer) {
        return customer.getCurrentTrainingBundles()
                .stream().filter(b -> b.getId().equals(bundleId))
                .findAny()
                .orElseThrow(() -> new BadRequestException("Non possiedi questo pacchetto"));
    }

    private void simpleReservationChecks(Long customerId, Event event, Gym gym, Customer customer, ATrainingBundle bundle) {
        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        // do all the checks
        gymService.simpleGymChecks(gym, startTime, endTime);

        checkBundleIsReservable(customer, bundle);

        isReservationDoublyBooked(customerId, startTime, endTime);

        isReservedOnTime(startTime);

        List<AEvent> timesOff = this.eventService.findAllEventsLargerThanInterval(startTime, endTime);

        hasHolidays(timesOff);

        isTrainerAvailable(timesOff, startTime, endTime);

        isEventReservable(event.getId());
    }

    public Reservation createReservation(Long gymId, Long customerId, Long bundleId, Event event) {
        Gym gym = this.gymService.findById(gymId);
        Customer customer = this.customerService.findById(customerId);
        ATrainingBundle bundle = getTrainingBundle(bundleId, customer);

        simpleReservationChecks(customerId, event, gym, customer, bundle);

//        if (event.getId()) gets the session
//        Add the reservation to the list of reservation of the event

        Date startTime = event.getStartTime();
        Date endTime = event.getEndTime();

        logger.info("Creating session");
        ATrainingSession session = bundle.createSession(startTime, endTime);
        session = sessionService.save(session);

        Reservation res = new Reservation();
        res.setUser(customer);
        res.setSession(session);
        res.setConfirmed(false);
        res.setStartTime(startTime);
        res.setEndTime(endTime);

        res = this.service.save(res);
        bundle.addSession(session);
        bundleService.save(bundle);

        return res;
    }


    public Reservation deleteReservations(Long reservationId, String email, String type) {
        logger.info("Getting reservation by id");
        Reservation res = this.service.findById(reservationId);

        logger.info("Getting session from reservation");
        ATrainingSession session = res.getSession();

        logger.info("Getting the principal user");
        AUser principal = this.userService.findByEmail(email);

        deleteSessionFromBundle(res, principal);

        logger.info("Deleting training session from bundle and reservation");
        this.bundleService.save(res.getSession().getTrainingBundle());
        sessionService.delete(session);
        this.service.delete(res);

        sendCancelEmail(res, type);
        return res;
    }

    public List<Reservation> findByDateIntervalAndId(Long id, Date startTime, Date endTime) {
        return this.service.findByIntervalAndId(id, startTime, endTime);
    }

    public List<Reservation> findByDateInterval(Date startTime, Date endTime) {
        return this.service.findByInterval(startTime, endTime);
    }

    public Reservation complete(Long reservationId) {
        Reservation reservations = service.findById(reservationId);
        ATrainingSession session = reservations.getSession();
        session.complete();
        return service.save(reservations);
    }

    public Reservation confirm(Long reservationId) {
        Reservation res = this.service.findById(reservationId);
        res.setConfirmed(true);
        res = this.service.save(res);
        return res;
    }

    private void isEventReservable(Long eventId) {
        if (eventId != null) {
            AEvent event = eventService.findById(eventId);
            if (!event.isReservable()) {
                throw new MethodNotAllowedException("Non è possibile prenotare questo evento");
            }
        }
    }

    private void checkBundleIsReservable(Customer customer, ATrainingBundle bundle) {
        if (bundle.isExpired()) {
            deleteExpiredBundles(customer);
            throw new MethodNotAllowedException("Hai completato tutte le sessioni di allenamento disponibili in questo pacchetto");
        }
    }

    void isTrainerAvailable(List<AEvent> timesOff, Date startTime, Date endTime) {
        logger.info("Checking whether there are trainers available");

        Long nTrainers = this.trainerService.countAllTrainer();
        Long nUnavailableTrainers = timesOff.stream().filter(t -> t.getType().equals(TimeOff.TYPE)).count();
        long nAvailableTrainers = nTrainers - nUnavailableTrainers;
        if (nAvailableTrainers <= 0) {
            throw new BadRequestException("Non ci sono personal trainer disponibili");
        }

        // TODO add logic for reservations or non personal reservations
        long nReservations = this.service.findByInterval(startTime, endTime).size();
        // TODO add Gym capacity check
        nAvailableTrainers = nAvailableTrainers - nReservations;

        if (nAvailableTrainers == 0)
            throw new BadRequestException("Questo orario è già stato prenotato");
    }

    void isBundleLeft(Customer customer) {
        logger.info("Checking whether there are bundles left");
        long bundleCount = customer
                .getCurrentTrainingBundles().size();
        if (bundleCount == 0)
            throw new BadRequestException("Non hai più pacchetti a disposizione");
    }

    void deleteExpiredBundles(Customer customer) {
        logger.info("Checking whether the bundles are expired");
        boolean allDeleted = customer
                .getCurrentTrainingBundles()
                .parallelStream()
                .filter(ATrainingBundle::isExpired)
                .map(customer::deleteBundle)
                .reduce(Boolean::logicalAnd).orElse(true);

        if (!allDeleted)
            throw new InternalServerException("Qualcosa è andato storto.");
    }

    void isReservedOnTime(Date startTime) {
        logger.info("Checking whether the date is before certain amount of hours");
        Date date = DateUtils.addHours(startTime, -this.reservationBeforeHours);
        Date now = new Date();
        if (date.before(now))
            throw new BadRequestException(
                    String.format("E' necessario prenotare almeno %s ore prima", reservationBeforeHours ));
    }

    void isReservationDoublyBooked(Long customer, Date startTime, Date endTime) {
        List<Reservation> reservations = this.service.findByIntervalAndId(customer, startTime, endTime);

        if (!reservations.isEmpty())
            throw new BadRequestException("Hai già prenotato in questo orario");
    }

    void hasHolidays(List<AEvent> events) {
        logger.info("Checking whether there are times off");

        long nHolidays = events.stream()
                .filter(s -> s.getType().equals(Holiday.TYPE))
                .limit(1)
                .count();

        if (nHolidays > 0)
            throw new BadRequestException("Chiusura Aziendale");
    }

    private void deleteSessionFromBundle(Reservation reservation, AUser principal) {
        ATrainingSession session = reservation.getSession();
        Customer customer = reservation.getUser();

        List<String> roles = principal.getRoles().stream().map(Role::getName).collect(Collectors.toList());

        if (roles.contains("ADMIN") || roles.contains("TRAINER")) {
            session.deleteMeFromBundle();
        } else if (session.isDeletable() && principal.getEmail().equals(customer.getEmail()))
            session.deleteMeFromBundle();
        else
            throw new MethodNotAllowedException("Non è possibile eliminare la prenotazione");
    }

    private void sendCancelEmail(Reservation res, String type) {
        if (!type.equals("customer")) {
            String recipientAddress = res.getUser().getEmail();
            String message = "Ci dispiace informarla che la sua prenotazione è stata cancellata.\n" +
                    "La ringraziamo per la comprensione.";
            this.mailService.sendSimpleMail(recipientAddress, "Prenotazione eliminata", message);
        }
    }
}
