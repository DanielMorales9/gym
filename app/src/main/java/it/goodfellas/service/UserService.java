package it.goodfellas.service;

import it.goodfellas.exception.NotFoundException;
import it.goodfellas.model.AUser;
import it.goodfellas.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService implements ICrudService<AUser, Long> {

    private final static String USER = "User";
    @Autowired
    UserRepository userRepository;

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
}
