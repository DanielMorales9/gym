package it.gym.controller;

import it.gym.exception.*;
import it.gym.hateoas.ReservationAssembler;
import it.gym.hateoas.ReservationResource;
import it.gym.hateoas.TrainingSessionAssembler;
import it.gym.hateoas.TrainingSessionResource;
import it.gym.model.*;
import it.gym.repository.*;
import it.gym.service.CustomerService;
import it.gym.service.ReservationService;
import it.gym.service.TrainingBundleService;
import it.gym.utility.MailSenderUtility;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RepositoryRestController
@PropertySource("application.yml")
@RequestMapping("/reservations")
@PreAuthorize("isAuthenticated()")
public class TrainingReservationController {

    private final TimeOffRepository timeRepository;
    private final TrainerRepository trainerRepository;
    private final CustomerService customerService;
    private final ReservationService reservationService;
    private final TrainingBundleService trainingBundleService;
    private final TrainingSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final GymRepository gymRepository;

    private static final Logger logger = LoggerFactory.getLogger(TrainingReservationController.class);

    @Value("${reservationBeforeHours}")
    Integer reservationBeforeHours;


    @Autowired
    public TrainingReservationController(TimeOffRepository timeRepository,
                                         TrainerRepository trainerRepository,
                                         TrainingBundleService trainingBundleService,
                                         TrainingSessionRepository sessionRepository,
                                         CustomerService customerService,
                                         UserRepository userRepository,
                                         JavaMailSender mailSender,
                                         ReservationService reservationService, GymRepository gymRepository) {
        this.timeRepository = timeRepository;
        this.trainerRepository = trainerRepository;
        this.trainingBundleService = trainingBundleService;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.customerService = customerService;
        this.reservationService = reservationService;
        this.mailSender = mailSender;
        this.gymRepository = gymRepository;
    }

