package it.goodfellas.controller;

import it.goodfellas.exception.POJONotFoundException;
import it.goodfellas.hateoas.TimeOffAssembler;
import it.goodfellas.hateoas.TimeOffResource;
import it.goodfellas.model.AUser;
import it.goodfellas.model.Admin;
import it.goodfellas.model.Reservation;
import it.goodfellas.model.TimeOff;
import it.goodfellas.repository.ReservationRepository;
import it.goodfellas.repository.TimeOffRepository;
import it.goodfellas.repository.TrainerRepository;
import it.goodfellas.service.TimeOffService;
import it.goodfellas.service.UserService;
import it.goodfellas.utility.MailSenderUtility;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.PropertySource;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@PropertySource("application.yml")
public class TimeOffController {

    private final static Logger logger = LoggerFactory.getLogger(TimeOffController.class);

    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private TimeOffRepository timeRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private TrainerRepository trainerRepository;
    @Autowired
    private ReservationRepository reservationService;
    @Autowired
    private TimeOffService timeOffService;
    @Autowired
    private JavaMailSender mailSender;


    @GetMapping(path = "/timesOff/checkAvailabilityAndEnablement",
            produces = "text/plain")
    @Transactional
    ResponseEntity<String> checkAvailableDay(@RequestParam("startTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                             @RequestParam("endTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                             @RequestParam("type")
                                                     String type) {

        if (checkDate(startTime)) return new ResponseEntity<>("Data non valida", HttpStatus.NOT_ACCEPTABLE);

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    return new ResponseEntity<>("Non è possibile chiudere la palestra " +
                            "con delle prenotazioni attive.", HttpStatus.NOT_ACCEPTABLE);
                logger.info("checking other timesOff");
                if (checkingOtherAdminTimesOff(startTime, endTime))
                    return new ResponseEntity<>("Hai già effettuato una chiusura.",
                            HttpStatus.NOT_ACCEPTABLE);
                break;
            case "trainer":
                logger.info("checking whether there are trainers available");
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    return new ResponseEntity<String>("Non è possibile prendere le ferie in questo orario.",
                            HttpStatus.NOT_ACCEPTABLE);
                break;
            default:
                return new ResponseEntity<String>("Non puoi prendere un giorno di ferie",
                        HttpStatus.BAD_REQUEST);
        }

        logger.info("Everything went fine");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/timesOff/checkChange",
            produces = "text/plain")
    @Transactional
    ResponseEntity<String> checkChange(@RequestParam("startTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                             @RequestParam("endTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                             @RequestParam("type")
                                                     String type) {

        if (checkDate(startTime)) return new ResponseEntity<>("Data non valida", HttpStatus.NOT_ACCEPTABLE);

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    return new ResponseEntity<>("Non è possibile chiudere la palestra " +
                            "con delle prenotazioni attive.", HttpStatus.NOT_ACCEPTABLE);
                break;
            case "trainer":
                logger.info("checking whether there are trainers available");
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    return new ResponseEntity<String>("Non è possibile prendere le ferie in questo orario.",
                            HttpStatus.NOT_ACCEPTABLE);
                break;
            default:
                return new ResponseEntity<String>("Non puoi prendere un giorno di ferie",
                        HttpStatus.BAD_REQUEST);
        }

        logger.info("Everything went fine");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private boolean checkDate(@DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam("startTime") Date startTime) {
        logger.info("checking availability and enablement");
        logger.info("checking whether the date is before today");
        logger.info(startTime.toString());
        if (checkDateBeforeToday(startTime))
            return true;
        return false;
    }

    private boolean checkingOtherAdminTimesOff(Date startTime, Date endTime) {
        List<TimeOff> timesOff = this.timeRepository.findOverlappingTimesOffByType(startTime, endTime, "admin");
        logger.info(timesOff.toString());
        logger.info(String.valueOf(timesOff.size()));
        return timesOff.size() > 0;
    }

    private boolean checkingAvailabilityAdminTimeOff(Date startTime, Date endTime) {
        Integer nReservations = this.reservationRepository.countByInterval(startTime, endTime);
        return nReservations > 0;
    }

    private boolean checkDateBeforeToday(@DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm",
            iso = DateTimeFormat.ISO.DATE_TIME )
                                         @RequestParam("startTime") Date date) {
        return date.before(new Date());
    }


