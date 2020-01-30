package it.gym.repository;

import it.gym.model.TimeOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OptionRepository extends JpaRepository<TimeOption, Long> {

}
