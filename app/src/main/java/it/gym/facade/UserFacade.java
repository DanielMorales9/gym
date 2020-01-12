package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.model.AUser;
import it.gym.model.VerificationToken;
import it.gym.service.UserService;
import it.gym.service.VerificationTokenService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;


@Component
@Transactional
public class UserFacade {

    @Autowired
    @Qualifier("verificationTokenService")
    private VerificationTokenService tokenService;

    @Autowired
    private UserService service;

    public AUser delete(Long id) {
        AUser user = this.service.findById(id);
        if (tokenService.existsByUser(user)) {
            VerificationToken vtk = this.tokenService.findByUser(user);
            this.tokenService.delete(vtk);
        }

        if (!user.isActive()) {
            this.service.deleteById(id);
        }
        else {
            throw new BadRequestException("Impossibile eliminare un utente con delle transazioni attive");
        }
        return user;
    }

    public AUser findById(Long id) {
        return service.findById(id);
    }

    public AUser save(AUser u) {
        return this.service.save(u);
    }

    public AUser findByEmail(String email) {
        return this.service.findByEmail(email);
    }

    public Page<AUser> findByLastName(String query, Pageable pageable) {
        return service.findByLastName(query, pageable);
    }

    public Page<AUser> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }
}
