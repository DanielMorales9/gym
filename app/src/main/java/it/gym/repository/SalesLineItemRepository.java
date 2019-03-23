package it.gym.repository;

import it.gym.model.SalesLineItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource
public interface SalesLineItemRepository extends JpaRepository<SalesLineItem, Long> {

}
