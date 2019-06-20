package it.gym.model;

import lombok.Data;

import javax.persistence.*;
import java.time.DayOfWeek;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

@Entity
@Data
public class Gym {

    private static final String LOCALE = "Europe/Rome";

    @Id
    @SequenceGenerator(name = "gym_id_seq",
            sequenceName = "gym_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gym_id_seq")
    @Column(name="gym_id")
    private Long id;

    private String name;
    private Integer mondayStartHour;
    private Integer mondayEndHour;
    private boolean mondayOpen;
    private Integer tuesdayStartHour;
    private Integer tuesdayEndHour;
    private boolean tuesdayOpen;
    private Integer wednesdayStartHour;
    private Integer wednesdayEndHour;
    private boolean wednesdayOpen;
    private Integer thursdayStartHour;
    private Integer thursdayEndHour;
    private boolean thursdayOpen;
    private Integer fridayStartHour;
    private Integer fridayEndHour;
    private boolean fridayOpen;
    private Integer saturdayStartHour;
    private Integer saturdayEndHour;
    private boolean saturdayOpen;
    private Integer sundayStartHour;
    private Integer sundayEndHour;
    private boolean sundayOpen;

    @Column(name = "createdat", nullable = false, updatable = false)
    @Temporal(TemporalType.TIMESTAMP)
    private Date createdAt;

    @Enumerated(EnumType.ORDINAL)
    private DayOfWeek weekStartsOn;

    @PrePersist
    protected void prePersist() {
        this.createdAt = new Date();
    }

    public boolean isValidDate(Date start, Date end) {
        return this.isGymOpenOnDate(start) && this.isGymOpenOnDate(end) &&
                this.isInGymHours(start, end);
    }

