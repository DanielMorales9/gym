package it.goodfellas;

import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Service;

@Service
public interface IUserAuthService extends UserDetailsService {

    AUser register(AUser user);

    void createVerificationToken(AUser user, String token);

    VerificationToken getVerificationToken(String token);

    VerificationToken generateNewVerificationToken(String existingToken);

    AUser changePassword(String email, String password);
}
