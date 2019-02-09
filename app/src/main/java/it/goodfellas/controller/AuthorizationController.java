package it.goodfellas.controller;

import it.goodfellas.exception.*;
import it.goodfellas.hateoas.*;
import it.goodfellas.model.*;
import it.goodfellas.repository.RoleRepository;
import it.goodfellas.repository.UserRepository;
import it.goodfellas.repository.VerificationTokenRepository;
import it.goodfellas.service.IUserAuthService;
import it.goodfellas.utility.MailSenderUtility;
import it.goodfellas.utility.PasswordGenerator;
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

    @PostMapping(path = "/customer/registration")
    ResponseEntity<CustomerResource> customerRegistration(@Valid @RequestBody Customer input) {
        logger.info("Customer is trying to register: " + input.toString());
        AUser c = registerUser(input);
        return new ResponseEntity<>(new CustomerAssembler().toResource((Customer) c), HttpStatus.OK);

    }

    @PostMapping(path = "/trainer/registration")
    ResponseEntity<TrainerResource> trainerRegistration(@Valid @RequestBody Trainer input) {
        logger.info("Trainer is trying to register: " + input.toString());
        AUser c = registerUser(input);
        return new ResponseEntity<>(new TrainerAssembler().toResource((Trainer) c), HttpStatus.OK);
    }


    @PostMapping(path = "/admin/registration")
    ResponseEntity<AdminResource> adminRegistration(@Valid @RequestBody Admin input) {
        logger.info("Admin is trying to register: " + input.toString());
        AUser c = registerUser(input);
        return new ResponseEntity<>(new AdminAssembler().toResource((Admin) c), HttpStatus.OK);
    }

    @PostMapping("/customer/verifyPassword")
    ResponseEntity<CustomerResource> changeCustomerPassword(@RequestBody Customer user) {
        logger.info("About to change password for customer");
        user = (Customer) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new CustomerAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/admin/verifyPassword")
    ResponseEntity<AdminResource> changeAdminPassword(@RequestBody Admin user) {
        logger.info("About to change password for admin");
        user = (Admin) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AdminAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/trainer/verifyPassword")
    ResponseEntity<TrainerResource> changeTrainerPassword(@RequestBody Trainer user) {
        logger.info("About to change password for trainer");
        user = (Trainer) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new TrainerAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/customer/changePassword")
    ResponseEntity<AUserResource> modifyCustomerPassword(@RequestBody Customer user) {
        logger.info("About to change password for customer");
        AUser u = userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(u), HttpStatus.OK);
    }

    @PostMapping("/trainer/changePassword")
    ResponseEntity<AUserResource> modifyTrainerPassword(@RequestBody Trainer user) {
        logger.info("About to change password for trainer");
        AUser u = userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AUserAssembler().toResource(u), HttpStatus.OK);
    }

    @PostMapping("/admin/changePassword")
    ResponseEntity<AUserResource> modifyAdminPassword(@RequestBody Admin user) {
        logger.info("About to change password for admin");
        AUser u = userService.changePassword(user.getEmail(), user.getPassword());
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
    ResponseEntity<AUserResource> findByEmail(@RequestParam String email) {
        logger.info("Authentication: Find By Email: " + email);
        AUser user = userRepository.findByEmail(email);

        if (user.isVerified()) {
            String token = UUID.randomUUID().toString();
            userService.createVerificationToken(user, token);
            sendChangePasswordTokenToEmail(user, token);
            return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
        }
        throw new UserVerifiedException(user);
    }

    @GetMapping(path = "/resendToken/{id}")
    public ResponseEntity resendRegistrationToken(@PathVariable("id") Long id) {
        AUser user = this.userRepository.findById(id).orElseThrow(() -> new UserNotFoundException(id));
        if (user.isVerified()) {
            throw new UserIsVerified(id);
        }
        VerificationToken token = this.tokenRepository.findByUser(user);
        VerificationToken newToken = userService.generateNewVerificationToken(token.getToken());
        sendVerificationEmail(newToken, user);

        return new ResponseEntity<>(new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/resendChangePasswordToken")
    public ResponseEntity resendChangePasswordToken(@RequestParam("token") String existingToken) {
        VerificationToken newToken = getVerificationToken(existingToken);
        sendChangePasswordTokenToEmail(newToken.getUser(), newToken.getToken());
        return new ResponseEntity<>(new AUserAssembler().toResource(newToken.getUser()), HttpStatus.OK);
    }

    @GetMapping(path = "/resendToken/")
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
        AUser user = newToken.getUser();
        long userId = user.getId();
        if (!this.userRepository.existsById(user.getId())) throw new UserNotFoundException(userId);
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