    private boolean isInGymHours(Date startDate, Date endDate) {
        Calendar startC = getCalendarDate(startDate);
        int startHour = startC.get(Calendar.HOUR_OF_DAY);
        int startDay = startC.get(Calendar.DAY_OF_WEEK);

        Calendar endC = getCalendarDate(endDate);
        int endHour = endC.get(Calendar.HOUR_OF_DAY);
        int endDay = endC.get(Calendar.DAY_OF_WEEK);

        Integer start;
        Integer end;

        if (startDay != endDay)
            return true;

        switch (startDay) {
            case Calendar.MONDAY:
                start = this.mondayStartHour;
                end = this.mondayEndHour;
                break;
            case Calendar.TUESDAY:
                start = this.tuesdayStartHour;
                end = this.tuesdayEndHour;
                break;
            case Calendar.WEDNESDAY:
                start = this.wednesdayStartHour;
                end = this.wednesdayEndHour;
                break;
            case Calendar.THURSDAY:
                start = this.thursdayStartHour;
                end = this.thursdayEndHour;
                break;
            case Calendar.FRIDAY:
                start = this.fridayStartHour;
                end = this.fridayEndHour;
                break;
            case Calendar.SATURDAY:
                start = this.saturdayStartHour;
                end = this.saturdayEndHour;
                break;
            case Calendar.SUNDAY:
                start = this.sundayStartHour;
                end = this.sundayEndHour;
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + startDay);
        }
        return start <= startHour && endHour <= end;
    }

    private Calendar getCalendarDate(Date endDate) {
        Calendar calendar = Calendar.getInstance();
        calendar.setTime(endDate);
        calendar.setTimeZone(TimeZone.getTimeZone(LOCALE));
        return calendar;
    }

    private boolean isGymOpenOnDate(Date date) {
        Calendar calendar = getCalendarDate(date);
        int day = calendar.get(Calendar.DAY_OF_WEEK);
        boolean open;
        switch (day) {
            case Calendar.MONDAY:
                open = this.mondayOpen;
                break;
            case Calendar.TUESDAY:
                open = this.tuesdayOpen;
                break;
            case Calendar.WEDNESDAY:
                open = this.wednesdayOpen;
                break;
            case Calendar.THURSDAY:
                open = this.thursdayOpen;
                break;
            case Calendar.FRIDAY:
                open = this.fridayOpen;
                break;
            case Calendar.SATURDAY:
                open = this.saturdayOpen;
                break;
            case Calendar.SUNDAY:
                open = this.sundayOpen;
                break;
            default:
                throw new IllegalStateException("Unexpected value: " + day);
        }
        return open;
    }

    public Integer getMondayStartHour() {
        return mondayStartHour;
    }

    public void setMondayStartHour(Integer mondayStartHour) {
        this.mondayStartHour = mondayStartHour;
    }

    public Integer getMondayEndHour() {
        return mondayEndHour;
    }

    public void setMondayEndHour(Integer mondayEndHour) {
        this.mondayEndHour = mondayEndHour;
    }

    public DayOfWeek getWeekStartsOn() {
        return weekStartsOn;
    }

    public void setWeekStartsOn(DayOfWeek weekStartsOn) {
        this.weekStartsOn = weekStartsOn;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Integer getTuesdayStartHour() {
        return tuesdayStartHour;
    }

    public void setTuesdayStartHour(Integer tuesdayStartHour) {
        this.tuesdayStartHour = tuesdayStartHour;
    }

    public Integer getTuesdayEndHour() {
        return tuesdayEndHour;
    }

    public void setTuesdayEndHour(Integer tuesdayEndHour) {
        this.tuesdayEndHour = tuesdayEndHour;
    }

    public Integer getWednesdayStartHour() {
        return wednesdayStartHour;
    }

    public void setWednesdayStartHour(Integer wednesdayStartHour) {
        this.wednesdayStartHour = wednesdayStartHour;
    }

    public Integer getWednesdayEndHour() {
        return wednesdayEndHour;
    }

    public void setWednesdayEndHour(Integer wednesdayEndHour) {
        this.wednesdayEndHour = wednesdayEndHour;
    }

    public Integer getThursdayStartHour() {
        return thursdayStartHour;
    }

    public void setThursdayStartHour(Integer thursdayStartHour) {
        this.thursdayStartHour = thursdayStartHour;
    }

    public Integer getThursdayEndHour() {
        return thursdayEndHour;
    }

    public void setThursdayEndHour(Integer thursdayEndHour) {
        this.thursdayEndHour = thursdayEndHour;
    }

    public Integer getFridayStartHour() {
        return fridayStartHour;
    }

    public void setFridayStartHour(Integer fridayStartHour) {
        this.fridayStartHour = fridayStartHour;
    }

    public Integer getFridayEndHour() {
        return fridayEndHour;
    }

    public void setFridayEndHour(Integer fridayEndHour) {
        this.fridayEndHour = fridayEndHour;
    }

    public Integer getSaturdayStartHour() {
        return saturdayStartHour;
    }

    public void setSaturdayStartHour(Integer saturdayStartHour) {
        this.saturdayStartHour = saturdayStartHour;
    }

    public Integer getSaturdayEndHour() {
        return saturdayEndHour;
    }

    public void setSaturdayEndHour(Integer saturdayEndHour) {
        this.saturdayEndHour = saturdayEndHour;
    }

    public Integer getSundayStartHour() {
        return sundayStartHour;
    }

    public void setSundayStartHour(Integer sundayStartHour) {
        this.sundayStartHour = sundayStartHour;
    }

    public Integer getSundayEndHour() {
        return sundayEndHour;
    }

    public void setSundayEndHour(Integer sundayEndHour) {
        this.sundayEndHour = sundayEndHour;
    }

    public boolean isMondayOpen() {
        return mondayOpen;
    }

    public void setMondayOpen(boolean mondayOpen) {
        this.mondayOpen = mondayOpen;
    }

    public boolean isTuesdayOpen() {
        return tuesdayOpen;
    }

    public void setTuesdayOpen(boolean tuesdayOpen) {
        this.tuesdayOpen = tuesdayOpen;
    }

    public boolean isWednesdayOpen() {
        return wednesdayOpen;
    }

    public void setWednesdayOpen(boolean wednesdayOpen) {
        this.wednesdayOpen = wednesdayOpen;
    }

    public boolean isThursdayOpen() {
        return thursdayOpen;
    }

    public void setThursdayOpen(boolean thursdayOpen) {
        this.thursdayOpen = thursdayOpen;
    }

    public boolean isFridayOpen() {
        return fridayOpen;
    }

    public void setFridayOpen(boolean fridayOpen) {
        this.fridayOpen = fridayOpen;
    }

    public boolean isSaturdayOpen() {
        return saturdayOpen;
    }

    public void setSaturdayOpen(boolean saturdayOpen) {
        this.saturdayOpen = saturdayOpen;
    }

    public boolean isSundayOpen() {
        return sundayOpen;
    }

    public void setSundayOpen(boolean sundayOpen) {
        this.sundayOpen = sundayOpen;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
