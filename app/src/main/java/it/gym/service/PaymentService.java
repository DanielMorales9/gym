package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Payment;
import it.gym.repository.PaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class PaymentService implements ICrudService<Payment, Long> {

  @Autowired private PaymentRepository repository;

  @Override
  public Payment save(Payment var1) {
    return repository.save(var1);
  }

  @Override
  public Payment findById(Long var1) {
    return repository
        .findById(var1)
        .orElseThrow(() -> new NotFoundException("Pagamento", var1));
  }

  @Override
  public void delete(Payment var1) {
    repository.delete(var1);
  }

  @Override
  public List<Payment> findAll() {
    return repository.findAll();
  }

  public void deleteAll(List<Payment> payments) {
    repository.deleteAll(payments);
  }
}
