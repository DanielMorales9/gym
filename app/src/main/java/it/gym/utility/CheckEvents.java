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

}
