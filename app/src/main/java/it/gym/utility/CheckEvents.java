package it.gym.utility;

import it.gym.exception.BadRequestException;
import it.gym.model.AEvent;
import it.gym.model.Holiday;
import it.gym.model.TimeOff;

import java.util.List;

public class CheckEvents {

    public static void hasHolidays(List<AEvent> events) {

        long nHolidays = events.stream()
                .filter(s -> s.getType().equals(Holiday.TYPE))
                .limit(1)
                .count();

        if (nHolidays > 0)
            throw new BadRequestException("Chiusura Aziendale");
    }

    public static void isTrainerAvailable(long nTrainers, List<AEvent> timesOff) {
        long nUnavailableTrainers = timesOff.stream().filter(t -> t.getType().equals(TimeOff.TYPE)).count();
        long nAvailableTrainers = nTrainers - nUnavailableTrainers;
        if (nAvailableTrainers <= 0) {
            throw new BadRequestException("Non ci sono personal trainer disponibili");
        }
    }
}
