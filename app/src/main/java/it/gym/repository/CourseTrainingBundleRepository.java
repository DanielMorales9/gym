package it.gym.repository;

import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.CourseTrainingBundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface CourseTrainingBundleRepository extends JpaRepository<CourseTrainingBundle, Long> {

    @Query("select c from CourseTrainingBundle as c where c.startTime <= :startTime and c.endTime >= :endTime")
    List<CourseTrainingBundle> findCoursesByInterval(Date startTime, Date endTime);
}
