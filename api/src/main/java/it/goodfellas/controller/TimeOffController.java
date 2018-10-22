package it.goodfellas.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import it.goodfellas.exception.AvailabilityCheckException;
import it.goodfellas.exception.NotAllowedException;
import it.goodfellas.exception.POJONotFoundException;
import it.goodfellas.hateoas.*;
import it.goodfellas.model.*;
import it.goodfellas.repository.*;
import it.goodfellas.service.AdminService;
import it.goodfellas.service.CustomerService;
import it.goodfellas.service.ReservationService;
import it.goodfellas.service.TrainingBundleService;
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
    private AdminService adminService;
    @Autowired
    private ReservationRepository reservationRepository;
    @Autowired
    private TimeOffRepository timeRepository;
    @Autowired
    private UserRepository userRepository;


    @GetMapping(path = "/timesOff/checkAvailabilityAndEnablement",
            produces = "text/plain")
    @Transactional
    ResponseEntity<String> checkAvailableDay(@RequestParam("startTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                             @RequestParam("endTime")
                                             @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                     iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        
        logger.info("checking availability and enablement");
        logger.info("checking whether the date is before today");
        logger.info(startTime.toString());
        if (checkDateBeforeToday(startTime))
            return new ResponseEntity<>("Data non valida", HttpStatus.NOT_ACCEPTABLE);

        logger.info("counting number of reservations");

        Integer nReservations = this.reservationRepository.countByInterval(startTime, endTime);
        if (nReservations > 0)
            return new ResponseEntity<>("Non è possibile chiudere " +
                    "la palestra con delle prenotazioni attive.", HttpStatus.NOT_ACCEPTABLE);
        logger.info("Everything went fine");

        return new ResponseEntity<>(HttpStatus.OK);
    }

    private boolean checkDateBeforeToday(@DateTimeFormat(pattern = "dd-MM-yyyy_HH:mm",
            iso = DateTimeFormat.ISO.DATE_TIME )
                                         @RequestParam("startTime") Date date) {
        return date.before(new Date());
    }


    @GetMapping(path = "/timesOff/book/{adminId}")
    @Transactional
    ResponseEntity<TimeOffResource> book(@PathVariable Long adminId,
                                         @RequestParam("name") String name,
                                         @RequestParam("startTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                 iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                         @RequestParam("endTime")
                                         @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                 iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        logger.info("booking time off");
        logger.info(startTime.toString());
        if (checkDateBeforeToday(startTime)) return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);

        Integer nReservations = this.reservationRepository.countByInterval(startTime, endTime);
        logger.info("# Reservations " + nReservations);
        if (nReservations > 0)
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);

        Admin admin = this.adminService.findById(adminId);
        logger.info(admin.toString());

        TimeOff timeOff = new TimeOff(name, "admin", admin, startTime, endTime);
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
        AUser user = this.userRepository.findByEmail(principal.getName());
        if (!time.getUser().equals(user) || !(user instanceof Admin))
            return new ResponseEntity<>(HttpStatus.NOT_ACCEPTABLE);

        this.timeRepository.delete(time);

        return ResponseEntity.ok(new TimeOffAssembler().toResource(time));
    }

    @GetMapping(path="/timesOff")
    ResponseEntity<List<TimeOffResource>> getTimesOff(@RequestParam(value = "startTime")
                                                      @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                              iso = DateTimeFormat.ISO.DATE_TIME) Date startTime,
                                                      @RequestParam(value = "endTime")
                                                      @DateTimeFormat(pattern="dd-MM-yyyy_HH:mm",
                                                              iso = DateTimeFormat.ISO.DATE_TIME) Date endTime) {
        List<TimeOff> res = this.timeRepository.findAllTimesOff(startTime, endTime);
        logger.info("# of Times off " + res.size());
        logger.info(startTime.toString());
        logger.info(endTime.toString());
        return ResponseEntity.ok(new TimeOffAssembler().toResources(res));
    }
    /*
    @GetMapping(path="/reservations/complete/{sessionId}")
    @ResponseBody
    ResponseEntity<TrainingSessionResource> complete(@PathVariable(value = "sessionId") Long sessionId) {
        ATrainingSession session = this.sessionRepository.findById(sessionId)
                .orElseThrow(() -> new POJONotFoundException("Sessione", sessionId));
        session.complete();
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
