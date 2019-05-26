package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Customer;
import it.gym.repository.CustomerRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class CustomerService implements ICrudService<Customer, Long> {

    private final CustomerRepository userRepository;

    public CustomerService(CustomerRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Customer save(Customer var1) {
        return userRepository.save(var1);
    }

    public Customer findById(Long var1) {
        return userRepository.findById(var1).orElseThrow(() -> new NotFoundException("Cliente", var1));
    }

    public void delete(Customer var1) {
        this.userRepository.delete(var1);
    }

    public List<Customer> findAll() {
        return this.userRepository.findAll();
    }
}
