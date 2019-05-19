package it.gym.controller;

import it.gym.exception.GymNotFoundException;
import it.gym.exception.InvalidTimesOff;
import it.gym.exception.TimesOffNotFound;
import it.gym.exception.UnAuthorizedException;
import it.gym.hateoas.TimeOffAssembler;
import it.gym.hateoas.TimeOffResource;
import it.gym.model.*;
import it.gym.repository.GymRepository;
import it.gym.repository.ReservationRepository;
import it.gym.repository.TimeOffRepository;
import it.gym.repository.TrainerRepository;
import it.gym.service.TimeOffService;
import it.gym.service.UserService;
import it.gym.utility.MailSenderUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
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
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;


@RepositoryRestController
@PropertySource("application.yml")
@RequestMapping("/timesOff")
@PreAuthorize("hasAnyAuthority('ADMIN', 'TRAINER')")
public class TimeOffController {

    private final ReservationRepository reservationRepository;
    private final GymRepository gymRepository;
    private final TimeOffRepository timeRepository;
    private final UserService userService;
    private final TrainerRepository trainerRepository;
    private final ReservationRepository reservationService;
    private final TimeOffService timeOffService;
    private final JavaMailSender mailSender;

    private static final Logger logger = LoggerFactory.getLogger(TimeOffController.class);
    private static final String ADMIN_TYPE = "admin";
    private static final String TRAINER_TYPE = "trainer";
    private static final String COUNTING_NUMBER_OF_RESERVATIONS_LOG = "Counting number of reservations";
    private static final String CHECKING_TRAINERS_AVAILABLE_LOG = "Checking whether there are trainers available";
    private static final String NOT_AUTHORIZED_EX = "Non è possibile chiudere la palestra con delle prenotazioni attive.";
    private static final String ACTIVE_RESERVATION_EX_MESSAGE = "Ci sono delle prenotazioni attive.";
    private static final String TIME_OFF_ALREADY_BOOKED_EX = "Hai già effettuato una chiusura";
    private static final String CANNOT_TAKE_TIME_OFF_EX = "Non puoi prendere un giorno di ferie";
    private static final String INVALID_HOUR_TIMEOFF_EX = "Non è possibile prendere le ferie in questo orario.";
    private static final String DELETE_MAIL_MESSAGE =
            "Ci dispiace informarla che per questioni tecniche le sue " +
                    "ferie sono state eliminate. La ringraziamo per la comprensione.";

    @Autowired
    public TimeOffController(JavaMailSender mailSender,
                             ReservationRepository reservationRepository,
                             GymRepository gymRepository,
                             TimeOffRepository timeRepository,
                             UserService userService,
                             TrainerRepository trainerRepository,
                             ReservationRepository reservationService,
                             TimeOffService timeOffService) {
        this.mailSender = mailSender;
        this.reservationRepository = reservationRepository;
        this.gymRepository = gymRepository;
        this.timeRepository = timeRepository;
        this.userService = userService;
        this.trainerRepository = trainerRepository;
        this.reservationService = reservationService;
        this.timeOffService = timeOffService;
    }


