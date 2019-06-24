package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Reservation;
import it.gym.repository.ReservationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;
import java.util.List;

@Service
public class ReservationService implements ICrudService<Reservation, Long> {

    @Autowired private ReservationRepository reservationRepository;

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

    public List<Reservation> findByIntervalAndId(Long id, Date startTime, Date endTime) {
        return this.reservationRepository.findByInterval(id, startTime, endTime);
    }

    public List<Reservation> findByInterval(Date startTime, Date endTime) {
        return this.reservationRepository.findByInterval(startTime, endTime);
    }

    public Integer countByInterval(Date startTime, Date endTime) {
        return reservationRepository.countByInterval(startTime, endTime);
    }
}
