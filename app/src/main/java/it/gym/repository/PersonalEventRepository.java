package it.gym.repository;

import it.gym.model.AEvent;
import it.gym.model.PersonalEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Repository
public interface PersonalEventRepository extends JpaRepository<PersonalEvent, Long> {

    @Query("select p " +
            "from PersonalEvent p " +
            "where p.reservation.user.id = :customerId and p.startTime >= :startTime and p.endTime <= :endTime")
    List<AEvent> findByIntervalAndCustomerId(Long customerId, Date startTime, Date endTime);
}

