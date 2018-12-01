package it.goodfellas.service;

import it.goodfellas.model.AUser;
import it.goodfellas.model.DefaultRoles;
import it.goodfellas.model.Role;
import it.goodfellas.model.VerificationToken;
import it.goodfellas.repository.RoleRepository;
import it.goodfellas.repository.UserRepository;
import it.goodfellas.repository.VerificationTokenRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.core.AuthenticatedPrincipal;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.function.Function;
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

        List<Long> rolesId = input.getDefaultRoles().stream().map(Role::getId).collect(Collectors.toList());
        input.setPassword(passwordEncoder.encode(input.getPassword()));
        List<Role> roles = roleRepository.findAllById(rolesId);
        input.setRoles(roles);

        input.setVerified(false);
        logger.info("Saving user");

        input = this.userRepository.save(input);

        confirmRegistration(input);

        return input;
    }

    private void confirmRegistration(AUser user) {
        String token = UUID.randomUUID().toString();
        createVerificationToken(user, token);

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
    public void createVerificationToken(AUser user, String sToken) {
        VerificationToken token = new VerificationToken(user, sToken);
        saveToken(token);
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
        return tokenRepository.findByToken(token);
    }

    @Override
    public VerificationToken generateNewVerificationToken(String existingToken) {
        VerificationToken token = this.tokenRepository.findByToken(existingToken);
        return saveToken(token);
    }

    @Override
    public AUser changePassword(String email, String password) {
        AUser user = this.userRepository.findByEmail(email);
        passwordValidationService.validate(password);
        logger.info("validated");
        user.setPassword(passwordEncoder.encode(password));
        user.setVerified(true);
        user.setUpdatedAt(new Date());
        return userRepository.save(user);
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
