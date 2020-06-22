package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.*;
import it.gym.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EventService implements ICrudService<AEvent, Long> {

    @Autowired
    private EventRepository repository;

    @Override
    public AEvent save(AEvent var1) {
        return this.repository.save(var1);
    }

    @Override
    public AEvent findById(Long var1) {
        return this.repository.findById(var1)
                .orElseThrow(() -> new NotFoundException("TimeOff", var1));
    }

    @Override
    public void delete(AEvent var1) {
        this.repository.delete(var1);
    }

    @Override
    public List<AEvent> findAll() {
        return this.repository.findAll();
    }

    public List<AEvent> findAllEventsLargerThanInterval(Date startTime, Date endTime) {
        return repository.findAllEventsLargerThanInterval(startTime, endTime);
    }

    public List<AEvent> findOverlappingEvents(Date startTime, Date endTime) {
        return repository.findOverlappingEvents(startTime, endTime);
    }

    public List<AEvent> findAllEvents(Date startTime, Date endTime) {
        return this.repository.findByInterval(startTime, endTime);
    }

    public List<AEvent> findAllTimesOffById(Long id, Date startTime, Date endTime) {
        return this.repository.findByInterval(startTime, endTime).stream()
                .filter(e -> e.getType().equals(TimeOff.TYPE))
                .filter(e -> ((TimeOff) e).getUser().getId().equals(id))
                .collect(Collectors.toList());
    }

    public List<AEvent> findAllHolidays(Date startTime, Date endTime) {
        return this.repository.findByInterval(startTime, endTime).stream()
                .filter(e -> e.getType().equals(Holiday.TYPE))
                .collect(Collectors.toList());
    }

    public void deleteAll(List<ATrainingEvent> events) {
        this.repository.deleteAll(events);
    }

    public List<ATrainingEvent> saveAll(List<ATrainingEvent> saveEvents) {
        return  this.repository.saveAll(saveEvents);
    }

    public List<AEvent> findEventsBySpec(ATrainingBundleSpecification spec) {
        return this.repository.findAllEventsBySpec(spec.getId());
    }
}
