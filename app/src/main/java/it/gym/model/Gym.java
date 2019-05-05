package it.gym.model;

import javax.persistence.*;
import java.time.DayOfWeek;
import java.util.List;

@Entity
public class Gym {

    @Id
    @SequenceGenerator(name = "gym_id_seq",
            sequenceName = "gym_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "gym_id_seq")
    @Column(name="gym_id")
    private Long id;

    private String name;
    private Integer dayStartHour;
    private Integer dayEndHour;
    @ElementCollection
    private List<Integer> excludeDays;
    @Enumerated(EnumType.ORDINAL)
    private DayOfWeek weekStartsOn;

    public Gym() {}

    public Gym(String name, int dayStartHour, int dayEndHour, List<Integer> excludeDays, DayOfWeek weekStartsOn) {
        this.name = name;
        this.dayStartHour = dayStartHour;
        this.dayEndHour = dayEndHour;
        this.excludeDays = excludeDays;
        this.weekStartsOn = weekStartsOn;
    }

    public Integer getDayStartHour() {
        return dayStartHour;
    }

    public void setDayStartHour(Integer dayStartHour) {
        this.dayStartHour = dayStartHour;
    }

    public Integer getDayEndHour() {
        return dayEndHour;
    }

    public void setDayEndHour(Integer dayEndHour) {
        this.dayEndHour = dayEndHour;
    }

    public List<Integer> getExcludeDays() {
        return excludeDays;
    }

    public void setExcludeDays(List<Integer> excludeDays) {
        this.excludeDays = excludeDays;
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
}
