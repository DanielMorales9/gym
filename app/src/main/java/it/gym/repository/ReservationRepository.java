package it.gym.repository;

import it.gym.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;

@RepositoryRestController
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    List<Reservation> findByStartTime(Date startTime);

    // TODO changeTimeOff startDay and endDay to StartTime and EndTime
    @Query("select r from Reservation as r where r.startTime >= :startDay and r.endTime <= :endDay")
    List<Reservation> findByInterval(@RequestParam Date startDay,
                                     @RequestParam Date endDay);

    @Query("select r from Reservation as r where r.user.id = :id " +
            "and r.startTime >= :startDay and r.endTime <= :endDay")
    List<Reservation> findByInterval(@RequestParam("id") Long id,
                                     @RequestParam Date startDay,
                                     @RequestParam Date endDay);

    @Query("select count(r) from Reservation as r where r.startTime >= :startDay and r.endTime <= :endDay")
    Integer countByInterval(@RequestParam Date startDay, @RequestParam Date endDay);
}
