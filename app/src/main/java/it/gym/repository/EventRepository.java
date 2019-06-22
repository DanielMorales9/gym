package it.gym.repository;

import it.gym.model.AEvent;
import it.gym.model.TimeOff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;


@Repository
public interface EventRepository extends JpaRepository<AEvent, Long> {
}

