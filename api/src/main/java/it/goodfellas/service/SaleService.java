package it.goodfellas.service;

import it.goodfellas.exception.POJONotFoundException;
import it.goodfellas.model.Sale;
import it.goodfellas.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SaleService implements ICrudService<Sale, Long> {

    public static final String SALE = "Sale";
    private final SaleRepository saleRepository;

    @Autowired
    public SaleService(SaleRepository saleRepository) {
        this.saleRepository = saleRepository;
    }


    @Override
    public Sale save(Sale var1) {
        return this.saleRepository.save(var1);
    }

    @Override
    public Sale findById(Long var1) {
        return this.saleRepository.findById(var1).orElseThrow(() -> new POJONotFoundException(SALE, var1));
    }

    @Override
    public void delete(Sale var1) {
        this.saleRepository.delete(var1);
    }

    @Override
    public List<Sale> findAll() {
        return this.saleRepository.findAll();
    }
}
