package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.ATrainingBundle;
import it.gym.model.Customer;
import it.gym.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerService implements ICrudService<Customer, Long> {

    @Autowired
    private CustomerRepository repository;


    public Customer save(Customer var1) {
        return repository.save(var1);
    }

    public Customer findById(Long var1) {
        return repository.findById(var1).orElseThrow(() -> new NotFoundException("Cliente", var1));
    }

    public void delete(Customer var1) {
        this.repository.delete(var1);
    }

    public List<Customer> findAll() {
        return this.repository.findAll();
    }

    public Page<Customer> findByLastName(String query, Pageable pageable) {
        return repository.findByLastName(query, pageable);
    }

    public Page<Customer> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }

    public Page<ATrainingBundle> findBundles(Long id, Boolean expired, Pageable pageable) {
        Customer customer = this.findById(id);
        List<ATrainingBundle> bundles, prev;
        if (expired == null) {
            bundles = customer.getCurrentTrainingBundles();
            prev = customer.getPreviousTrainingBundles();
            bundles.addAll(prev);
        }
        else if (expired){
            bundles = customer.getPreviousTrainingBundles();
        }
        else {
            bundles = customer.getCurrentTrainingBundles();
        }
        return new PageImpl<>(bundles, pageable, bundles.size());
    }
}
