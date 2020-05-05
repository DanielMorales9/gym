package it.gym.repository;

import it.gym.model.Workout;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkoutRepository extends JpaRepository<Workout, Long> {
    Page<Workout> findByNameContains(String query, Pageable pageable);

    Page<Workout> findByNameContainsAndTemplateIs(String query, Boolean isTemplate, Pageable page);

    Page<Workout> findByTag1EqualsOrTag2EqualsOrTag3Equals(String query1,
                                                           String query2,
                                                           String query3,
                                                           Pageable pageable);

    Page<Workout> findByTag1EqualsOrTag2EqualsOrTag3EqualsAndTemplateIs(String query1,
                                                                        String query2,
                                                                        String query3,
                                                                        Boolean isTemplate,
                                                                        Pageable page);

    Page<Workout> findByTemplateIs(Boolean isTemplate, Pageable page);
}
