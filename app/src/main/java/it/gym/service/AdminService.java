package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.Admin;
import it.gym.repository.AdminRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class AdminService implements ICrudService<Admin, Long> {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin save(Admin var1) {
        return this.adminRepository.save(var1);
    }

    public Admin findById(Long var1) {
        return this.adminRepository.findById(var1).orElseThrow(() -> new NotFoundException("Admin", var1));
    }

    public void delete(Admin var1) {
        this.adminRepository.delete(var1);
    }

    public List<Admin> findAll() {
        return this.adminRepository.findAll();
    }

    public Admin findByEmail(String email) {
        return this.adminRepository.findByEmail(email);
    }
}
