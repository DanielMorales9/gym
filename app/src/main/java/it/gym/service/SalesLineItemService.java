package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.SalesLineItem;
import it.gym.repository.SalesLineItemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SalesLineItemService implements ICrudService<SalesLineItem, Long> {

  private final SalesLineItemRepository salesLineItemRepository;

  public SalesLineItemService(SalesLineItemRepository salesLineItemRepository) {
    this.salesLineItemRepository = salesLineItemRepository;
  }

  public SalesLineItem save(SalesLineItem var1) {
    return this.salesLineItemRepository.save(var1);
  }

  public SalesLineItem findById(Long var1) {
    return this.salesLineItemRepository
        .findById(var1)
        .orElseThrow(() -> new NotFoundException("Linea di Vendita", var1));
  }

  public void delete(SalesLineItem var1) {
    this.salesLineItemRepository.delete(var1);
  }

  public List<SalesLineItem> findAll() {
    return this.salesLineItemRepository.findAll();
  }

  public void deleteAll(List<SalesLineItem> salesLineItems) {
    this.salesLineItemRepository.deleteAll(salesLineItems);
  }
}
