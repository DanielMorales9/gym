package it.gym.service;

import it.gym.exception.NotFoundException;
import it.gym.model.AUser;
import it.gym.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;

@Service
@Transactional
public class UserService implements ICrudService<AUser, Long> {

    private static final String USER = "User";

    @Autowired
    private UserRepository userRepository;

    @Override
    public AUser save(AUser var1) {
        return this.userRepository.save(var1);
    }

    @Override
    public AUser findById(Long var1) {
        return this.userRepository.findById(var1).orElseThrow(() -> new NotFoundException(USER, var1));
    }

    @Override
    public void delete(AUser var1) {
        this.userRepository.delete(var1);
    }

    @Override
    public List<AUser> findAll() {
        return this.userRepository.findAll();
    }

    public AUser findByEmail(String email) {
        return this.userRepository.findByEmail(email);
    }

    public void deleteById(Long id) {
        this.userRepository.deleteById(id);
    }

    public boolean existsByEmail(String email) {
        return this.userRepository.findByEmail(email) != null;
    }
}
