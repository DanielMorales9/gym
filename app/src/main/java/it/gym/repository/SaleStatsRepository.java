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
            "       date_part('year', createdat) as year," +
            "       date_part('month', createdat) as monthnum," +
            "       sum(total_price) as totalprice, " +
            "       sum(amount_payed) as amountpayed " +
            "from sales " +
            "where createdat > date_trunc('month', now()) + '1 month' - cast(:timeInterval AS Interval) " +
            "group by month, monthnum, year " +
            "order by year, monthnum;", nativeQuery = true)
    List<SaleTimeStatistics> getSalesByMonthInterval(String timeInterval);

    @Query(value =
            "select bundle_spec_type as bundletype, " +
                    "sum(total_price) as totalprice, " +
                    "sum(amount_payed) as amountpayed " +
            "from sales as s, sales_lines as sli, bundle_specs " +
            "where s.sale_id = sli.sale_id and spec_id = sli.spec_id " +
            "    and s.createdat >= date_trunc('month', now()) + '1 month' - cast(:timeInterval AS Interval) " +
            "group by bundle_spec_type;", nativeQuery = true)
    List<SaleBundleStatistics> getSaleStatsByBundleType(String timeInterval);
}
