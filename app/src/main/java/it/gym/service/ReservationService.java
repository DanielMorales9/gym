package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Reservation;
import it.gym.repository.ReservationRepository;
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

    public List<Reservation> findByInterval(Long id, Date startTime, Date endTime) {
        return this.reservationRepository.findByInterval(id, startTime, endTime);
    }

    public List<Reservation> findByInterval(Date startTime, Date endTime) {
        return this.reservationRepository.findByInterval(startTime, endTime);
    }

    public Integer countByInterval(Date startTime, Date endTime) {
        return reservationRepository.countByInterval(startTime, endTime);
    }
}
