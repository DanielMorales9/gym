package it.gym.facade;

import it.gym.exception.InvalidTimesOff;
import it.gym.exception.UnAuthorizedException;
import it.gym.model.AUser;
import it.gym.model.Admin;
import it.gym.model.Reservation;
import it.gym.model.TimeOff;
import it.gym.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Component
@Transactional
public class TimeOffFacade {

    private static final String TIME_OFF_ALREADY_BOOKED_EX = "Hai già effettuato una chiusura";
    private static final String CANNOT_TAKE_TIME_OFF_EX = "Non puoi prendere un giorno di ferie";
    private static final String ADMIN = "admin";
    private static final String TRAINER = "trainer";
    private static final String COUNTING_NUMBER_OF_RESERVATIONS_LOG = "Counting number of reservations";
    private static final String CHECKING_TRAINERS_AVAILABLE_LOG = "Checking whether there are trainers available";
    private static final String NOT_AUTHORIZED_EX = "Non è possibile chiudere la palestra con delle prenotazioni attive.";
    private static final String INVALID_HOUR_TIMEOFF_EX = "Non è possibile prendere le ferie in questo orario.";
    private static final String DELETE_MAIL_MESSAGE =
            "Ci dispiace informarla che per questioni tecniche le sue " +
                    "ferie sono state eliminate. La ringraziamo per la comprensione.";

    private static final Logger logger = LoggerFactory.getLogger(TimeOffFacade.class);

    @Autowired private GymService gymService;
    @Autowired private ReservationService reservationService;
    @Autowired private TrainerService trainerService;
    @Autowired private UserService userService;
    @Autowired private TimeOffService service;
    @Autowired private MailService mailService;

    public void isAvailable(Long gymId, Date startTime, Date endTime, String type) {

        gymService.isValidInterval(startTime, endTime);

        gymService.isWithinWorkingHours(gymId, startTime, endTime);

        switch (type) {
            case ADMIN:

                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                isReservationWithinInterval(startTime, endTime);
                isDoublyBooked(startTime, endTime, ADMIN);
                break;

            case TRAINER:

                logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
                checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime);
                break;

            default:
                throw new InvalidTimesOff(CANNOT_TAKE_TIME_OFF_EX);
        }
    }

    public void checkChange(Long gymId, Date startTime, Date endTime, String type) {

        gymService.isValidInterval(startTime, endTime);

        gymService.isWithinWorkingHours(gymId, startTime, endTime);

        switch (type) {
            case ADMIN:
                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                isReservationWithinInterval(startTime, endTime);
                break;
            case TRAINER:
                logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
                checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime);
                break;
            default:
                throw new UnAuthorizedException(NOT_AUTHORIZED_EX);
        }
    }

    public TimeOff book(Long gymId, Long id, String name, Date startTime, Date endTime, String type) {
        gymService.isValidInterval(startTime, endTime);

        gymService.isWithinWorkingHours(gymId, startTime, endTime);

        AUser user = this.userService.findById(id);
        switch (type) {
            case ADMIN:
                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                isReservationWithinInterval(startTime, endTime);
                break;
            case TRAINER:
                checkingAvailabilityTrainerTimeOff(Optional.empty(), startTime, endTime);
                break;
            default:
                throw new UnAuthorizedException(NOT_AUTHORIZED_EX);
        }

        TimeOff timeOff = new TimeOff(name, type, user, startTime, endTime);

        timeOff = this.service.save(timeOff);

        logger.info(timeOff.toString());
        return timeOff;
    }

    public TimeOff change(Long gymId, Long id, String name, Date startTime, Date endTime, String type) {
        gymService.isValidInterval(startTime, endTime);

        gymService.isWithinWorkingHours(gymId, startTime, endTime);

        TimeOff time = this.service.findById(id);

        switch (type) {
            case ADMIN:
                logger.info(COUNTING_NUMBER_OF_RESERVATIONS_LOG);
                isReservationWithinInterval(startTime, endTime);
                break;
            case TRAINER:
                logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
                checkingAvailabilityTrainerTimeOff(Optional.of(id), startTime, endTime);
                break;
            default:
                throw new UnAuthorizedException(NOT_AUTHORIZED_EX);
        }

        time.setName(name);
        time.setStartTime(startTime);
        time.setEndTime(endTime);

        time = this.service.save(time);
        logger.info(time.toString());
        return time;
    }

    public TimeOff delete(Long timesId, String email, String type) {
        TimeOff time = this.service.findById(timesId);

        AUser user = this.userService.findByEmail(email);

        if (!time.getUser().equals(user) && !(user instanceof Admin))
            throw new UnAuthorizedException(NOT_AUTHORIZED_EX);

        if (!type.equals(ADMIN)) {
            String recipientAddress = time.getUser().getEmail();
            this.mailService.sendSimpleMail(recipientAddress,"Ferie eliminate", DELETE_MAIL_MESSAGE);
        }

        this.service.delete(time);
        return time;
    }

    public List<TimeOff> findByDateInterval(Optional<Long> id, Optional<String> type, Date startTime, Date endTime) {
        return this.service.findByStartTimeAndEndTimeAndIdAndType(id, type, startTime, endTime);
    }

    void checkingAvailabilityTrainerTimeOff(Optional<Long> id, Date startTime, Date endTime) {
        logger.info(CHECKING_TRAINERS_AVAILABLE_LOG);
        Long numTrainers = this.trainerService.countAllTrainer();
        List<Reservation> reservations = this.reservationService.findByInterval(startTime, endTime);
        reservations.sort(Comparator.comparing(Reservation::getStartTime));
        logger.info(reservations.toString());

        Stream<TimeOff> streamTimesOff = this.service
                .findOverlappingTimesOffByType(startTime, endTime, TRAINER).parallelStream();
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
        for (Reservation r : reservations) {
            numAvailableTrainers = numTrainers - 1;
            for (TimeOff time : timesOff) {
                if (time.getStartTime().compareTo(r.getStartTime()) <= 0
                        && time.getEndTime().compareTo(r.getEndTime()) >= 0) {
                    numAvailableTrainers--;
                } else break;
            }
            if (numAvailableTrainers <= 0)
                throw new InvalidTimesOff(INVALID_HOUR_TIMEOFF_EX);
        }
    }


    void isReservationWithinInterval(Date startTime, Date endTime) {
        Integer nReservations = this.reservationService.countByInterval(startTime, endTime);
        if (nReservations > 0)
            throw new InvalidTimesOff(NOT_AUTHORIZED_EX);
    }

    void isDoublyBooked(Date startTime, Date endTime, String type) {
        List<TimeOff> timesOff = this.service.findOverlappingTimesOffByType(startTime, endTime, type);
        if (!timesOff.isEmpty())
            throw new InvalidTimesOff(TIME_OFF_ALREADY_BOOKED_EX);
    }
}
