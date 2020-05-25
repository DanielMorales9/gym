package it.gym.repository;

import it.gym.model.AUser;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<AUser, Long> {

    AUser findByEmail(String email);

    @Query(value = "select u from AUser as u where concat(lower(u.firstName), ' ', lower(u.lastName)) LIKE %:query%")
    Page<AUser> findByLastNameContainingOrFirstNameContaining(String query, Pageable pageable);

    @Query(value =
            "select u.* " +
            "from events as e, bundle_specs as bs, " +
            "       bundles as b, users as u, current_users_bundles as c " +
            "where e.event_id = :eventId " +
            "   and e.spec_id = bs.bundle_spec_id " +
            "   and b.bundle_spec_bundle_spec_id = bs.bundle_spec_id " +
            "   and b.bundle_id = c.bundle_id " +
            "   and c.user_id = u.user_id",
            nativeQuery=true)
    List<AUser> findUserByEventId(Long eventId);

    @Query(value = "select u.* from users as u where u.user_type = :type", nativeQuery = true)
    List<AUser> findAllByType(String type);
}
