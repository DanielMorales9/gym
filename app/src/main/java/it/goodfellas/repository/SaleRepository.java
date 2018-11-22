package it.goodfellas.repository;

import it.goodfellas.model.Sale;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;

@RepositoryRestResource
public interface SaleRepository extends JpaRepository<Sale, Long> {

    @Query(value="select s from Sale as s where s.customer.id = :id")
    Page<Sale> findUserSales(@RequestParam("id") Long id, Pageable pageable);

    Page<Sale> findSalesByCustomer_IdAndCreatedAtGreaterThanEqual(@RequestParam("id") Long id, @RequestParam("date") Date date, Pageable pageable);

    Page<Sale> findSalesByCustomer_LastName(String query, Pageable pageable);
}
