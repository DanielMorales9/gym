package it.gym.repository;

import it.gym.dto.ReservationDayOfWeekStatistics;
import it.gym.dto.ReservationTimeStatistics;
import it.gym.model.AEvent;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface EventStatsRepository extends JpaRepository<AEvent, String> {

  @Query(
      value =
          "select date_part('week', e.start_time) as week, e.type as type, "
              + "       count(e.type) as numreservations "
              + "from events as e left join reservations r on e.event_id = r.event_id "
              + "where e.start_time > date_trunc('month', now()) + '1 month' - cast(:timeInterval AS Interval) "
              + "      and (e.type = 'P' or e.type = 'C') "
              + "group by week, e.type "
              + "order by week;",
      nativeQuery = true)
  List<ReservationTimeStatistics> getReservationsByWeek(String timeInterval);

  @Query(
      value =
          "select date_part('week', e.start_time) as week, e.type as type, "
              + "count(e.type) as numreservations "
              + "from events as e, reservations as r "
              + "where e.event_id = r.event_id "
              + " and e.start_time > date_trunc('month', now()) + '1 month' - cast(:timeInterval AS Interval)"
              + " and r.user_id = :id "
              + "group by week, e.type "
              + "order by week;",
      nativeQuery = true)
  List<ReservationTimeStatistics> getCustomerReservationsByWeek(
      Long id, String timeInterval);

  @Query(
      value =
          "select extract(dow from e.start_time) as dayofweek, e.type as type, count(e.type) as numreservations "
              + "from events as e left join reservations r on e.event_id = r.event_id "
              + "where e.start_time > date_trunc('month', now()) + '1 month' - cast(:timeInterval AS Interval) "
              + "       and (e.type = 'P' or e.type = 'C') "
              + "group by dayofweek, e.type "
              + "order by dayofweek;",
      nativeQuery = true)
  List<ReservationDayOfWeekStatistics> getReservationsByDayOfWeek(
      String timeInterval);
}
