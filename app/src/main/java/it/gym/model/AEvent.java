package it.gym.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonSubTypes;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import lombok.Data;
import lombok.Generated;
import org.springframework.data.rest.core.annotation.RestResource;

import javax.persistence.*;
import java.util.Date;
import java.util.Objects;

@JsonTypeInfo(
        use = JsonTypeInfo.Id.NAME,
        property = "type",
        visible = true)
@JsonSubTypes({
        @JsonSubTypes.Type(value = TimeOff.class, name="T"),
        @JsonSubTypes.Type(value = Holiday.class, name="H"),
        @JsonSubTypes.Type(value = PersonalTrainingEvent.class, name="P"),
        @JsonSubTypes.Type(value = CourseTrainingEvent.class, name="C"),
})
@Entity
@RestResource(path="events")
@Table(name="events")
@Inheritance(strategy= InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name="type", discriminatorType=DiscriminatorType.STRING, length=1)
@Data
@Generated //exclude coverage analysis on generated methods
public abstract class AEvent {

    @Id
    @SequenceGenerator(name = "events_event_id_seq",
            sequenceName = "events_event_id_seq", allocationSize = 1)
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "events_event_id_seq")
    @Column(name="event_id")
    private Long id;

    @Column(name="name")
    private String name;


    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "start_time")
    private Date startTime;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(name = "end_time")
    private Date endTime;

    public abstract String getType();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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


    @Override
    public String toString() {
        return getName();
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AEvent aEvent = (AEvent) o;
        return Objects.equals(id, aEvent.id) &&
                Objects.equals(name, aEvent.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name);
    }
}
