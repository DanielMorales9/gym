package it.gym.repository;

import it.gym.model.Reservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("select r from Reservation as r where r.startTime >= :startTime and r.endTime <= :endTime")
    List<Reservation> findByInterval(@RequestParam Date startTime,
                                     @RequestParam Date endTime);

    @Query("select r from Reservation as r where r.user.id = :id " +
            "and r.startTime >= :startTime and r.endTime <= :endTime")
    List<Reservation> findByInterval(@RequestParam("id") Long id,
                                     @RequestParam Date startTime,
                                     @RequestParam Date endTime);

    @Query("select count(r) from Reservation as r where r.startTime >= :startTime and r.endTime <= :endTime")
    Integer countByInterval(@RequestParam Date startTime, @RequestParam Date endTime);
}
