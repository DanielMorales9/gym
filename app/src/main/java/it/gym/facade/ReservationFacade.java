package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.InternalServerException;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.*;
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
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@Transactional
@PropertySource("application.yml")
public class ReservationFacade {

    private static final Logger logger = LoggerFactory.getLogger(ReservationFacade.class);

    @Autowired private ReservationService service;
    @Autowired private GymService gymService;
    @Autowired private CustomerService customerService;
    @Autowired private TrainerService trainerService;
    @Autowired private EventService timeService;
    @Qualifier("trainingSessionService")
    @Autowired private TrainingSessionService sessionService;
    @Autowired private TrainingBundleService bundleService;
    @Autowired private UserService userService;
    @Autowired private MailService mailService;

    @Value("${reservationBeforeHours}")
    Integer reservationBeforeHours;

    public void isAvailable(Long gymId, Long customerId, Date startTime, Date endTime) {

        Gym gym = this.gymService.findById(gymId);
        logger.info(String.format("Is Reservation available on %s", startTime.toString()));

        isValidInterval(startTime, endTime);

        gymService.isWithinWorkingHours(gym, startTime, endTime);

        isDoublyBooked(customerId, startTime, endTime);

        isOnTime(startTime);

        logger.info("Getting customer by id");

        Customer customer = this.customerService.findById(customerId);

        customer = deleteExpiredBundles(customer);

        isBundleLeft(customer);

        List<AEvent> timesOff = this.timeService.findTimesOffTypeInBetween(startTime, endTime);

        hasHolidays(timesOff);

        isTrainerAvailable(timesOff, startTime, endTime);
    }

    private void isValidInterval(Date startTime, Date endTime) {
        if (gymService.isInvalidInterval(startTime, endTime))
            throw new BadRequestException("Data Non Valida");
    }

    public Reservation book(Long gymId, Long customerId, Date startTime, Date endTime) {

        Gym gym = this.gymService.findById(gymId);

        isValidInterval(startTime, endTime);

        gymService.isWithinWorkingHours(gym, startTime, endTime);

        isDoublyBooked(customerId, startTime, endTime);

        isOnTime(startTime);

        logger.info("Getting customer by id");
        Customer customer = this.customerService.findById(customerId);

        isBundleLeft(customer);

        logger.info("Getting current training bundles");
        List<ATrainingBundle> currentTrainingBundles = customer.getCurrentTrainingBundles();

        logger.info("Getting current training bundle");
        ATrainingBundle trainingBundle = currentTrainingBundles.get(0);

        logger.info("Booking training bundle.");
        ATrainingSession session = trainingBundle.createSession(startTime, endTime);
        session = sessionService.save(session);

        Reservation res = createReservation(startTime, endTime, customer, session);
        res = this.service.save(res);

        trainingBundle.addSession(session);
        bundleService.save(trainingBundle);

        return res;
    }


    public Reservation cancel(Long reservationId, String email, String type) {
        logger.info("Getting reservation by id");
        Reservation res = this.service.findById(reservationId);

        logger.info("Getting session from reservation");
        ATrainingSession session = res.getSession();

        logger.info("Getting the current user");
        AUser user = this.userService.findByEmail(email);

        isDeletable(session, user);

        logger.info("Deleting training session from bundle and reservation");
        this.bundleService.save(session.getTrainingBundle());
        sessionService.delete(session);
        this.service.delete(res);

        sendCancelEmail(res, type);
        return res;
    }

    private void sendCancelEmail(Reservation res, String type) {
        if (!type.equals("customer")) {
            String recipientAddress = res.getUser().getEmail();
            String message = "Ci dispiace informarla che la sua prenotazione è stata cancellata.\n" +
                    "La ringraziamo per la comprensione.";
            this.mailService.sendSimpleMail(recipientAddress, "Prenotazione eliminata", message);
        }
    }

    public List<Reservation> findByDateInterval(Optional<Long> id, Date startTime, Date endTime) {
        if (!id.isPresent())
            return this.service.findByInterval(startTime, endTime);
        return this.service.findByInterval(id.get(), startTime, endTime);
    }

    public ATrainingSession complete(Long sessionId) {
        ATrainingSession session = this.sessionService.findById(sessionId);
        session.complete();
        return sessionService.save(session);
    }

    public Reservation confirm(Long reservationId) {
        Reservation res = this.service.findById(reservationId);
        res.setConfirmed(true);
        res = this.service.save(res);
        return res;
    }

    void isTrainerAvailable(List<AEvent> timesOff, Date startTime, Date endTime) {
        logger.info("Checking whether there are trainers available");

        Long numTrainers = this.trainerService.countAllTrainer();
        Long numOffTrainers = timesOff.parallelStream().filter(t -> t.getType().equals(TimeOff.TYPE)).count();
        long numAvailableTrainers = numTrainers - numOffTrainers;
        if (numAvailableTrainers <= 0) {
            throw new BadRequestException("Non ci sono personal trainer disponibili");
        }

        List<Reservation> reservations = this.service.findByInterval(startTime, endTime);
        numAvailableTrainers = numAvailableTrainers - reservations.size();

        if (numAvailableTrainers == 0)
            throw new BadRequestException("Questo orario è già stato prenotato");
    }

    void isBundleLeft(Customer customer) {
        logger.info("Checking whether there are bundles left");
        long bundleCount = customer
                .getCurrentTrainingBundles().size();
        if (bundleCount == 0)
            throw new BadRequestException("Non hai più pacchetti a disposizione");
    }

    Customer deleteExpiredBundles(Customer customer) {
        logger.info("Checking whether the bundles are expired");
        boolean allDeleted = customer
                .getCurrentTrainingBundles()
                .parallelStream()
                .filter(ATrainingBundle::isExpired)
                .map(customer::deleteBundle)
                .reduce(Boolean::logicalAnd).orElse(true);

        if (!allDeleted) throw new InternalServerException("Qualcosa è andato storto.");
        return customerService.save(customer);
    }

    void isOnTime(Date startTime) {
        logger.info("Checking whether the date is before certain amount of hours");
        Date date = DateUtils.addHours(startTime, -this.reservationBeforeHours);
        Date now = new Date();
        if (date.before(now))
            throw new BadRequestException(
                    String.format("E' necessario prenotare almeno %s ore prima", reservationBeforeHours ));
    }

    void isDoublyBooked(Long id, Date startTime, Date endTime) {
        List<Reservation> reservations = this.service.findByInterval(id, startTime, endTime);

        if (!reservations.isEmpty())
            throw new BadRequestException("Hai già prenotato in questo orario");
    }

    void hasHolidays(List<AEvent> timesOff) {
        logger.info("Checking whether there are times off");

        Stream<AEvent> countAdmin = timesOff
                .parallelStream()
                .filter(s -> s.getType().equals(Holiday.TYPE)).limit(1);
        if (countAdmin.count() == 1)
            throw new BadRequestException("Chiusura Aziendale");
    }

    private Reservation createReservation(Date startTime, Date endTime, Customer customer, ATrainingSession session) {
        Reservation res = new Reservation();
        res.setUser(customer);
        res.setSession(session);
        res.setConfirmed(false);
        res.setStartTime(startTime);
        res.setEndTime(endTime);
        return res;
    }

    private void isDeletable(ATrainingSession session, AUser user) {
        List<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());

        if (session.isDeletable() || (roles.contains("ADMIN") || roles.contains("TRAINER")))
            session.deleteMeFromBundle();
        else
            throw new MethodNotAllowedException("Non è possibile eliminare la prenotazione");
    }

}
