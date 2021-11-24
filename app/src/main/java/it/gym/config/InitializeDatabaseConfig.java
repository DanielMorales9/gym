package it.gym.config;

import it.gym.facade.TrainingBundleSpecificationFacade;
import it.gym.model.*;
import it.gym.service.GymService;
import it.gym.service.RoleService;
import it.gym.service.TenantService;
import it.gym.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.List;

@Component
@EnableScheduling
@ConditionalOnProperty(
    name = "it.gym.enabled",
    havingValue = "true",
    matchIfMissing = true)
public class InitializeDatabaseConfig implements CommandLineRunner {

  private static final String DEV_ENV = "dev";

  @Autowired private CustomProperties properties;

  @Autowired
  @Qualifier("roleService")
  private RoleService roleService;

  @Autowired private TenantService tenantService;

  @Autowired private UserService userService;

  @Autowired private PasswordEncoder passwordEncoder;

  @Autowired private GymService gymService;

  @Autowired
  @Qualifier("trainingBundleSpecificationFacade")
  private TrainingBundleSpecificationFacade specService;

  @Autowired private Environment env;

  @Override
  public void run(String... args) {
    if (isDev()) {

      Tenant tenant = createTenant();
      boolean exists = tenantService.existsByTenant(tenant);
      if (exists) {
        tenant = tenantService.findTenantBySchemaName(tenant.getSchemaName());
      } else {
        tenant = tenantService.createTenant(tenant);
      }

      // setting Current Tenant Schema for multi-tenant access
      TenantContext.setCurrentTenantSchema(tenant.getSchemaName());

      List<Role> roles = retrieveRoles();

      if (userService.findByEmail(properties.getAdminEmail()) == null) {
        createAndSaveGym();
        createAndSaveAdmin(roles);
      }

      createAndSaveCustomer(new ArrayList<>(roles.subList(2, 3)));
      createAndSaveTrainer(new ArrayList<>(roles.subList(1, 2)));
      createAndSavePersonalBundleSpecification();
      createAndSaveCourseBundleSpecification();
    }
  }

  private boolean isDev(String... args) {
    if (args.length > 0) {
      return args[0].equals("test");
    } else {
      return env.getActiveProfiles()[0].equals(DEV_ENV);
    }
  }

  private Tenant createTenant() {
    Tenant tenant = new Tenant();
    tenant.setSchemaName(properties.getSchema());
    tenant.setTenantName(properties.getSchema());
    return tenant;
  }

  private void createAndSaveCourseBundleSpecification() {
    String name = "Corso";
    if (!specService.existsByName(name))
      specService.createTrainingBundleSpecification(
          createCourseBundleSpecification(name));
  }

  private void createAndSavePersonalBundleSpecification() {
    String name = "Personal";
    if (!specService.existsByName(name))
      specService.createTrainingBundleSpecification(
          createPersonalBundleSpecification(name));
  }

  private void createAndSaveTrainer(List<Role> roles) {
    String password = passwordEncoder.encode(properties.getDefaultPassword());
    Trainer trainer = createTrainer(password, roles);
    if (!userService.existsByEmail(trainer.getEmail()))
      userService.save(trainer);
  }

  private void createAndSaveCustomer(List<Role> roles) {
    String password = passwordEncoder.encode(properties.getDefaultPassword());
    Customer customer = createCustomer(password, roles);
    if (!userService.existsByEmail(customer.getEmail()))
      userService.save(customer);
  }

  private void createAndSaveAdmin(List<Role> roles) {
    String password = passwordEncoder.encode(properties.getDefaultPassword());
    Admin admin = createAdmin(password, roles);
    if (!userService.existsByEmail(admin.getEmail())) userService.save(admin);
  }

  private void createAndSaveGym() {
    Gym gym = createGym();
    gymService.save(gym);
  }

  private List<Role> retrieveRoles() {
    return roleService.findAll();
  }

  private ATrainingBundleSpecification createCourseBundleSpecification(
      String name) {
    CourseTrainingBundleSpecification p =
        new CourseTrainingBundleSpecification();
    p.setName(name);
    p.setDescription("Questo è un pacchetto Corso");
    p.setDisabled(false);
    p.setUnlimitedDeletions(Boolean.TRUE);
    TimePurchaseOption option = new TimePurchaseOption();
    option.setPrice(111.0);
    option.setName("option");
    option.setNumber(1);
    p.addOption(option);
    p.setMaxCustomers(11);
    return p;
  }

  private ATrainingBundleSpecification createPersonalBundleSpecification(
      String name) {
    PersonalTrainingBundleSpecification p =
        new PersonalTrainingBundleSpecification();
    p.setName(name);
    p.setDescription("Questo è un pacchetto di Personal Training");
    p.setDisabled(false);
    p.setUnlimitedDeletions(Boolean.TRUE);

    ArrayList<APurchaseOption> options = new ArrayList<>();
    APurchaseOption option = new BundlePurchaseOption();
    option.setNumber(11);
    option.setPrice(111.0);
    option.setName(p.getName());
    options.add(option);
    p.setOptions(options);
    return p;
  }

  private Admin createAdmin(String password, List<Role> roles) {
    Admin admin = new Admin();
    admin.setEmail(properties.getAdminEmail());
    admin.setFirstName("Admin");
    admin.setLastName("Admin");
    admin.setPassword(password);
    admin.setVerified(true);
    admin.setRoles(roles);
    return admin;
  }

  private Customer createCustomer(String password, List<Role> roles) {
    Customer customer = new Customer();
    customer.setEmail("pippo@email.com");
    customer.setFirstName("Pippo");
    customer.setLastName("Pippo");
    customer.setPassword(password);
    customer.setVerified(true);
    customer.setRoles(roles);
    return customer;
  }

  private Trainer createTrainer(String password, List<Role> roles) {
    Trainer trainer = new Trainer();
    trainer.setEmail("pluto@email.com");
    trainer.setFirstName("Pluto");
    trainer.setLastName("Pluto");
    trainer.setPassword(password);
    trainer.setVerified(true);
    trainer.setRoles(roles);
    return trainer;
  }

  private Gym createGym() {
    Gym gym = new Gym();
    gym.setName("MyGym");
    gym.setReservationBeforeHours(6);
    gym.setMondayStartHour(8);
    gym.setMondayEndHour(22);
    gym.setMondayOpen(true);
    gym.setTuesdayStartHour(8);
    gym.setTuesdayEndHour(22);
    gym.setTuesdayOpen(true);
    gym.setWednesdayStartHour(8);
    gym.setWednesdayEndHour(22);
    gym.setWednesdayOpen(true);
    gym.setThursdayStartHour(8);
    gym.setThursdayEndHour(22);
    gym.setThursdayOpen(true);
    gym.setFridayStartHour(8);
    gym.setFridayEndHour(22);
    gym.setFridayOpen(true);
    gym.setSaturdayStartHour(8);
    gym.setSaturdayEndHour(22);
    gym.setSaturdayOpen(true);
    gym.setSundayStartHour(0);
    gym.setSundayEndHour(0);
    gym.setSundayOpen(false);
    gym.setWeekStartsOn(DayOfWeek.MONDAY);
    return gym;
  }
}
