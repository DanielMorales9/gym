package it.goodfellas.service;

import it.goodfellas.exception.POJONotFoundException;
import it.goodfellas.model.Reservation;
import it.goodfellas.model.TimeOff;
import it.goodfellas.repository.ReservationRepository;
import it.goodfellas.repository.TimeOffRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class TimeOffService implements ICrudService<TimeOff, Long> {

    private final TimeOffRepository timeOffRepository;

    @Autowired
    public TimeOffService(TimeOffRepository timeOffRepository) {
        this.timeOffRepository = timeOffRepository;
    }


    @Override
    public TimeOff save(TimeOff var1) {
        return this.timeOffRepository.save(var1);
    }

    @Override
    public TimeOff findById(Long var1) {
        return this.timeOffRepository.findById(var1)
                .orElseThrow(() -> new POJONotFoundException("TimeOff", var1));
    }

    @Override
    public void delete(TimeOff var1) {
        this.timeOffRepository.delete(var1);
    }

    @Override
    public List<TimeOff> findAll() {
        return this.timeOffRepository.findAll();
    }

    public List<TimeOff> findByStartTimeAndEndTimeAndIdAndType(Optional<Long> id, Optional<String> type,
                                                               Date startDay, Date endDay) {
        if (!id.isPresent() && !type.isPresent() )
            return this.timeOffRepository.findAllTimesOff(startDay, endDay);
        if (id.isPresent())
            return this.timeOffRepository.findAllTimesOffById(id.get(), startDay, endDay);
        return this.timeOffRepository.findAllTimesOffByType(type.get(), startDay, endDay);
    }
}