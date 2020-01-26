package it.gym.repository;

import it.gym.model.CourseTrainingBundle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseTrainingBundleRepository extends JpaRepository<CourseTrainingBundle, Long> {

}
