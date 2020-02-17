package it.gym.repository;

import it.gym.model.Sale;
import it.gym.pojo.SaleBundleStatistics;
import it.gym.pojo.SaleTimeStatistics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SaleStatsRepository extends JpaRepository<Sale, String> {

    @Query(value =
            "select to_char(to_timestamp (date_part('month', createdat)\\:\\:text, 'MM'), 'TMMonth') as month," +
            "       sum(total_price) as totalprice, " +
            "       sum(amount_payed) as amountpayed " +
            "from sales " +
            "where createdat > date_trunc('month', now()) - cast(:timeInterval AS Interval) " +
            "group by month;", nativeQuery = true)
    List<SaleTimeStatistics> getSalesByMonthInterval(String timeInterval);

    @Query(value =
            "select bundle_spec_type as bundletype, sum(total_price) as totalprice, sum(amount_payed) as amountpayed " +
            "from sales as s, sales_lines as sli, bundle_specs " +
            "where s.sale_id = sli.sale_id and bundle_spec_id = sli.bundle_specification_bundle_spec_id " +
            "    and s.createdat > date_trunc('month', now()) - cast(:timeInterval AS Interval) " +
            "group by bundle_spec_type;", nativeQuery = true)
    List<SaleBundleStatistics> getSaleStatsByBundleType(String timeInterval);
}
