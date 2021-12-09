package it.gym.repository;

import it.gym.model.AUser;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<AUser, Long> {

  AUser findByEmail(String email);

  @Query(
      value =
          "select u from AUser as u where concat(lower(u.firstName), ' ', lower(u.lastName)) LIKE %:query%")
  Page<AUser> findByLastNameContainingOrFirstNameContaining(
      String query, Pageable pageable);

  @Query(
      value =
          "select distinct u.* "
              + "from events as e, bundles as b, users as u "
              + "where e.event_id = :eventId "
              + "   and e.spec_id = b.spec_id "
              + "   and b.user_id = u.user_id "
              + "   and b.expired_at is null",
      nativeQuery = true)
  List<AUser> findUserByEventId(Long eventId);

  @Query(
      value = "select u.* " + "from users as u " + "where u.user_type = :type",
      nativeQuery = true)
  List<AUser> findAllByType(String type);
}
