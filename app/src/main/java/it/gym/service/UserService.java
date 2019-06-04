package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UserService implements ICrudService<AUser, Long> {

    private static final String USER = "User";

    @Autowired
    private UserRepository repository;

    @Override
    public AUser save(AUser var1) {
        return this.repository.save(var1);
    }

    @Override
    public AUser findById(Long var1) {
        return this.repository.findById(var1).orElseThrow(() -> new NotFoundException(USER, var1));
    }

    @Override
    public void delete(AUser var1) {
        this.repository.delete(var1);
    }

    @Override
    public List<AUser> findAll() {
        return this.repository.findAll();
    }

    public AUser findByEmail(String email) {
        return this.repository.findByEmail(email);
    }

    public void deleteById(Long id) {
        this.repository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return this.repository.findByEmail(email) != null;
    }

    public Page<AUser> findByLastName(String query, Pageable pageable) {
        return repository.findByLastName(query, pageable);
    }

    public Page<AUser> findAll(Pageable pageable) {
        return repository.findAll(pageable);
    }
}
