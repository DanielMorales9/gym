package it.gym.repository;

import it.gym.model.ATrainingSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface TrainingSessionRepository extends JpaRepository<ATrainingSession, Long> {

    @Query("select s from AUser as u, ATrainingBundle as b, ATrainingSession as s " +
            "where " +
            "u.id = :customerId and " +
            "b.customer.id = u.id and " +
            "s.trainingBundle.id = b.id " +
            "order by s.startTime desc")
    Page<ATrainingSession> findByCustomer(Long customerId, Pageable pageable);

    @Query("select s from AUser as u, ATrainingBundle as b, ATrainingSession as s " +
            "where " +
            "u.id = :customerId and " +
            "b.customer.id = u.id and " +
            "s.trainingBundle.id = b.id and " +
            "s.startTime >= :date " +
            "order by s.startTime desc")
    Page<ATrainingSession> findByCustomerAndDate(Long customerId, Date date, Pageable pageable);
}
