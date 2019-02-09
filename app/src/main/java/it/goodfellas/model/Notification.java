package it.goodfellas.model;

import java.util.Date;

public class Notification {

    private String topic;
    private String message;
    private String action;
    private Date timestamp;

    public Notification(String topic,
                        String message, String action) {
        this.topic = topic;
        this.message = message;
        this.action = action;
        this.timestamp = new Date();
    }

    public Date getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Date timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
