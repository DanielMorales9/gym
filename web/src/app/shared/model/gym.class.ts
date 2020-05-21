export interface Gym {
    id: number;
    name: string;
    weekStartsOn: string;

    sundayStartHour;
    sundayEndHour;
    sundayOpen;
    mondayStartHour;
    mondayEndHour;
    mondayOpen;
    tuesdayStartHour;
    tuesdayEndHour;
    tuesdayOpen;
    wednesdayStartHour;
    wednesdayEndHour;
    wednesdayOpen;
    thursdayStartHour;
    thursdayEndHour;
    thursdayOpen;
    fridayStartHour;
    fridayEndHour;
    fridayOpen;
    saturdayStartHour;
    saturdayEndHour;
    saturdayOpen;

    sundayNumEvents;
    mondayNumEvents;
    tuesdayNumEvents;
    wednesdayNumEvents;
    thursdayNumEvents;
    fridayNumEvents;
    saturdayNumEvents;

    minutesBetweenEvents;
    reservationBeforeHours;
    numEvents;

    backgroundColor;
    fullName;

}
