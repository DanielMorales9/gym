package it.goodfellas.service;

import it.goodfellas.exception.NotFoundException;
import it.goodfellas.model.Customer;
import it.goodfellas.repository.CustomerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService implements ICrudService<Customer, Long> {

    private static final String CUSTOMER = "Customer";
    @Autowired
    CustomerRepository userRepository;


    @Override
    public Customer save(Customer var1) {
        return userRepository.save(var1);
    }

    @Override
    public Customer findById(Long var1) {
        return userRepository.findById(var1).orElseThrow(() -> new NotFoundException(CUSTOMER, var1));
    }

    @Override
    public void delete(Customer var1) {
        this.userRepository.delete(var1);
    }

    @Override
    public List<Customer> findAll() {
        return this.userRepository.findAll();
    }
}
