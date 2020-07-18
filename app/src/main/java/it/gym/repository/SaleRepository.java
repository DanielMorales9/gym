package it.gym.repository;

import it.gym.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

@Repository
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query(value="select s from Sale as s where s.customer.id = :id")
    Page<Sale> findUserSales(Long id, Pageable pageable);

    @Query(value="select s from Sale as s where s.customer.id = :id and (s.amountPayed >= s.totalPrice or s.amountPayed is null)")
    Page<Sale> findUserSalesPayed(Long id, Pageable pageable);

    @Query(value="select s from Sale as s where s.customer.id = :id and (s.amountPayed < s.totalPrice or s.totalPrice is null)")
    Page<Sale> findUserSalesNotPayed(Long id, Pageable pageable);

    Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqual(Long id,
                                                                 Date date,
                                                                 Pageable pageable);

    @Query(value="select s from Sale as s where s.customer.id = :id " +
            "and s.createdAt >= :date and (s.amountPayed >= s.totalPrice or s.amountPayed is null)")
    Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqualAndIsPayed(Long id,
                                                                           Date date,
                                                                           Pageable pageable);

    @Query(value="select s from Sale as s where s.customer.id = :id " +
            "and s.createdAt >= :date and (s.amountPayed < s.totalPrice or s.totalPrice is null)")
    Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqualAndIsNotPayed(Long id,
                                                                              Date date,
                                                                              Pageable pageable);

    Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date,
                                                    Pageable pageable);

    Page<Sale> findSalesByCustomerLastNameContains(String query, Pageable pageable);

    Page<Sale> findSalesByCustomerLastNameContainsAndCreatedAtGreaterThanEqual(String lastName,
                                                                               Date date,
                                                                               Pageable pageable);

    @Query(value="select s from Sale as s " +
            "where s.customer.lastName = :lastName " +
            "and s.createdAt >= :date " +
            "and (s.amountPayed >= s.totalPrice or s.amountPayed is null)")
    Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqualAndIsPayed(String lastName,
                                                                                 Date date,
                                                                                 Pageable pageable);

    @Query(value="select s from Sale as s " +
            "where s.customer.lastName = :lastName " +
            "and s.createdAt >= :date " +
            "and (s.amountPayed < s.totalPrice or s.totalPrice is null)")
    Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqualAndIsNotPayed(String lastName,
                                                                                    Date date,
                                                                                    Pageable pageable);

    @Query(value="select s from Sale as s where s.customer.id = :id " +
            "and s.customer.lastName = :lastName " +
            "and (s.amountPayed >= s.totalPrice or s.amountPayed is null)")
    Page<Sale> findSalesByCustomerLastNameAndIsPayed(String lastName, Pageable pageable);

    @Query(value="select s from Sale as s " +
            "where s.customer.lastName = :lastName " +
            "and (s.amountPayed < s.totalPrice or s.totalPrice is null)")
    Page<Sale> findSalesByCustomerLastNameAndIsNotPayed(String lastName, Pageable pageable);


    @Query(value="select s from Sale as s where (s.amountPayed >= s.totalPrice or s.amountPayed is null)")
    Page<Sale> findSalesByIsPayed(Pageable pageable);

    @Query(value="select s from Sale as s where (s.amountPayed < s.totalPrice or s.totalPrice is null)")
    Page<Sale> findSalesByIsNotPayed(Pageable pageable);

    @Query(value="select s from Sale as s where " +
            "s.createdAt >= :date and (s.amountPayed >= s.totalPrice or s.amountPayed is null)")
    Page<Sale> findSalesByCreatedAtGreaterThanEqualAndIsPayed(Date date, Pageable pageable);

    @Query(value="select s from Sale as s where " +
            "s.createdAt >= :date and (s.amountPayed < s.totalPrice or s.totalPrice is null)")
    Page<Sale> findSalesByCreatedAtGreaterThanEqualAndIsNotPayed(Date date, Pageable pageable);

    @Query(value = "select s from Sale as s where s.customer.id = :customerId")
    List<Sale> findSalesByCustomerId(Long customerId);

}
