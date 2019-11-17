package it.gym.repository;

import it.gym.model.AUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AUser, Long> {

    AUser findByEmail(String email);

    Page<AUser> findByLastName(String query, Pageable pageable);

}
