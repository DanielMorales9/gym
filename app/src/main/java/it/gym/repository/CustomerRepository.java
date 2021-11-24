package it.gym.repository;

import it.gym.model.Customer;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerRepository extends JpaRepository<Customer, Long> {

  Customer findByEmail(String email);

  @Override
  List<Customer> findAll();
}
