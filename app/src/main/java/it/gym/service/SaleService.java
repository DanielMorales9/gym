package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.*;
import it.gym.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class SaleService implements ICrudService<Sale, Long> {

    @Autowired private SaleRepository saleRepository;

    public Sale save(Sale var1) {
        return this.saleRepository.save(var1);
    }

    public Sale findById(Long sale) {
        return this.saleRepository.findById(sale).orElseThrow(() -> new NotFoundException("Vendita", sale));
    }

    public void delete(Sale sale) {
        this.saleRepository.delete(sale);
    }

    public List<Sale> findAll() {
        return this.saleRepository.findAll();
    }

    public Page<Sale> findAll(Pageable pageable) {
        return this.saleRepository.findAll(pageable);
    }

    public Page<Sale> findUserSales(Long id, Boolean payed, Pageable pageable) {
        if (payed == null)
            return this.saleRepository.findUserSales(id, pageable);
        return  this.saleRepository.findUserSalesPayed(id, payed, pageable);
    }

    public Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqual(Long id,
                                                                        Date date,
                                                                        Boolean payed,
                                                                        Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, pageable);
        }
        return saleRepository.findSalesByCustomerIdAndCreatedAtGreaterThanEqualAndIsPayed(id, date, payed, pageable);
    }

    public Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date, Pageable pageable) {
        return saleRepository.findSalesByCreatedAtGreaterThanEqual(date, pageable);
    }

    public Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(String lastName,
                                                                              Date date,
                                                                              Boolean payed,
                                                                              Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, pageable);
        }
        return saleRepository.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqualAndIsPayed(lastName, date,
                payed, pageable);
    }

    public Page<Sale> findSalesByCustomerLastName(String lastName, Boolean payed, Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCustomerLastName(lastName, pageable);
        }
        return saleRepository.findSalesByCustomerLastNameAndIsPayed(lastName, payed, pageable);
    }

    public Page<Sale> findAll(Boolean payed, Pageable pageable) {
        if (payed == null) {
            return this.findAll(pageable);
        }
        return saleRepository.findSalesByIsPayed(payed, pageable);
    }
}
