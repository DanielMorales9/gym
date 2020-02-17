package it.gym.repository;

import it.gym.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query(value="select s from Sale as s where s.customer.id = :id")
    Page<Sale> findUserSales(Long id, Pageable pageable);

    @Query(value="select s from Sale as s where s.customer.id = :id and s.isPayed = :payed")
    Page<Sale> findUserSalesPayed(Long id, Boolean payed, Pageable pageable);

    Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqual(Long id,
                                                                 Date date,
                                                                 Pageable pageable);

    Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqualAndIsPayed(Long id,
                                                                 Date date,
                                                                 Boolean payed,
                                                                 Pageable pageable);

    Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date,
                                                    Pageable pageable);

    Page<Sale> findSalesByCustomerLastNameContains(String query, Pageable pageable);

    Page<Sale> findSalesByCustomerLastNameContainsAndCreatedAtGreaterThanEqual(String lastName,
                                                                               Date date,
                                                                               Pageable pageable);

    Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqualAndIsPayed(String lastName,
                                                                       Date date,
                                                                       Boolean payed,
                                                                       Pageable pageable);


    Page<Sale> findSalesByCustomerLastNameAndIsPayed(String lastName, Boolean payed, Pageable pageable);

    Page<Sale> findSalesByIsPayed(Boolean payed, Pageable pageable);

    Page<Sale> findSalesByCreatedAtGreaterThanEqualAndIsPayed(Date date, Boolean payed, Pageable pageable);

}
