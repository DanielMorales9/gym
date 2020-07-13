package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Sale;
import it.gym.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.CachePut;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
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


//    @Caching(
//            put = {
//                    @CachePut(value = "sales-single", key = "#var1.id", condition="#result != null"),
//            },
//            evict = {
//                    @CacheEvict(value = "sales-all", allEntries = true),
//                    @CacheEvict(value = "sales-search", allEntries = true),
//                    @CacheEvict(value = "sales-users", allEntries = true)
//            }
//    )
    public Sale save(Sale var1) {
        return this.saleRepository.save(var1);
    }

//    @Caching (
//            put = {
//                    @CachePut(value = "sales-single", key = "#sale", condition="#result != null"),
//            }
//    )
    public Sale findById(Long sale) {
        return this.saleRepository.findById(sale).orElseThrow(() -> new NotFoundException("Vendita", sale));
    }


//    @Caching(
//            evict = {
//                    @CacheEvict(value = "sales-single", key = "#sale.id"),
//                    @CacheEvict(value = "sales-all", allEntries = true),
//                    @CacheEvict(value = "sales-search", allEntries = true),
//                    @CacheEvict(value = "sales-users", allEntries = true)
//            }
//    )
    public void delete(Sale sale) {
        this.saleRepository.delete(sale);
    }

//    @Cacheable(value = "sales-all")
    public Page<Sale> findAll(Boolean payed, Pageable pageable) {
        Page<Sale> page;

        if (payed == null) {
            page = this.findAll(pageable);
        }
        else if (payed) {
            page = saleRepository.findSalesByIsPayed(pageable);
        }
        else {
            page = saleRepository.findSalesByIsNotPayed(pageable);
        }
        return initAssociation(page);
    }

//    @Cacheable(value = "sales-search")
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

//    @Cacheable(value = "sales-users")
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
        else if(payed) {
            return saleRepository.findSalesByCustomerLastNameAndIsPayed(lastName, pageable);
        }
        else {
            return saleRepository.findSalesByCustomerLastNameAndIsNotPayed(lastName, pageable);
        }
    }

    public Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(String lastName,
                                                                              Date date,
                                                                              Boolean payed,
                                                                              Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCustomerLastNameContainsAndCreatedAtGreaterThanEqual(lastName, date, pageable);
        }
        else if (payed) {
            return saleRepository.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqualAndIsPayed(lastName, date, pageable);
        }
        else {
            return saleRepository.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqualAndIsNotPayed(lastName, date, pageable);
        }
    }

    public Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date, Boolean payed, Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCreatedAtGreaterThanEqual(date, pageable);
        }
        else if (payed) {
            return saleRepository.findSalesByCreatedAtGreaterThanEqualAndIsPayed(date, pageable);
        }
        else {
            return saleRepository.findSalesByCreatedAtGreaterThanEqualAndIsNotPayed(date, pageable);
        }
    }

    public Page<Sale> findAll(Pageable pageable) {
        return this.saleRepository.findAll(pageable);
    }

    public Page<Sale> findUserSales(Long id, Boolean payed, Pageable pageable) {
        if (payed == null)
            return this.saleRepository.findUserSales(id, pageable);
        else if(payed) {
            return this.saleRepository.findUserSalesPayed(id, pageable);
        }
        else {
            return this.saleRepository.findUserSalesNotPayed(id, pageable);
        }
    }

    public Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqual(Long id,
                                                                        Date date,
                                                                        Boolean payed,
                                                                        Pageable pageable) {
        if (payed == null) {
            return saleRepository.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, pageable);
        }
        else if (payed) {
            return saleRepository.findSalesByCustomerIdAndCreatedAtGreaterThanEqualAndIsPayed(id, date, pageable);
        }
        else {
            return saleRepository.findSalesByCustomerIdAndCreatedAtGreaterThanEqualAndIsNotPayed(id, date, pageable);
        }
    }

    public List<Sale> findAll() {
        return this.saleRepository.findAll();
    }

    private Page<Sale> initAssociation(Page<Sale> page) {
        return page.map(Sale::eager);
    }

}
