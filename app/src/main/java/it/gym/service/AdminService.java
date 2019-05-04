package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Admin;
import it.gym.repository.AdminRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AdminService implements ICrudService<Admin, Long> {

    private final static String ADMIN = "Admin";
    @Autowired
    AdminRepository adminRepository;

    @Override
    public Admin save(Admin var1) {
        return this.adminRepository.save(var1);
    }

    @Override
    public Admin findById(Long var1) {
        return this.adminRepository.findById(var1).orElseThrow(() -> new NotFoundException(ADMIN, var1));
    }

    @Override
    public void delete(Admin var1) {
        this.adminRepository.delete(var1);
    }

    @Override
    public List<Admin> findAll() {
        return this.adminRepository.findAll();
    }

    public Admin findByEmail(String email) {
        return this.adminRepository.findByEmail(email);
    }
}