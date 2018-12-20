package it.goodfellas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import it.goodfellas.exception.AvailabilityCheckException;
import it.goodfellas.exception.NotAllowedException;
import it.goodfellas.exception.POJONotFoundException;
import it.goodfellas.hateoas.*;
import it.goodfellas.model.*;
import it.goodfellas.repository.*;
import it.goodfellas.service.*;
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
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.*;
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

        logger.info("checking availability and enablement");
        logger.info("checking whether the date is before today");
        logger.info(startTime.toString());
        if (checkDateBeforeToday(startTime))
            return new ResponseEntity<>("Data non valida", HttpStatus.NOT_ACCEPTABLE);

        switch (type) {
            case "admin":
                logger.info("counting number of reservations");
                Integer nReservations = this.reservationRepository.countByInterval(startTime, endTime);
                if (nReservations > 0)
                    return new ResponseEntity<>("Non è possibile chiudere la palestra " +
                            "con delle prenotazioni attive.", HttpStatus.NOT_ACCEPTABLE);
                break;
            case "trainer":
                logger.info("checking whether there are trainers available");
                Long numTrainers = this.trainerRepository.countAllTrainer();
                Long numOffTrainers = this.timeRepository.findTimesOffInBetween(startTime, endTime)
                        .parallelStream()
                        .filter(t -> t.getType().equals("trainer"))
                        .count();
                long numAvailableTrainers = numTrainers - numOffTrainers;
                List<Reservation> reservations = this.reservationService.findByStartTime(startTime);
                numAvailableTrainers = numAvailableTrainers - reservations.size();
                if (numAvailableTrainers == 0)
                    return new ResponseEntity<String>("Sei l'unico Trainer disponibile in questo orario",
                            HttpStatus.NOT_ACCEPTABLE);
                break;
            default:
                return new ResponseEntity<String>("Non puoi prendere un giorno di ferie",
                        HttpStatus.BAD_REQUEST);
        }

        logger.info("Everything went fine");

        return new ResponseEntity<>(HttpStatus.OK);
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
                Integer nReservations = this.reservationRepository.countByInterval(startTime, endTime);
                if (nReservations > 0)
                    return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);
                break;
            case "trainer":
                logger.info("checking whether there are trainers");
                Long numTrainers = this.trainerRepository.countAllTrainer();
                Long numOffTrainers = this.timeRepository.findTimesOffInBetween(startTime, endTime)
                        .parallelStream()
                        .filter(t -> t.getType().equals("trainer"))
                        .count();
                long numAvailableTrainers = numTrainers - numOffTrainers;
                List<Reservation> reservations = this.reservationService.findByInterval(startTime, endTime);
                numAvailableTrainers = numAvailableTrainers - reservations.size();
                if (numAvailableTrainers == 0)
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

    @DeleteMapping(path = "/timesOff/{timesId}")
    @Transactional
    ResponseEntity<TimeOffResource> delete(@PathVariable Long timesId,
                                           Principal principal) {
        Optional<TimeOff> res = this.timeRepository.findById(timesId);

        if (!res.isPresent() )
            throw new POJONotFoundException("TimeOff", timesId);

        TimeOff time = res.get();
        AUser user = this.userService.findByEmail(principal.getName());
        if (!time.getUser().equals(user) || !(user instanceof Admin))
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);

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
    /*
    @GetMapping(path="/reservations/onComplete/{sessionId}")
    @ResponseBody
    ResponseEntity<TrainingSessionResource> onComplete(@PathVariable(value = "sessionId") Long sessionId) {
        ATrainingSession session = this.sessionRepository.findById(sessionId)
                .orElseThrow(() -> new POJONotFoundException("Sessione", sessionId));
        session.onComplete();
        return ResponseEntity.ok(new TrainingSessionAssembler().toResource(session));
    }


    @GetMapping(path="/reservations/confirm/{reservationId}")
    @ResponseBody
    ResponseEntity<ReservationResource> confirm(@PathVariable(value = "reservationId") Long reservationId) {
        Reservation res = this.reservationService.findById(reservationId);
        res.setConfirmed(true);
        res = this.reservationService.save(res);
        return ResponseEntity.ok(new ReservationAssembler().toResource(res));
    }
    */

}
