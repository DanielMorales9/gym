package it.gym.repository;

import it.gym.model.AEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<AEvent, Long> {

    @Query("select t " +
            "from AEvent as t " +
            "where t.startTime >= :startTime and t.endTime <= :endTime")
    List<AEvent> findByInterval(Date startTime, Date endTime);

    @Query("select t " +
            "from AEvent as t " +
            "where t.endTime > :startTime and :endTime > t.startTime")
    List<AEvent> findOverlappingEvents(Date startTime, Date endTime);

    @Query("select t " +
            "from AEvent as t " +
            "where t.startTime <= :startTime and t.endTime >= :endTime")
    List<AEvent> findAllEventsLargerThanInterval(Date startTime, Date endTime);
}

