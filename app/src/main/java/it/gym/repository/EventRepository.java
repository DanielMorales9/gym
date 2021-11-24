package it.gym.repository;

import it.gym.model.AEvent;
import java.util.Date;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventRepository extends JpaRepository<AEvent, Long> {

  @Query(
      "select t "
          + "from AEvent as t "
          + "where t.startTime >= :startTime and t.endTime <= :endTime")
  List<AEvent> findByInterval(Date startTime, Date endTime);

  @Query(
      "select t "
          + "from AEvent as t "
          + "where t.endTime > :startTime and :endTime > t.startTime")
  List<AEvent> findOverlappingEvents(Date startTime, Date endTime);

  @Query(
      "select t "
          + "from AEvent as t "
          + "where t.startTime <= :startTime and t.endTime >= :endTime")
  List<AEvent> findAllEventsLargerThanInterval(Date startTime, Date endTime);

  @Query(
      "select t "
          + "from ATrainingEvent as t "
          + "where t.specification.id = :specId")
  List<AEvent> findAllEventsBySpec(Long specId);
}
