package it.gym.utility;

import java.util.Date;
import java.util.Locale;

public class Calendar {

    public static Date getNextMonday() {
        java.util.Calendar date = java.util.Calendar.getInstance(Locale.ITALIAN);
        date.set(java.util.Calendar.HOUR_OF_DAY, 8);
        int diff = java.util.Calendar.MONDAY - date.get(java.util.Calendar.DAY_OF_WEEK);
        if (diff <= 0) {
            diff += 7;
        }
        date.add(java.util.Calendar.DAY_OF_MONTH, diff);
        return date.getTime();
    }
}
