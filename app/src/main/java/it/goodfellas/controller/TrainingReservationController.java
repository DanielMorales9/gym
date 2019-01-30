package it.goodfellas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import it.goodfellas.exception.*;
import it.goodfellas.hateoas.ReservationAssembler;
import it.goodfellas.hateoas.ReservationResource;
import it.goodfellas.hateoas.TrainingSessionAssembler;
import it.goodfellas.hateoas.TrainingSessionResource;
import it.goodfellas.model.*;
import it.goodfellas.repository.TimeOffRepository;
import it.goodfellas.repository.TrainerRepository;
import it.goodfellas.repository.TrainingSessionRepository;
import it.goodfellas.repository.UserRepository;
import it.goodfellas.service.CustomerService;
import it.goodfellas.service.ReservationService;
import it.goodfellas.service.TrainingBundleService;
import it.goodfellas.utility.MailSenderUtility;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.ConfigurableBeanFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.annotation.Scope;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.core.EvoInflectorRelProvider;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.websocket.server.PathParam;
import java.security.Principal;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@PropertySource("application.yml")
@RequestMapping("/reservations")
public class TrainingReservationController {

    private final TimeOffRepository timeRepository;
    private final TrainerRepository trainerRepository;
    private final CustomerService customerService;
    private final ReservationService reservationService;
    private final TrainingBundleService trainingBundleService;
    private final TrainingSessionRepository sessionRepository;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;

    @Value("${reservationBeforeHours}")
    Integer reservationBeforeHours;

    private final static Logger logger = LoggerFactory.getLogger(TrainingReservationController.class);


    @Autowired
    public TrainingReservationController(TimeOffRepository timeRepository,
                                         TrainerRepository trainerRepository,
                                         TrainingBundleService trainingBundleService,
                                         TrainingSessionRepository sessionRepository,
                                         CustomerService customerService,
                                         UserRepository userRepository,
                                         JavaMailSender mailSender,
                                         ReservationService reservationService) {
        this.timeRepository = timeRepository;
        this.trainerRepository = trainerRepository;
        this.trainingBundleService = trainingBundleService;
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.customerService = customerService;
        this.reservationService = reservationService;
        this.mailSender = mailSender;
    }

