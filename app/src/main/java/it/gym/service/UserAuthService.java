package it.gym.service;

import it.gym.exception.InvalidTokenException;
import it.gym.exception.TokenNotFoundException;
import it.gym.exception.UserRegistrationException;
import it.gym.model.AUser;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.repository.RoleRepository;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@PropertySource("application.yml")
public class UserAuthService implements IUserAuthService {

    private final static Logger logger = LoggerFactory.getLogger(UserAuthService.class);

    @Autowired
    private BCryptPasswordEncoder passwordEncoder;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private VerificationTokenRepository tokenRepository;
    @Autowired
    @Qualifier("mailSender")
    private JavaMailSender mailSender;
    @Autowired
    private PasswordValidationService passwordValidationService;

    @Value("${baseUrl}")
    private String baseUrl;

    @Override
    public AUser register(AUser input) {
        logger.info("Processing user");

        passwordValidationService.validate(input.getPassword());

        List<Long> rolesId = input.defaultRoles().stream().map(Role::getId).collect(Collectors.toList());
        input.setPassword(passwordEncoder.encode(input.getPassword()));
        List<Role> roles = roleRepository.findAllById(rolesId);
        input.setRoles(roles);

        input.setVerified(false);
        logger.info("Saving user");

        input = this.userRepository.save(input);

        String token = createRandomToken();

        VerificationToken vToken = createOrChangeVerificationToken(input, token);
        try {

            sendEmailForConfirmation(input, token);

        } catch (MailException e) {
            logger.info(e.toString());
            this.tokenRepository.delete(vToken);
            this.userRepository.deleteById(input.getId());
            String message = String.format("Non è stato possibile inviare l'email a %s %s",
                    input.getFirstName(),
                    input.getLastName());
            throw new UserRegistrationException(message);
        }

        return input;
    }

    private String createRandomToken() {
        return UUID.randomUUID().toString();
    }

    private void sendEmailForConfirmation(AUser user, String token) {

        String recipientAddress = user.getEmail();
        String subject = "Conferma la registrazione";
        String confirmationUrl
                = this.baseUrl+ "/auth/verification?token=" + token;
        String message = "Per registrare autenticati al seguente indirizzo: ";

        sendMail(recipientAddress, subject, confirmationUrl, message);
    }

    private void sendMail(String recipientAddress, String subject, String confirmationUrl, String message) {
        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message + confirmationUrl);
        mailSender.send(email);
    }

    @Override
    public VerificationToken createOrChangeVerificationToken(AUser user, String sToken) {
        Optional<VerificationToken> opt = tokenRepository.findByUser(user);
        VerificationToken vk;
        vk = opt.orElseGet(() -> new VerificationToken(user, sToken));
        vk.setToken(sToken);
        return saveToken(vk);
    }

    private VerificationToken saveToken(VerificationToken token) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(new Date());
        cal.add(Calendar.MINUTE, VerificationToken.EXPIRATION);
        token.setExpiryDate(cal.getTime());
        return tokenRepository.save(token);
    }

    @Override
    public VerificationToken getVerificationToken(String token) {
        VerificationToken vToken = tokenRepository.findByToken(token);
        if (vToken != null) {
            return vToken;
        }
        throw new TokenNotFoundException();
    }

    @Override
    public VerificationToken generateNewVerificationToken(String existingToken) {
        VerificationToken token = this.tokenRepository.findByToken(existingToken);
        token.setToken(createRandomToken());
        return saveToken(token);
    }

    @Override
    public AUser changePassword(String email, String password) {
        AUser user = this.userRepository.findByEmail(email);
        passwordValidationService.validate(password);
        logger.info("Password is validated");
        user.setPassword(passwordEncoder.encode(password));
        user.setVerified(true);
        VerificationToken token = tokenRepository.findByUser(user).orElseThrow(() -> new TokenNotFoundException());
        invalidateToken(token);
        return userRepository.save(user);
    }

    private void invalidateToken(VerificationToken token) {
        token.setExpiryDate(new Date());
        tokenRepository.save(token);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        logger.info("The email " + email);
        try {
            AUser user = userRepository.findByEmail(email);
            if (user == null) {
                throw new UsernameNotFoundException("No user found with username: " + email);
            }
            User u = new User(
                    user.getEmail(),
                    user.getPassword(),
                    user.isVerified(),
                    true,
                    true,
                    true,
                    mapRolesToAuthorities(user.getRoles()));
            logger.info(u.toString());
            return u;
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    private Collection<? extends GrantedAuthority> mapRolesToAuthorities(Collection<Role> roles){
        return roles.stream()
                .map(role -> new SimpleGrantedAuthority(role.getName()))
                .collect(Collectors.toList());
    }

    public BCryptPasswordEncoder getPasswordEncoder() {
        return passwordEncoder;
    }

    public void setPasswordEncoder(BCryptPasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public JavaMailSender getMailSender() {
        return mailSender;
    }

    public void setMailSender(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void setPasswordValidationService(PasswordValidationService passwordValidationService) {
        this.passwordValidationService = passwordValidationService;
    }

    public PasswordValidationService getPasswordValidationService() {
        return passwordValidationService;
    }

    public String getBaseUrl() {
        return baseUrl;
    }

    public void setBaseUrl(String baseUrl) {
        this.baseUrl = baseUrl;
    }

    public RoleRepository getRoleRepository() {
        return roleRepository;
    }

    public void setRoleRepository(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    public VerificationTokenRepository getTokenRepository() {
        return tokenRepository;
    }

    public void setTokenRepository(VerificationTokenRepository tokenRepository) {
        this.tokenRepository = tokenRepository;
    }

    public UserRepository getUserRepository() {
        return userRepository;
    }

    public void setUserRepository(UserRepository userRepository) {
        this.userRepository = userRepository;
    }
}
