package it.gym.pojo;

import java.util.Date;

public class Event {
    private String name;
    private Date startTime;
    private Date endTime;
    private Long id;
    private Boolean external;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
    public Date getStartTime() {
        return startTime;
    }

    public void setStartTime(Date startTime) {
        this.startTime = startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public void setEndTime(Date endTime) {
        this.endTime = endTime;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Boolean getExternal() {
        return external;
    }

    public void setExternal(Boolean external) {
        this.external = external;
    }
}
