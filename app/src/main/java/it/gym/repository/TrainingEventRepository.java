package it.gym.repository;

import it.gym.model.AEvent;
import it.gym.model.ATrainingEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;


@Repository
public interface TrainingEventRepository extends JpaRepository<ATrainingEvent, Long> {

    @Query("select t " +
            "from ATrainingEvent as t " +
            "where t.startTime >= :startTime and t.endTime <= :endTime")
    List<AEvent> findByInterval(Date startTime, Date endTime);
}

