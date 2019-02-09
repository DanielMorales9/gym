package it.goodfellas.service;

import it.goodfellas.exception.NotFoundException;
import it.goodfellas.model.SalesLineItem;
import it.goodfellas.repository.SalesLineItemRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SalesLineItemService implements ICrudService<SalesLineItem, Long> {


    private static final String SALES_LINE_ITEM = "SalesLineItem";
    private final SalesLineItemRepository salesLineItemRepository;

    @Autowired
    public SalesLineItemService(SalesLineItemRepository salesLineItemRepository) {
        this.salesLineItemRepository = salesLineItemRepository;
    }

    @Override
    public SalesLineItem save(SalesLineItem var1) {
        return this.salesLineItemRepository.save(var1);
    }

    @Override
    public SalesLineItem findById(Long var1) {
        return this.salesLineItemRepository.findById(var1)
                .orElseThrow(() -> new NotFoundException(SALES_LINE_ITEM, var1));
    }

    @Override
    public void delete(SalesLineItem var1) {
        this.salesLineItemRepository.delete(var1);
    }

    @Override
    public List<SalesLineItem> findAll() {
        return this.salesLineItemRepository.findAll();
    }
}