    @GetMapping(path = "/timesOff/book/{id}")
    @Transactional
    ResponseEntity<TimeOffResource> book(@PathVariable Long id,
                                         @RequestParam("name") String name,
                                         @RequestParam("startTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                 iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                         @RequestParam("endTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                 iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                         @RequestParam("type")
                                                 String type) {
        logger.info("booking time off");
        logger.info(startTime.toString());
        if (checkDateBeforeToday(startTime)) return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                break;
            case "trainer":
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                break;
            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }


        AUser user = this.userService.findById(id);
        logger.info(user.toString());

        TimeOff timeOff = new TimeOff(name, type, user, startTime, endTime);
        logger.info(timeOff.toString());

        timeOff = this.timeRepository.save(timeOff);
        logger.info(timeOff.toString());

        return ResponseEntity.ok(new TimeOffAssembler().toResource(timeOff));

    }

    private boolean checkingAvailabilityTrainerTimeOff(Optional<Long> id,
                                                       @DateTimeFormat(
                                                               pattern = "dd-MM-yyyy_HH:mm",
                                                               iso = DateTimeFormat.ISO.DATE_TIME)
                                                       @RequestParam("startTime") Date startTime,
                                                       @DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm",
                                                               iso = DateTimeFormat.ISO.DATE_TIME)
                                                       @RequestParam("endTime") Date endTime) {
        logger.info("checking whether there are trainers");
        // TODO non funziona, ricontrollare
        Long numTrainers = this.trainerRepository.countAllTrainer();
        List<Reservation> reservations = this.reservationService.findByInterval(startTime, endTime);
        reservations.sort(Comparator.comparing(Reservation::getStartTime));
        logger.info(reservations.toString());

        Stream<TimeOff> streamTimesOff = this.timeRepository
                .findOverlappingTimesOffByType(startTime, endTime, "trainer").parallelStream();
        if (id.isPresent()) {
            Long timeId = id.get();
            streamTimesOff = streamTimesOff.filter(timeOff -> !timeOff.getId().equals(timeId));
        }
        List<TimeOff> timesOff = streamTimesOff
                .sorted(Comparator.comparing(TimeOff::getStartTime))
                .collect(Collectors.toList());
        logger.info(timesOff.toString());

        // TODO high complexity
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

    @GetMapping(path = "/timesOff/change/{id}")
    @Transactional
    ResponseEntity<TimeOffResource> change(@PathVariable Long id,
                                         @RequestParam("name") String name,
                                         @RequestParam("startTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                 iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                         @RequestParam("endTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                 iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                           @RequestParam("type")
                                                   String type) {

        logger.info("booking time off");
        logger.info(startTime.toString());
        if (checkDateBeforeToday(startTime)) return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);

        TimeOff time = this.timeOffService.findById(id);

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                break;
            case "trainer":
                logger.info("checking whether there are trainers");
                if (checkingAvailabilityTrainerTimeOff(Optional.of(id), startTime, endTime))
                    return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                break;
            default:
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        time.setName(name);
        time.setStartTime(startTime);
        time.setEndTime(endTime);

        time = this.timeRepository.save(time);
        logger.info(time.toString());

        return ResponseEntity.ok(new TimeOffAssembler().toResource(time));

    }

    @DeleteMapping(path = "/timesOff/{timesId}")
    @Transactional
    ResponseEntity<TimeOffResource> delete(@PathVariable Long timesId,
                                           @RequestParam(value = "type", defaultValue = "admin") String type,
                                           Principal principal) {
        Optional<TimeOff> res = this.timeRepository.findById(timesId);

        if (!res.isPresent() )
            throw new POJONotFoundException("TimeOff", timesId);

        TimeOff time = res.get();
        AUser user = this.userService.findByEmail(principal.getName());
        logger.info(user.toString());
        logger.info(time.getUser().toString());
        logger.info((user instanceof Admin) ? "true" : "false");
        if (!time.getUser().equals(user) && !(user instanceof Admin))
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);


        if (!type.equals("admin")) {
            String recipientAddress = time.getUser().getEmail();
            String message = "Ci dispiace informarla che per questioni tecniche le sue ferie sono state eliminate. " +
                    "La ringraziamo per la comprensione.";
            MailSenderUtility.sendEmail(this.mailSender, "Ferie eliminate", message, recipientAddress);
        }

        this.timeRepository.delete(time);
        return ResponseEntity.ok(new TimeOffAssembler().toResource(time));
    }

    @GetMapping(path="/timesOff")
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
        logger.info("# of Times off " + res.size());
        return ResponseEntity.ok(new TimeOffAssembler().toResources(res));
    }

}