    @GetMapping(path = "/checkAvailabilityAndEnablement", produces = "text/plain")
    @Transactional
    ResponseEntity<String> checkAvailableDay(@RequestParam("date")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                     Date startDate,
                                             @RequestParam("id") Long id) {

        logger.info("Checking availability and enablement");
        logger.info("Checking whether the date is past");
        if (checkDateBeforeToday(startDate))
            throw new InvalidReservationException("Data non valida");

        logger.info("Checking double booking");
        Date endDate = DateUtils.addHours(startDate, 1);
        List<Reservation> reservations = this.reservationService.findByStartTimeAndEndTimeAndId(
                Optional.of(id),
                startDate,
                endDate);
        if (!reservations.isEmpty())
            throw new InvalidReservationException("Hai già prenotato in questo orario");

        logger.info("Checking whether the date is before certain amount of hours");
        if (checkBeforeHour(startDate))
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
        List<String> timesOff = this.timeRepository.findTimesOffTypeInBetween(startDate, endDate);
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
        reservations = this.reservationService.findByStartTime(startDate);
        numAvailableTrainers = numAvailableTrainers - reservations.size();

        if (numAvailableTrainers == 0)
            throw new InvalidReservationException("Questo orario è già stato prenotato");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/book/{customerId}")
    @Transactional
    ResponseEntity<ReservationResource> book(@PathVariable Long customerId,
                                             @RequestParam("date")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm") Date startTime) {

        logger.info("Checking whether time is past");
        if (checkDateBeforeToday(startTime)) throw new InvalidReservationException("Data non valida");

        logger.info("Getting customer by id");
        Customer c = this.customerService.findById(customerId);
        logger.info("Getting current training bundle");

        List<ATrainingBundle> currentTrainingBundles = c.getCurrentTrainingBundles();
        if (currentTrainingBundles.size() == 0) {
            throw new InvalidReservationException("Non hai più pacchetti a disposizione");
        }

        logger.info("Getting current training bundle");
        ATrainingBundle trainingBundle = currentTrainingBundles.get(0);
        Date endTime = DateUtils.addHours(startTime, 1);
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
    ResponseEntity<ReservationResource> delete(@PathVariable Long reservationId,
                                               @RequestParam(value = "type", defaultValue = "customer") String type,
                                               Principal principal) {
        Reservation res = deleteReservation(reservationId, principal);

        if (!type.equals("customer")) {
            String recipientAddress = res.getUser().getEmail();
            String message = "Ci dispiace informarla che per questioni tecniche la sua prenotazione è stata eliminata. " +
                    "La ringraziamo per la comprensione.";
            MailSenderUtility.sendEmail(this.mailSender, "Prenotazione eliminata", message, recipientAddress);
        }
        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }


    @GetMapping
    ResponseEntity<List<ReservationResource>> getReservations(@RequestParam(value = "id", required = false) Long id,
                                                              @RequestParam(value = "endDay")
                                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                      Date endDay,
                                                              @RequestParam(value = "startDay")
                                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm")
                                                                      Date startDay) {
        List<Reservation> res = this.reservationService
                .findByStartTimeAndEndTimeAndId(Optional.ofNullable(id), startDay, endDay);
        return ResponseEntity.ok(new ReservationAssembler().toResources(res));
    }

    @GetMapping(path="/complete/{sessionId}")
    @ResponseBody
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
    ResponseEntity<ReservationResource> confirm(@PathVariable(value = "reservationId") Long reservationId) {
        logger.info("confirming session");
        Reservation res = this.reservationService.findById(reservationId);
        res.setConfirmed(true);
        res = this.reservationService.save(res);
        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }

    /*
    @GetMapping(path = "/reservation/confirm/{reservationId}")
    ResponseEntity<ReservationResource> book(@PathVariable Long reservationId,
                                             Principal principal) {
        Reservation a = this.reservationService.findById(reservationId);


        String trainerEmail = a.getTrainer().getEmail();
        String authEmail = principal.getName();

        if (!trainerEmail.equals(authEmail))
            throw new InvalidTrainerException(trainerEmail, authEmail);

        a.setConfirmed(true);

        a = this.reservationService.save(a);

        return ResponseEntity.ok(new ReservationAssembler().toResource(a));

    }*/


    @Bean
    public Jackson2ObjectMapperBuilder objectMapperBuilder() {
        return new Jackson2ObjectMapperBuilder() {
            public void configure(ObjectMapper objectMapper) {
                objectMapper.disable(SerializationFeature.FAIL_ON_UNWRAPPED_TYPE_IDENTIFIERS);
                objectMapper.registerSubtypes(PersonalTrainingBundleSpecification.class);
                objectMapper.registerSubtypes(PersonalTrainingBundle.class);
                super.configure(objectMapper);
            };
        };
    }


    @Component
    @Order(Ordered.HIGHEST_PRECEDENCE)
    public class RelProvider extends EvoInflectorRelProvider {
        @Override
        public String getCollectionResourceRelFor(final Class<?> type) {
            return super.getCollectionResourceRelFor(ATrainingBundleSpecification.class);
        }

        @Override
        public String getItemResourceRelFor(final Class<?> type) {
            return super.getItemResourceRelFor(ATrainingBundleSpecification.class);
        }

        @Override
        public boolean supports(final Class<?> delimiter) {
            return ATrainingBundleSpecification.class.isAssignableFrom(delimiter);
        }
    }

    private Reservation deleteReservation(@PathVariable Long reservationId, Principal principal) {
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
        return DateUtils.addHours(date, -this.reservationBeforeHours).before(new Date());
    }

    private boolean checkDateBeforeToday(@DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm")
                                         @RequestParam("date") Date date) {
        return date.before(new Date());
    }

    @Configuration
    @Scope(value = ConfigurableBeanFactory.SCOPE_SINGLETON)
    public class TrainingTypesMapper {

        private Map<String, String> mapper;

        public TrainingTypesMapper () {
            this.mapper = new HashMap<>();
            this.mapper.put("P", PersonalTrainingBundle.class.getSimpleName());
        }

        public String getTrainingClass(String type) {
            return mapper.get(type);
        }
    }
}
