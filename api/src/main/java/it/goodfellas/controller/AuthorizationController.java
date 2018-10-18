package it.goodfellas.controller;

import it.goodfellas.exception.AdminNotFoundException;
import it.goodfellas.exception.InvalidTokenException;
import it.goodfellas.exception.POJONotFoundException;
import it.goodfellas.hateoas.*;
import it.goodfellas.model.*;
import it.goodfellas.repository.RoleRepository;
import it.goodfellas.repository.UserRepository;
import it.goodfellas.service.AdminService;
import it.goodfellas.service.IUserAuthService;
import it.goodfellas.utility.Constants;
import it.goodfellas.utility.PasswordGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.security.Principal;
import java.util.Calendar;

@RestController
public class AuthorizationController {
    private final static Logger logger = LoggerFactory.getLogger(AuthorizationController.class);

    private IUserAuthService userService;
    private final AdminService adminService;
    private final UserRepository userRepository;
    private final JavaMailSender mailSender;
    private final RoleRepository roleRepository;

    @Autowired
    public AuthorizationController(AdminService adminService,
                                   UserRepository userRepository,
                                   JavaMailSender mailSender,
                                   RoleRepository roleRepository) {
        this.adminService = adminService;
        this.userRepository = userRepository;
        this.mailSender = mailSender;
        this.roleRepository = roleRepository;
    }


    /*
        @PostMapping(path = "/auth/customer/signup")
        ResponseEntity<CustomerResource> customerSignup(@Valid @RequestBody Customer input) {
            logger.info("Customer is trying to register: " + input.toString());


            AUser c = userService.register(input);
            return new ResponseEntity<>(
                    new CustomerAssembler().toResource((Customer) c), HttpStatus.OK);
        }*/

    @PostMapping(path = "/auth/customer/registration")
    ResponseEntity<CustomerResource> customerRegistration(@Valid @RequestBody Customer input,
                                                          Principal principal) {
        logger.info("Customer is trying to register: " + input.toString());

        setRandomPassword(input);

        AUser c = userService.register(input);
        return new ResponseEntity<>(
                new CustomerAssembler().toResource((Customer) c), HttpStatus.OK);
    }

    @PostMapping(path = "/auth/trainer/registration")
    ResponseEntity<TrainerResource> trainerRegistration(@Valid @RequestBody Trainer input,
                                                        Principal principal) {
        logger.info("Trainer is trying to register: " + input.toString());

        setRandomPassword(input);

        AUser c = userService.register(input);
        return new ResponseEntity<>(
                new TrainerAssembler().toResource((Trainer) c), HttpStatus.OK);
    }

    @PostMapping(path = "/auth/admin/registration")
    ResponseEntity<AdminResource> adminRegistration(@Valid @RequestBody Admin input,
                                                    Principal principal) {
        logger.info("Admin is trying to register: " + input.toString());

        setRandomPassword(input);

        AUser c = userService.register(input);
        return new ResponseEntity<>(
                new AdminAssembler().toResource((Admin) c), HttpStatus.OK);
    }

    @PostMapping("/auth/customer/changePassword")
    ResponseEntity<CustomerResource> changeCustomerPassword(@RequestBody Customer user) {
        logger.info(user.toString());
        user = (Customer) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new CustomerAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/auth/admin/changePassword")
    ResponseEntity<AdminResource> changeAdminPassword(@RequestBody Admin user) {
        user = (Admin) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new AdminAssembler().toResource(user), HttpStatus.OK);
    }

    @PostMapping("/auth/trainer/changePassword")
    ResponseEntity<TrainerResource> changeTrainerPassword(@RequestBody Trainer user) {
        user = (Trainer) userService.changePassword(user.getEmail(), user.getPassword());
        return new ResponseEntity<>(new TrainerAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/auth/verification")
    ResponseEntity<AUserResource> verify(@RequestParam String token) {

        VerificationToken verificationToken = userService.getVerificationToken(token);
        if (verificationToken == null) {
            throw new InvalidTokenException();
        }

        AUser user = verificationToken.getUser();
        Calendar cal = Calendar.getInstance();
        if ((verificationToken.getExpiryDate().getTime() - cal.getTime().getTime()) <= 0) {
            return new ResponseEntity<>(
                    new AUserAssembler().toResource(user), HttpStatus.NOT_EXTENDED);
        }
        return new ResponseEntity<>(
                new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @GetMapping(path = "/auth/resendToken")
    public ResponseEntity resendRegistrationToken(@RequestParam("token") String existingToken) {
        VerificationToken newToken = userService.generateNewVerificationToken(existingToken);
        logger.info("RESEND TOKEN");
        Long userId = newToken.getUser().getId();
        AUser user = this.userRepository.findById(userId)
                .orElseThrow(() -> new POJONotFoundException("User", userId));

        sendEmailWithToken(newToken, user);

        return new ResponseEntity<>(
                new AUserAssembler().toResource(user), HttpStatus.OK);
    }

    @PutMapping(path = "/auth/users/{userId}/roles/{roleId}")
    ResponseEntity<AUserResource> addRoleToUser(@PathVariable Long userId,
                                                @PathVariable Long roleId) {
        AUser user = this.userRepository.findById(userId)
                .orElseThrow(() -> new POJONotFoundException("User", userId));

        Role role = this.roleRepository.findById(roleId)
                .orElseThrow(() -> new POJONotFoundException("Role", roleId));

        if (!user.getRoles().contains(role)) {
            user.addRole(role);
            user = this.userRepository.save(user);
        }
        return ResponseEntity.ok(new AUserAssembler().toResource(user));
    }

    private void setRandomPassword(@Valid @RequestBody AUser input) {
        PasswordGenerator.PasswordGeneratorBuilder builder = new PasswordGenerator.PasswordGeneratorBuilder();
        builder.useDigits(true);
        builder.useLower(true);
        builder.usePunctuation(true);
        builder.useUpper(true);
        PasswordGenerator gen = builder.build();

        String password = gen.generate(30);
        logger.info(password);
        input.setPassword(password);
    }

    private void sendEmailWithToken(VerificationToken newToken, AUser user) {
        String recipientAddress = user.getEmail();
        String subject = "Verifica Account";
        String confirmationUrl
                = Constants.BASE_URL+ "/verification?token=" + newToken.getToken();
        String message = "Ti abbiamo generato un nuovo link di verifica: ";

        SimpleMailMessage email = new SimpleMailMessage();
        email.setTo(recipientAddress);
        email.setSubject(subject);
        email.setText(message + confirmationUrl);
        mailSender.send(email);
    }

    @Autowired
    @Qualifier("userAuthService")
    public void setUserService(IUserAuthService userService) {
        this.userService = userService;
    }
}
