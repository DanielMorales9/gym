package it.gym.repository;

import it.gym.model.AEvent;
import it.gym.model.PersonalTrainingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface PersonalEventRepository extends JpaRepository<PersonalTrainingEvent, Long> {

    @Query("select p " +
            "from PersonalTrainingEvent p " +
            "where p.reservation.user.id = :customerId and p.startTime >= :startTime and p.endTime <= :endTime")
    List<AEvent> findByIntervalAndCustomerId(Long customerId, Date startTime, Date endTime);
}

