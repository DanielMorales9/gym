package it.gym.facade;

import it.gym.exception.*;
import it.gym.model.AUser;
import it.gym.model.Gym;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.pojo.PasswordForm;
import it.gym.service.*;
import it.gym.utility.PasswordGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.MailException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;


@Component
@PropertySource("application.yml")
@Transactional
public class AuthenticationFacade {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFacade.class);

    private static final String EMAIL_REGISTRATION_EX_MESSAGE = "Non è stato possibile inviare l'email a %s %s";

    @Autowired
    private GymService gymService;

    @Autowired
    private MailService mailService;

    @Autowired
    private PasswordValidationService passwordValidationService;

    @Autowired
    private RoleService roleService;

    @Autowired
    private VerificationTokenService tokenService;

    @Autowired private BCryptPasswordEncoder passwordEncoder;

    @Autowired
    private UserService userService;

    @Value("${baseUrl}") private String baseUrl;


    public AUser register(AUser user, Long gymId) {
        logger.info(String.format("User is being registered: %s", user.toString()));
        Gym gym = this.gymService.findById(gymId);
        user.setGym(gym);

        logger.info("Registering user");
        String password = generateRandomPassword();

        List<Long> rolesId = user.defaultRoles().stream().map(Role::getId).collect(Collectors.toList());

        List<Role> roles = roleService.findAllById(rolesId);
        user.setPassword(passwordEncoder.encode(password));
        user.setRoles(roles);
        user.setVerified(false);

        VerificationToken vk = tokenService.createOrChangeVerificationToken(user);

        if (userService.existsByEmail(user.getEmail()))
            throw new UserRegistrationException(String.format("L'utente con l'email %s esiste già.",user.getEmail()));
        else
            this.userService.save(user);

        try {

            this.sendRegistrationConfirmationEmail(user, vk, baseUrl);

        } catch (MailException e) {

            this.rollbackRegistration(vk);

            String message = String.format(EMAIL_REGISTRATION_EX_MESSAGE, user.getFirstName(), user.getLastName());
            throw new UserRegistrationException(message);
        }

        return user;
    }

    public AUser confirmRegistration(String email, String password) {
        passwordValidationService.validate(password);

        AUser user = this.userService.findByEmail(email);

        setPasswordToUser(user, password);
        invalidateTokenToUser(user);

        return userService.save(user);
    }

    public AUser changePassword(Long id, PasswordForm form) {
        confirmPassword(form.getPassword(), form.getConfirmPassword());
        confirmPasswordNotEqualToOld(form.getPassword(), form.getOldPassword());
        passwordValidationService.validate(form.getPassword());

        AUser user = this.userService.findById(id);

        setPasswordToUser(user, form.getPassword());
        invalidateTokenToUser(user);

        return userService.save(user);
    }

    public AUser forgotPassword(String email) {
        logger.info(String.format("Authentication: Find By Email: %s", email));
        AUser user = userService.findByEmail(email);
        if (user == null) throw new UserNotFoundException(email);

        if (!user.isVerified()) throw new UserIsNotVerified(email);

        VerificationToken vk = this.tokenService.createOrChangeVerificationToken(user);
        sendChangePasswordTokenToEmail(user, vk.getToken());
        return user;
    }


    public AUser getUserFromVerificationToken(String token) {
        VerificationToken vToken = tokenService.findByToken(token);

        if (vToken.isExpired()) {
            throw new ExpiredTokenException("Il token è scaduto.");
        }

        return vToken.getUser();
    }

    public AUser resendAnonymousToken(Long id) {
        AUser user = this.userService.findById(id);
        if (user.isVerified()) throw new UserIsVerified(user.getEmail());

        VerificationToken vk = this.tokenService.createOrChangeVerificationToken(user);
        sendVerificationEmail(vk, user);
        return user;

    }

    public AUser resendExpiredToken(String existingToken) {
        VerificationToken vk = this.tokenService.findByToken(existingToken);
        AUser user = vk.getUser();
        this.tokenService.createOrChangeVerificationToken(user);

        sendVerificationEmail(vk, user);
        return user;
    }

    private void rollbackRegistration(VerificationToken vk) {
        tokenService.delete(vk);
        userService.deleteById(vk.getUser().getId());
    }

    private String generateRandomPassword() {
        PasswordGenerator.PasswordGeneratorBuilder builder = new PasswordGenerator.PasswordGeneratorBuilder();
        builder.useDigits(true);
        builder.useLower(true);
        builder.usePunctuation(true);
        builder.useUpper(true);
        PasswordGenerator gen = builder.build();
        return gen.generate(30);
    }

    private void invalidateTokenToUser(AUser user) {
        VerificationToken token = tokenService.findByUser(user);
        this.tokenService.invalidateToken(token);
    }

    private void setPasswordToUser(AUser user, String password) {
        String encodedPassword = passwordEncoder.encode(password);
        user.setPassword(encodedPassword);
        user.setVerified(true);
    }

    private void confirmPassword(String password, String confirmPassword) {
        if (!confirmPassword.equals(password))
            throw new InvalidPasswordException("Le password non coincidono");
    }

    private void confirmPasswordNotEqualToOld(String password, String oldPassword) {
        if (oldPassword.equals(password))
            throw new InvalidPasswordException("Nuova password coincide con la precedente");
    }

    private void sendRegistrationConfirmationEmail(AUser user, VerificationToken token, String appUrl) {
        String recipientAddress = user.getEmail();
        String subject = "Conferma la registrazione";
        String confirmationUrl = appUrl + "/auth/verification?token=" + token;
        String message = "Per registrare autenticati al seguente indirizzo: ";
        this.mailService.sendSimpleMail(recipientAddress, subject, confirmationUrl, message);
    }

    private void sendChangePasswordTokenToEmail(AUser user, String token) {
        String recipientAddress = user.getEmail();
        String subject = "Cambia la tua password";
        String confirmationUrl = this.baseUrl+ "/auth/modifyPassword?token=" + token;
        String message = "Per modificare la password usa il seguente link: ";
        this.mailService.sendSimpleMail(recipientAddress, subject, confirmationUrl, message);
    }

    private void sendVerificationEmail(VerificationToken newToken, AUser user) {
        String subject = "Verifica Account";
        String recipientAddress = user.getEmail();
        String confirmationUrl = this.baseUrl+ "/auth/verification?token=" + newToken.getToken();
        String message = "Ti abbiamo generato un nuovo link di verifica: ";
        this.mailService.sendSimpleMail(recipientAddress, subject, confirmationUrl, message);
    }
}
