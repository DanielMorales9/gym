package it.goodfellas.service;

import it.goodfellas.exception.NotFoundException;
import it.goodfellas.model.Reservation;
import it.goodfellas.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ReservationService implements ICrudService<Reservation, Long> {

    private final ReservationRepository reservationRepository;

    @Autowired
    public ReservationService(ReservationRepository reservationRepository) {
        this.reservationRepository = reservationRepository;
    }


    @Override
    public Reservation save(Reservation var1) {
        return this.reservationRepository.save(var1);
    }

    @Override
    public Reservation findById(Long var1) {
        return this.reservationRepository.findById(var1)
                .orElseThrow(() -> new NotFoundException("Reservation", var1));
    }

    @Override
    public void delete(Reservation var1) {
        this.reservationRepository.delete(var1);
    }

    @Override
    public List<Reservation> findAll() {
        return this.reservationRepository.findAll();
    }

    public List<Reservation> findByStartTime(Date startDate) {
        return this.reservationRepository.findByStartTime(startDate);
    }

    public List<Reservation> findByStartTimeAndEndTimeAndId(Optional<Long> id, Date startDay, Date endDay) {
        if (!id.isPresent())
            return this.reservationRepository.findByInterval(startDay, endDay);
        return this.reservationRepository.findByInterval(id.get(), startDay, endDay);
    }
}
