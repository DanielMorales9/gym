package it.gym.controller;

import it.gym.exception.*;
import it.gym.hateoas.AUserAssembler;
import it.gym.hateoas.AUserResource;
import it.gym.model.AUser;
import it.gym.model.Role;
import it.gym.model.VerificationToken;
import it.gym.pojo.Credentials;
import it.gym.pojo.PasswordForm;
import it.gym.repository.RoleRepository;
import it.gym.repository.UserRepository;
import it.gym.repository.VerificationTokenRepository;
import it.gym.service.IUserAuthService;
import it.gym.utility.MailSenderUtility;
import it.gym.utility.PasswordGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import java.util.Calendar;
import java.util.UUID;

@RestController
@PropertySource("application.yml")
@RequestMapping("/authentication")
public class AuthorizationController {
    private final static Logger logger = LoggerFactory.getLogger(AuthorizationController.class);

    private IUserAuthService userService;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final RoleRepository roleRepository;
    private final VerificationTokenRepository tokenRepository;

    private final PasswordEncoder passwordEncoder;

    @Value("${baseUrl}")
    private String baseUrl;

    @Autowired
    public AuthorizationController(UserRepository userRepository,
                                   JavaMailSender mailSender,
                                   VerificationTokenRepository tokenRepository,
                                   RoleRepository roleRepository,
                                   PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.tokenRepository = tokenRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }


    @Autowired
    @Qualifier("userAuthService")
    public void setUserService(IUserAuthService userService) {
        this.userService = userService;
    }

    @PostMapping(path = "/registration")
    @Transactional
    ResponseEntity<AUserResource> registration(@Valid @RequestBody AUser input) {
        logger.info("User is trying to register: " + input.toString());
        AUser c = registerUser(input);
        return ResponseEntity.ok(new AUserAssembler().toResource(c));

    }

    @PostMapping("/verifyPassword")
    @Transactional
    ResponseEntity<AUserResource> changeUserPassword(@RequestBody Credentials credentials) {
        logger.info("About to verify password for user");
        AUser user = userService.changePassword(credentials.getEmail(), credentials.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/changePassword")
    @Transactional
    ResponseEntity<AUserResource> modifyPassword(@RequestBody Credentials credentials) {
        logger.info("About to change password for customer");
        AUser u = userService.changePassword(credentials.getEmail(), credentials.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(u), HttpStatus.OK);
    }

    @PostMapping("/changeNewPassword/{id}")
    ResponseEntity<AUserResource> changeNewPassword(@PathVariable("id") Long id, @RequestBody PasswordForm form) {
        AUser user = this.userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        if (!user.isVerified())
            throw new UserIsNotVerified(id);

        if (!passwordEncoder.matches(form.getOldPassword(), user.getPassword()))
            throw new InvalidPasswordException("La vecchia password sbagliata.");

        if (!form.getConfirmPassword().equals(form.getPassword()))
            throw new InvalidPasswordException("Le password non coincidono.");

        String newPwd = passwordEncoder.encode(form.getPassword());
        user.setPassword(newPwd);
        user.setConfirmPassword(newPwd);
        user = this.userRepository.save(user);
        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/verification")
    ResponseEntity<AUserResource> verify(@RequestParam String token) {
        logger.info("Verification has just started");
        VerificationToken verificationToken = userService.getVerificationToken(token);

        AUser user = verificationToken.getUser();

        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            throw new ExpiredTokenException("Il token è scaduto.");
        }

        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @PutMapping(path = "/users/{userId}/roles/{roleId}")
    @Transactional
    @Deprecated
    ResponseEntity<AUserResource> addRoleToUser(@PathVariable Long userId, @PathVariable Long roleId) {
        AUser user = this.userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException(userId));
        Role role = this.roleRepository.findById(roleId).orElseThrow(() -> new RoleNotFoundException(roleId));
        if (!user.getRoles().contains(role)) {
            user.addRole(role);
            user = this.userRepository.save(user);
        }
        return ResponseEntity.ok(new AUserAssembler().toResource(user));
    }

    @GetMapping(path = "/findByEmail")
    @Transactional
    ResponseEntity<AUserResource> findByEmail(@RequestParam String email) {
        logger.info("Authentication: Find By Email: " + email);
        AUser user = userRepository.findByEmail(email);
        if (user == null) throw new UserNotFoundException(email);

        if (!user.isVerified()) throw new UserIsNotVerified(email);

        String token = UUID.randomUUID().toString();
        userService.createVerificationToken(user, token);
        sendChangePasswordTokenToEmail(user, token);

        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken/{id}")
    @Transactional
    public ResponseEntity resendRegistrationToken(@PathVariable("id") Long id) {
        AUser user = this.userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        if (user.isVerified()) throw new UserIsVerified(id);

        VerificationToken token = this.tokenRepository.findByUser(user);
        VerificationToken newToken = userService.generateNewVerificationToken(token.getToken());
        sendVerificationEmail(newToken, user);

        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendChangePasswordToken")
    @Transactional
    public ResponseEntity resendChangePasswordToken(@RequestParam("token") String existingToken) {
        VerificationToken newToken = getVerificationToken(existingToken);
        sendChangePasswordTokenToEmail(newToken.getUser(), newToken.getToken());
        return new ResponseEntity<>(new AUserAssembler().toResource(newToken.getUser()), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken")
    @Transactional
    public ResponseEntity resendTokenAnonymous(@RequestParam("token") String existingToken) {
        VerificationToken newToken = getVerificationToken(existingToken);
        sendVerificationEmail(newToken, newToken.getUser());

        return new ResponseEntity<>(new AUserAssembler().toResource(newToken.getUser()), HttpStatus.OK);
    }

    private void sendVerificationEmail(VerificationToken newToken, AUser user) {
        String subject = "Verifica Account";
        String recipientAddress = user.getEmail();
        String confirmationUrl = this.baseUrl+ "/auth/verification?token=" + newToken.getToken();
        String message = "Ti abbiamo generato un nuovo link di verifica: ";
        MailSenderUtility.sendEmail(this.mailSender, subject, message+confirmationUrl, recipientAddress);
    }

    private void sendChangePasswordTokenToEmail(AUser user, String token) {
        String recipientAddress = user.getEmail();
        String subject = "Cambia la tua password";
        String confirmationUrl = this.baseUrl+ "/auth/modifyPassword?token=" + token;
        String message = "Per modificare la password usa il seguente link: ";
        MailSenderUtility.sendEmail(this.mailSender, subject,message+confirmationUrl, recipientAddress);
    }

    private VerificationToken getVerificationToken(@RequestParam("token") String existingToken) {
        VerificationToken newToken = userService.generateNewVerificationToken(existingToken);
        long userId = newToken.getUser().getId();
        if (!this.userRepository.existsById(userId)) throw new UserNotFoundException(userId);

        return newToken;
    }

    private void setRandomPassword(@Valid @RequestBody AUser input) {
        PasswordGenerator.PasswordGeneratorBuilder builder = new PasswordGenerator.PasswordGeneratorBuilder();
        builder.useDigits(true);
        builder.useLower(true);
        builder.usePunctuation(true);
        builder.useUpper(true);
        PasswordGenerator gen = builder.build();
        String password = gen.generate(30);
        input.setPassword(password);
    }

    private AUser registerUser(@RequestBody @Valid AUser input) {
        setRandomPassword(input);
        return userService.register(input);
    }


}
