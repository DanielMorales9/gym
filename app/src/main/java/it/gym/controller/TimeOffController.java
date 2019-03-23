package it.gym.controller;

import it.gym.exception.InvalidTimesOff;
import it.gym.exception.TimesOffNotFound;
import it.gym.exception.UnAuthorizedException;
import it.gym.hateoas.TimeOffAssembler;
import it.gym.hateoas.TimeOffResource;
import it.gym.model.*;
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
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@RestController
@PropertySource("application.yml")
@RequestMapping("/timesOff")
public class TimeOffController {

    private final static Logger logger = LoggerFactory.getLogger(TimeOffController.class);

    private final ReservationRepository reservationRepository;
    private final TimeOffRepository timeRepository;
    private final UserService userService;
    private final TrainerRepository trainerRepository;
    private final ReservationRepository reservationService;
    private final TimeOffService timeOffService;
    private final JavaMailSender mailSender;
    private final SimpMessagingTemplate template;

    @Autowired
    public TimeOffController(SimpMessagingTemplate template, JavaMailSender mailSender,
                             ReservationRepository reservationRepository, TimeOffRepository timeRepository,
                             UserService userService, TrainerRepository trainerRepository,
                             ReservationRepository reservationService, TimeOffService timeOffService) {
        this.template = template;
        this.mailSender = mailSender;
        this.reservationRepository = reservationRepository;
        this.timeRepository = timeRepository;
        this.userService = userService;
        this.trainerRepository = trainerRepository;
        this.reservationService = reservationService;
        this.timeOffService = timeOffService;
    }


    @GetMapping(path = "/checkAvailabilityAndEnablement")
    @Transactional
    ResponseEntity<String> checkAvailableDay(@RequestParam("startTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                             @RequestParam("endTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                             @RequestParam("type")
                                                     String type) {

        if (checkDate(startTime)) throw new InvalidTimesOff("Data non valida");

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    throw new InvalidTimesOff("Non è possibile chiudere la palestra con delle prenotazioni attive.");
                logger.info("checking other timesOff");
                if (checkingOtherAdminTimesOff(startTime, endTime))
                    throw new InvalidTimesOff("Hai già effettuato una chiusura");
                break;
            case "trainer":
                logger.info("checking whether there are trainers available");
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    throw new InvalidTimesOff("Non è possibile prendere le ferie in questo orario.");
                break;
            default:
                throw new InvalidTimesOff("Non puoi prendere un giorno di ferie");
        }

        logger.info("Everything went fine");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/checkChange", produces = "text/plain")
    @Transactional
    ResponseEntity<String> checkChange(@RequestParam("startTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                             @RequestParam("endTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date endTime,
                                             @RequestParam("type")
                                                     String type) {

        if (checkDate(startTime)) throw new InvalidTimesOff("Data non valida");

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    throw new InvalidTimesOff("Non è possibile chiudere la palestra con delle prenotazioni attive.");
                break;
            case "trainer":
                logger.info("checking whether there are trainers available");
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    throw new InvalidTimesOff("Non è possibile prendere le ferie in questo orario.");
                break;
            default:
                throw new UnAuthorizedException("Non sei autorizzato a compiere questa azione.");
        }

        logger.info("Everything went fine");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    @GetMapping(path = "/book/{id}")
    @Transactional
    ResponseEntity<TimeOffResource> book(@PathVariable Long id,
                                         @RequestParam("name") String name,
                                         @RequestParam("startTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
                                                 Date startTime,
                                         @RequestParam("endTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
                                                 Date endTime,
                                         @RequestParam("type") String type) {
        logger.info("booking time off");
        logger.info(startTime.toString());
        if (checkDateBeforeToday(startTime)) throw new InvalidTimesOff("Data non valida");
        String message;
        DateFormat dateFormat = new SimpleDateFormat("dd-MM hh");
        String strDate = dateFormat.format(startTime);
        String endDate = dateFormat.format(endTime);
        AUser user = this.userService.findById(id);
        String channel;
        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime)) {
                    throw new InvalidTimesOff("Ci sono delle prenotazioni attive.");
                }
                message = "Chiusura per " + name + " dalle " + strDate + " alle " + endDate;
                break;
            case "trainer":
                if (checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime))
                    throw new InvalidTimesOff("Ci sono delle prenotazioni attive.");
                message = "Ferie di " + user.getLastName() + "per " + name + " dalle " + strDate + " alle " + endDate;
                break;
            default:
                throw new UnAuthorizedException("Non sei autorizzato a compiere questa azione.");
        }

        logger.info(user.toString());

        TimeOff timeOff = new TimeOff(name, type, user, startTime, endTime);
        logger.info(timeOff.toString());

        timeOff = this.timeRepository.save(timeOff);

        channel = "notifications";
        dateFormat = new SimpleDateFormat("MM-dd-yyyy");
        String action = "/home/calendar?date="+dateFormat.format(startTime)+"&view=day";
        Notification notification = new Notification("calendar", message, action);
        notifyChannel("/"+channel, notification);
        logger.info(timeOff.toString());

        return ResponseEntity.ok(new TimeOffAssembler().toResource(timeOff));

    }

    private void notifyChannel(String channel, Notification notification) {
        template.convertAndSend(channel, notification);
    }

    @GetMapping(path = "/change/{id}")
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
        if (checkDateBeforeToday(startTime)) throw new InvalidTimesOff("Data non valida");

        TimeOff time = this.timeOffService.findById(id);

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                if (checkingAvailabilityAdminTimeOff(startTime, endTime))
                    throw new InvalidTimesOff("Ci sono delle prenotazioni attive");
                break;
            case "trainer":
                logger.info("checking whether there are trainers");
                if (checkingAvailabilityTrainerTimeOff(Optional.of(id), startTime, endTime))
                    throw new InvalidTimesOff("Ci sono delle prenotazioni attive");
                break;
            default:
                throw new UnAuthorizedException("Non sei autorizzato a compiere questa azione.");
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
            throw new UnAuthorizedException("Non sei autorizzato a compiere questa azione.");


        if (!type.equals("admin")) {
            String recipientAddress = time.getUser().getEmail();
            String message = "Ci dispiace informarla che per questioni tecniche le sue ferie sono state eliminate. " +
                    "La ringraziamo per la comprensione.";
            MailSenderUtility.sendEmail(this.mailSender, "Ferie eliminate", message, recipientAddress);
        }

        this.timeRepository.delete(time);
        return ResponseEntity.ok(new TimeOffAssembler().toResource(time));
    }

    @GetMapping
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


    private boolean checkingAvailabilityTrainerTimeOff(Optional<Long> id,
                                                       @DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm",
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

    private boolean checkDate(@DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm", iso = DateTimeFormat.ISO.DATE_TIME)
                              @RequestParam("startTime") Date startTime) {
        logger.info("checking availability and enablement");
        logger.info("checking whether the date is before today");
        logger.info(startTime.toString());
        return checkDateBeforeToday(startTime);
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
            iso = DateTimeFormat.ISO.DATE_TIME) @RequestParam("startTime") Date date) {
        return date.before(new Date());
    }
}
