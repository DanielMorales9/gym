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
            "select to_char(to_timestamp (date_part('month', created_at)\\:\\:text, 'MM'), 'TMMonth') as month," +
            "       date_part('year', created_at) as year," +
            "       date_part('month', created_at) as monthnum," +
            "       sum(total_price) as totalprice, " +
            "       sum(amount_payed) as amountpayed " +
            "from sales " +
            "where created_at > date_trunc('month', now()) + '1 month' - cast(:timeInterval AS Interval) " +
            "group by month, monthnum, year " +
            "order by year, monthnum;", nativeQuery = true)
    List<SaleTimeStatistics> getSalesByMonthInterval(String timeInterval);

    @Query(value =
            "select bs.name as bundletype, " +
                    "sum(total_price) as totalprice, " +
                    "sum(amount_payed) as amountpayed " +
            "from sales as s, sales_lines as sli, bundle_specs as bs " +
            "where s.sale_id = sli.sale_id and bs.bundle_spec_id = sli.spec_id " +
            "    and s.created_at >= date_trunc('month', now()) + '1 month' - cast(:timeInterval AS Interval) " +
            "group by bs.name;", nativeQuery = true)
    List<SaleBundleStatistics> getSaleStatsByBundleType(String timeInterval);
}
