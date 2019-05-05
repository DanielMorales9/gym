package it.gym.repository;

import it.gym.model.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path="/customers")
public interface CustomerRepository extends JpaRepository<Customer, Long> {

    Customer findByEmail(String email);

    Page<Customer> findByLastName(String query, Pageable pageable);

}
