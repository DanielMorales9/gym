package it.gym.repository;

import it.gym.model.APurchaseOption;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PurchaseOptionRepository
    extends JpaRepository<APurchaseOption, Long> {}
