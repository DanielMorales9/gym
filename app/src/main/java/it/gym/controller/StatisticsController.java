package it.gym.controller;

import it.gym.pojo.ReservationDayOfWeekStatistics;
import it.gym.pojo.ReservationTimeStatistics;
import it.gym.pojo.SaleBundleStatistics;
import it.gym.pojo.SaleTimeStatistics;
import it.gym.repository.EventStatsRepository;
import it.gym.repository.SaleStatsRepository;
import java.util.List;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/stats")
@PreAuthorize("isAuthenticated()")
public class StatisticsController {

  private final SaleStatsRepository saleStatsRepository;
  private final EventStatsRepository eventStatsRepository;

  public StatisticsController(
      EventStatsRepository eventStatsRepository,
      SaleStatsRepository saleStatsRepository) {
    this.eventStatsRepository = eventStatsRepository;
    this.saleStatsRepository = saleStatsRepository;
  }

  @GetMapping("/getSaleByMonth")
  @ResponseBody
  @PreAuthorize("hasAuthority('ADMIN')")
  public List<SaleTimeStatistics> getSaleStatsByMonth(
      @RequestParam String interval) {
    return saleStatsRepository.getSalesByMonthInterval(interval);
  }

  @GetMapping("/getSaleByBundleType")
  @ResponseBody
  @PreAuthorize("hasAuthority('ADMIN')")
  public List<SaleBundleStatistics> getSaleStatsByBundleType(
      @RequestParam String interval) {
    return saleStatsRepository.getSaleStatsByBundleType(interval);
  }

  @GetMapping("/getReservationsByWeek")
  @ResponseBody
  @PreAuthorize("hasAuthority('ADMIN')")
  public List<ReservationTimeStatistics> getReservationsByWeek(
      @RequestParam String interval) {
    return eventStatsRepository.getReservationsByWeek(interval);
  }

  @GetMapping("/getCustomerReservationsByWeek")
  @ResponseBody
  public List<ReservationTimeStatistics> getCustomerReservationsByWeek(
      @RequestParam Long id, @RequestParam String interval) {
    return eventStatsRepository.getCustomerReservationsByWeek(id, interval);
  }

  @GetMapping("/getReservationsByDayOfWeek")
  @ResponseBody
  @PreAuthorize("hasAuthority('ADMIN')")
  public List<ReservationDayOfWeekStatistics> getReservationsByDayOfWeek(
      @RequestParam String interval) {
    return eventStatsRepository.getReservationsByDayOfWeek(interval);
  }
}