    @GetMapping(path = "/checkAvailabilityAndEnablement")
    @Transactional
    @PreAuthorize("hasAuthority('CUSTOMER')")
    ResponseEntity<String> checkAvailableDay(@RequestParam("gymId") Long gymId,
                                             @RequestParam("date")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm") Date startTime,
                                             @RequestParam("id") Long id) {

        logger.info("checkAvailabilityAndEnablement");
        logger.info(startTime.toString());
        Date endTime = DateUtils.addHours(startTime, 1);

        isDateValid(gymId, startTime, endTime);

        logger.info("Checking double booking");
        Date endDate = DateUtils.addHours(startTime, 1);
        List<Reservation> reservations = this.reservationService.findByStartTimeAndEndTimeAndId(
                Optional.of(id),
                startTime,
                endDate);
        if (!reservations.isEmpty())
            throw new InvalidReservationException("Hai già prenotato in questo orario");

        logger.info("Checking whether the date is before certain amount of hours");
        if (checkBeforeHour(startTime))
            throw new InvalidReservationException("E' necessario prenotare almeno " +
                    this.reservationBeforeHours + " ore prima");

        logger.info("Getting customer by id");
        Customer customer = this.customerService.findById(id);

        logger.info("Checking whether the bundles are expired");
        boolean allDeleted = customer
                .getCurrentTrainingBundles()
                .parallelStream()
                .filter(ATrainingBundle::isExpired)
                .map(customer::deleteBundle)
                .reduce(Boolean::logicalAnd).orElse(true);

        if (!allDeleted) throw new InternalReservationException("Qualcosa è andato storto.");

        logger.info("Checking whether there are bundles left");
        long bundleCount = customer
                .getCurrentTrainingBundles()
                .parallelStream()
                .filter(aTrainingBundle -> !aTrainingBundle.isExpired()).count();
        if (bundleCount == 0)
            throw new InvalidReservationException("Non hai più pacchetti a disposizione");

        logger.info("Checking whether there are times off");
        List<String> timesOff = this.timeRepository.findTimesOffTypeInBetween(startTime, endDate);
        Stream<String> countAdmin = timesOff
                .parallelStream()
                .filter(s -> s.equals("admin")).limit(1);
        if (countAdmin.count() == 1)
            throw new InvalidReservationException("Chiusura Aziendale");

        logger.info("Checking whether there are times off");
        Long numTrainers = this.trainerRepository.countAllTrainer();
        Long numOffTrainers = timesOff.parallelStream().filter(t -> t.equals("trainer")).count();
        long numAvailableTrainers = numTrainers - numOffTrainers;
        if (numAvailableTrainers == 0)
            throw new InvalidReservationException("Non ci sono personal trainer disponibili");

        logger.info("Checking whether there are trainers available");
        reservations = this.reservationService.findByStartTime(startTime);
        numAvailableTrainers = numAvailableTrainers - reservations.size();

        if (numAvailableTrainers == 0)
            throw new InvalidReservationException("Questo orario è già stato prenotato");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/book/{customerId}")
    @Transactional
    @PreAuthorize("hasAuthority('CUSTOMER')")
    ResponseEntity<ReservationResource> book(@PathVariable Long customerId,
                                             @RequestParam("gymId") Long gymId,
                                             @RequestParam("date")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm") Date startTime) {

        logger.info(startTime.toString());
        Date endTime = DateUtils.addHours(startTime, 1);

        isDateValid(gymId, startTime, endTime);

        logger.info("Getting customer by id");
        Customer c = this.customerService.findById(customerId);
        logger.info("Getting current training bundle");

        List<ATrainingBundle> currentTrainingBundles = c.getCurrentTrainingBundles();
        if (currentTrainingBundles.isEmpty()) {
            throw new InvalidReservationException("Non hai più pacchetti a disposizione");
        }

        logger.info("Getting current training bundle");
        ATrainingBundle trainingBundle = currentTrainingBundles.get(0);
        logger.info("Booking training bundle.");
        Reservation res = trainingBundle.book(c, startTime, endTime);

        logger.info("Saving session");
        ATrainingSession session = this.sessionRepository.save(res.getSession());
        res.setSession(session);
        res = this.reservationService.save(res);
        trainingBundle.addSession(session);
        this.trainingBundleService.save(trainingBundle);

        // TODO: send notification to trainer

        return ResponseEntity.ok(new ReservationAssembler().toResource(res));

    }

    @DeleteMapping(path = "/{reservationId}")
    @Transactional
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<ReservationResource> delete(@PathVariable Long reservationId,
                                               @RequestParam(value = "type", defaultValue = "customer") String type,
                                               Principal principal) {
        Reservation res = deleteReservation(reservationId, principal);

        if (!type.equals("customer")) {
            // TODO Send Custom cancel message over mail
            String recipientAddress = res.getUser().getEmail();
            String message = "Ci dispiace informarla che la sua prenotazione è stata cancellata.\n" +
                    "La ringraziamo per la comprensione.";
            MailSenderUtility.sendEmail(this.mailSender, "Prenotazione eliminata", message, recipientAddress);
        }
        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }


    @GetMapping
    ResponseEntity<List<ReservationResource>> getReservations(@RequestParam(value = "id", required = false) Long id,
                                                              @RequestParam(value = "endTime")
                                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                      Date endTime,
                                                              @RequestParam(value = "startTime")
                                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                      Date startTime) {
        List<Reservation> res = this.reservationService
                .findByStartTimeAndEndTimeAndId(Optional.ofNullable(id), startTime, endTime);
        return ResponseEntity.ok(new ReservationAssembler().toResources(res));
    }

    @GetMapping(path="/complete/{sessionId}")
    @ResponseBody
    @PreAuthorize("hasAuthority('TRAINER')")
    ResponseEntity<TrainingSessionResource> complete(@PathVariable(value = "sessionId") Long sessionId) {
        logger.info("completing session");
        ATrainingSession session = this.sessionRepository.findById(sessionId)
                .orElseThrow(() -> new TrainingSessionNotFound(String.format("La sessione di allenamento " +
                        "(%d) non è stata trovata", sessionId)));
        session.complete();
        return ResponseEntity.ok(new TrainingSessionAssembler().toResource(session));
    }

    @GetMapping(path="/confirm/{reservationId}")
    @ResponseBody
    @PreAuthorize("hasAnyAuthority('TRAINER', 'ADMIN')")
    ResponseEntity<ReservationResource> confirm(@PathVariable(value = "reservationId") Long reservationId) {
        logger.info("confirming session");
        Reservation res = this.reservationService.findById(reservationId);
        res.setConfirmed(true);
        res = this.reservationService.save(res);
        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }

    private Reservation deleteReservation(Long reservationId, Principal principal) {
        logger.info("Getting reservation by id");
        Reservation res = this.reservationService.findById(reservationId);

        logger.info("Getting session from reservation");
        ATrainingSession session = res.getSession();

        logger.info("Getting the current user");
        AUser user = this.userRepository.findByEmail(principal.getName());
        List<String> roles = user.getRoles().stream().map(Role::getName).collect(Collectors.toList());

        if (session.isDeletable() || (roles.contains("ADMIN") || roles.contains("TRAINER")))
            session.deleteMeFromBundle();
        else
            throw new NotAllowedException("Non è possibile eliminare la prenotazione");

        logger.info("Deleting training session");
        this.trainingBundleService.save(session.getTrainingBundle());
        sessionRepository.delete(session);
        this.reservationService.delete(res);
        return res;
    }

    private boolean checkBeforeHour(Date date) {
        return DateUtils.addHours(date, - this.reservationBeforeHours).before(new Date());
    }

    private void isDateValid(Long gymId, Date start, Date end) {
        Optional<Gym> opt = this.gymRepository.findById(gymId);
        if (!opt.isPresent())
            throw new GymNotFoundException(gymId);
        Gym gym = opt.get();
        if (!gym.isValidDate(start, end)) throw new InvalidTimesOff("Data non valida");
    }
}
