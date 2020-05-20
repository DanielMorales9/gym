package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.*;
import it.gym.repository.SaleRepository;
import org.hibernate.Hibernate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class SaleService implements ICrudService<Sale, Long> {

    @Autowired private SaleRepository saleRepository;


    @Caching(
            put = {
                    @CachePut(value = "sales-single", key = "#var1.id"),
            },
            evict = {
                    @CacheEvict(value = "sales-all", allEntries = true),
                    @CacheEvict(value = "sales-search", allEntries = true),
                    @CacheEvict(value = "sales-users", allEntries = true)
            }
    )
    public Sale save(Sale var1) {
        return this.saleRepository.save(var1);
    }

    @Caching (
            put = {
                    @CachePut(value = "sales-single", key = "#sale"),
            }
    )
    public Sale findById(Long sale) {
        return this.saleRepository.findById(sale).orElseThrow(() -> new NotFoundException("Vendita", sale));
    }


    @Caching(
            evict = {
                    @CacheEvict(value = "sales-single", key = "#sale.id"),
                    @CacheEvict(value = "sales-all", allEntries = true),
                    @CacheEvict(value = "sales-search", allEntries = true),
                    @CacheEvict(value = "sales-users", allEntries = true)
            }
    )
    public void delete(Sale sale) {
        this.saleRepository.delete(sale);
    }

    @Cacheable(value = "sales-all")
    public Page<Sale> findAll(Boolean payed, Pageable pageable) {
        Page<Sale> page;

        if (payed == null) {
            page = this.findAll(pageable);
        }
        else {
            page = saleRepository.findSalesByIsPayed(payed, pageable);
        }
        return initAssociation(page);
    }

    @Cacheable(value = "sales-search")
    public Page<Sale> getSales(String lastName, Date date, Boolean payed, Pageable pageable) {
        Page<Sale> page;
        if (date != null && lastName != null) {
            page = findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, payed, pageable);
        }
        else if (lastName != null) {
            page = findSalesByCustomerLastName(lastName, payed, pageable);
        } else if (date != null) {
            page = findSalesByCreatedAtGreaterThanEqual(date, payed, pageable);
        } else {
            page = findAll(payed, pageable);
        }
        return initAssociation(page);
    }

    @Cacheable(value = "sales-users")
    public Page<Sale> findAllUserSales(Long id, Date date, Boolean payed, Pageable pageable) {
        Page<Sale> page;
        if (date != null) {
            page = this.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, payed, pageable);
        }
        else {
            page = this.findUserSales(id, payed, pageable);
        }
        return initAssociation(page);
    }

    public Page<Sale> findSalesByCustomerLastName(String lastName, Boolean payed, Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCustomerLastNameContains(lastName, pageable);
        }
        return saleRepository.findSalesByCustomerLastNameAndIsPayed(lastName, payed, pageable);
    }

    public Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(String lastName,
                                                                              Date date,
                                                                              Boolean payed,
                                                                              Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCustomerLastNameContainsAndCreatedAtGreaterThanEqual(lastName, date, pageable);
        }
        return saleRepository.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqualAndIsPayed(lastName, date,
                payed, pageable);
    }

    public Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date, Boolean payed, Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCreatedAtGreaterThanEqual(date, pageable);
        }
        return saleRepository.findSalesByCreatedAtGreaterThanEqualAndIsPayed(date, payed, pageable);
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

    public List<Sale> findAll() {
        return this.saleRepository.findAll();
    }

    private Page<Sale> initAssociation(Page<Sale> page) {
        page.forEach(Sale::eager);
        return page;
    }

}
