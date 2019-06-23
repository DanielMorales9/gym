package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AEvent;
import it.gym.model.Holiday;
import it.gym.model.TimeOff;
import it.gym.repository.EventRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class EventService implements ICrudService<AEvent, Long> {

    private final EventRepository repository;

    @Autowired
    public EventService(EventRepository timeOffRepository) {
        this.repository = timeOffRepository;
    }


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

    public List<AEvent> findTimesOffTypeInBetween(Date startTime, Date endTime) {
        return repository.findAll().stream()
                .filter(e ->  e.getStartTime().compareTo(startTime) <= 0 && e.getEndTime().compareTo(endTime) >= 0)
                .collect(Collectors.toList());
    }

    public List<AEvent> findOverlappingTimesOff(Date startTime, Date endTime) {
        return repository.findAll().stream()
                .filter(e ->  e.getStartTime().compareTo(endTime) <= 0 && e.getEndTime().compareTo(startTime) >= 0)
                .collect(Collectors.toList());
    }

    public List<AEvent> findAllEvents(Date startTime, Date endTime) {
        return this.repository.findAll().stream()
                .filter(e ->  e.getStartTime().compareTo(startTime) >= 0 && e.getEndTime().compareTo(endTime) <= 0)
                .collect(Collectors.toList());
    }

    public List<AEvent> findAllTimesOffById(Long id, Date startTime, Date endTime) {
        return this.repository.findAll().stream()
                .filter(e -> e.getType().equals(TimeOff.TYPE))
                .filter(e -> ((TimeOff) e).getUser().getId().equals(id))
                .filter(e ->  e.getStartTime().compareTo(startTime) >= 0 && e.getEndTime().compareTo(endTime) <= 0)
                .collect(Collectors.toList());
    }

    public List<AEvent> findAllHolidays(Date startTime, Date endTime) {
        return this.repository.findAll().stream()
                .filter(e -> e.getType().equals(Holiday.TYPE))
                .filter(e ->  e.getStartTime().compareTo(startTime) >= 0 && e.getEndTime().compareTo(endTime) <= 0)
                .collect(Collectors.toList());
    }
}