    @GetMapping(path = "/checkAvailabilityAndEnablement")
    @Transactional
    ResponseEntity<String> checkAvailableTime(@RequestParam("gymId") Long gymId,
                                              @RequestParam("startTime")
                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                      iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                              @RequestParam("endTime")
                                              @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                      iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                              @RequestParam("type")
                                                      String type) {
        logger.info("checkAvailabilityAndEnablement");
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        isDateValid(gymId, startTime, endTime);

        switch (type) {
            case ADMIN_TYPE:
                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    throw new InvalidTimesOff(NOT_AUTHORIZED_EX);
                if (checkingOtherAdminTimesOff(startTime, endTime))
                    throw new InvalidTimesOff(TIME_OFF_ALREADY_BOOKED_EX);
                break;
            case TRAINER_TYPE:
                logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    throw new InvalidTimesOff(INVALID_HOUR_TIMEOFF_EX);
                break;
            default:
                throw new InvalidTimesOff(CANNOT_TAKE_TIME_OFF_EX);
        }

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/checkChange")
    @Transactional
    ResponseEntity<String> checkChange(@RequestParam("gymId") Long gymId,
                                       @RequestParam("startTime")
                                       @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                               iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                       @RequestParam("endTime")
                                       @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                               iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                       @RequestParam("type")
                                               String type) {
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        isDateValid(gymId, startTime, endTime);

        switch (type) {
            case ADMIN_TYPE:
                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    throw new InvalidTimesOff(NOT_AUTHORIZED_EX);
                break;
            case TRAINER_TYPE:
                logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    throw new InvalidTimesOff(INVALID_HOUR_TIMEOFF_EX);
                break;
            default:
                throw new UnAuthorizedException(NOT_AUTHORIZED_EX);
        }

        logger.info("Everything went fine");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/book/{id}")
    @Transactional
    ResponseEntity<TimeOffResource> book(@PathVariable Long id,
                                         @RequestParam("gymId") Long gymId,
                                         @RequestParam("name") String name,
                                         @RequestParam("startTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
                                                 Date startTime,
                                         @RequestParam("endTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
                                                 Date endTime,
                                         @RequestParam("type") String type) {
        logger.info("Booking time off");
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        isDateValid(gymId, startTime, endTime);

        AUser user = this.userService.findById(id);
        switch (type) {
            case ADMIN_TYPE:
                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                if (checkingAvailabilityAdminTimeOff(startTime, endTime)) {
                    throw new InvalidTimesOff(ACTIVE_RESERVATION_EX_MESSAGE);
                }
                break;
            case TRAINER_TYPE:
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    throw new InvalidTimesOff(ACTIVE_RESERVATION_EX_MESSAGE);
                break;
            default:
                throw new UnAuthorizedException(NOT_AUTHORIZED_EX);
        }

        logger.info(user.toString());

        TimeOff timeOff = new TimeOff(name, type, user, startTime, endTime);
        logger.info(timeOff.toString());

        timeOff = this.timeRepository.save(timeOff);

        logger.info(timeOff.toString());

        return ResponseEntity.ok(new TimeOffAssembler().toResource(timeOff));

    }



    @GetMapping(path = "/change/{id}")
    @Transactional
    ResponseEntity<TimeOffResource> change(@PathVariable Long id,
                                           @RequestParam("name") String name,
                                           @RequestParam("gymId") Long gymId,
                                           @RequestParam("startTime")
                                           @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                   iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                           @RequestParam("endTime")
                                           @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                   iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                           @RequestParam("type")
                                                   String type) {
        logger.info(startTime.toString());
        logger.info(endTime.toString());

        isDateValid(gymId, startTime, endTime);

        TimeOff time = this.timeOffService.findById(id);

        switch (type) {
            case ADMIN_TYPE:
                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    throw new InvalidTimesOff(ACTIVE_RESERVATION_EX_MESSAGE);
                break;
            case TRAINER_TYPE:
                logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
                if (checkingAvailabilityTrainerTimeOff(Optional.of(id), startTime, endTime))
                    throw new InvalidTimesOff(ACTIVE_RESERVATION_EX_MESSAGE);
                break;
            default:
                throw new UnAuthorizedException(NOT_AUTHORIZED_EX);
        }

        time.setName(name);
        time.setStartTime(startTime);
        time.setEndTime(endTime);

        time = this.timeRepository.save(time);
        logger.info(time.toString());

        return ResponseEntity.ok(new TimeOffAssembler().toResource(time));

    }

    @DeleteMapping(path = "/{timesId}")
    @Transactional
    ResponseEntity<TimeOffResource> delete(@PathVariable Long timesId,
                                           @RequestParam(value = "type", defaultValue = "admin") String type,
                                           Principal principal) {
        Optional<TimeOff> res = this.timeRepository.findById(timesId);

        if (!res.isPresent() )
            throw new TimesOffNotFound(String.format("Le ferie (%d) non sono state trovate", timesId));

        TimeOff time = res.get();
        AUser user = this.userService.findByEmail(principal.getName());
        logger.info(user.toString());
        logger.info(time.getUser().toString());
        if (!time.getUser().equals(user) && !(user instanceof Admin))
            throw new UnAuthorizedException(NOT_AUTHORIZED_EX);


        if (!type.equals(ADMIN_TYPE)) {
            String recipientAddress = time.getUser().getEmail();
            MailSenderUtility.sendEmail(this.mailSender, "Ferie eliminate", DELETE_MAIL_MESSAGE, recipientAddress);
        }

        this.timeRepository.delete(time);
        return ResponseEntity.ok(new TimeOffAssembler().toResource(time));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    ResponseEntity<List<TimeOffResource>> getTimesOff(@RequestParam(value = "id", required = false)
                                                              Long id,
                                                      @RequestParam(value = "type", required = false)
                                                              String type,
                                                      @RequestParam(value = "startTime")
                                                      @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                              iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                      @RequestParam(value = "endTime")
                                                      @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                              iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<TimeOff> res = this.timeOffService.findByStartTimeAndEndTimeAndIdAndType(Optional.ofNullable(id),
                Optional.ofNullable(type), startTime, endTime);
        logger.info(String.format("# of Times off %d", res.size()));
        return ResponseEntity.ok(new TimeOffAssembler().toResources(res));
    }


    private boolean checkingAvailabilityTrainerTimeOff(Optional<Long> id,
                                                       Date startTime,
                                                       Date endTime) {
        logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
        // TODO non funziona, ricontrollare
        Long numTrainers = this.trainerRepository.countAllTrainer();
        List<Reservation> reservations = this.reservationService.findByInterval(startTime, endTime);
        reservations.sort(Comparator.comparing(Reservation::getStartTime));
        logger.info(reservations.toString());

        Stream<TimeOff> streamTimesOff = this.timeRepository
                .findOverlappingTimesOffByType(startTime, endTime, TRAINER_TYPE).parallelStream();
        if (id.isPresent()) {
            Long timeId = id.get();
            streamTimesOff = streamTimesOff.filter(timeOff -> !timeOff.getId().equals(timeId));
        }
        List<TimeOff> timesOff = streamTimesOff
                .sorted(Comparator.comparing(TimeOff::getStartTime))
                .collect(Collectors.toList());
        logger.info(timesOff.toString());

        // TODO high computational complexity
        long numAvailableTrainers;
        for (Reservation r: reservations) {
            numAvailableTrainers = numTrainers - 1;
            for (TimeOff time: timesOff) {
                if (time.getStartTime().compareTo(r.getStartTime()) <= 0
                        && time.getEndTime().compareTo(r.getEndTime()) >= 0) {
                    numAvailableTrainers--;
                }
                else break;
            }
            if (numAvailableTrainers <= 0)
                return true;
        }
        return false;
    }

    private boolean checkingOtherAdminTimesOff(Date startTime, Date endTime) {
        List<TimeOff> timesOff = this.timeRepository.findOverlappingTimesOffByType(startTime, endTime, ADMIN_TYPE);
        logger.info(timesOff.toString());
        logger.info(String.valueOf(timesOff.size()));
        return !timesOff.isEmpty();
    }

    private boolean checkingAvailabilityAdminTimeOff(Date startTime, Date endTime) {
        Integer nReservations = this.reservationRepository.countByInterval(startTime, endTime);
        return nReservations > 0;
    }

    private void isDateValid(Long gymId, Date start, Date end) {
        Optional<Gym> opt = this.gymRepository.findById(gymId);
        if (!opt.isPresent())
            throw new GymNotFoundException(gymId);
        Gym gym = opt.get();
        if (!gym.isValidDate(start, end)) throw new InvalidTimesOff("Data non valida");
    }

}
