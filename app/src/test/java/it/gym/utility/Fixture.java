package it.gym.utility;

import static org.apache.commons.lang3.time.DateUtils.addMonths;

import it.gym.model.*;
import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

public class Fixture {

  public static Customer createCustomer(
      long id,
      String email,
      String password,
      String firstName,
      String lastName,
      boolean verified,
      List<Role> roles,
      boolean gender) {
    Customer user = new Customer();
    user.setId(id);
    user.setEmail(email);
    user.setFirstName(firstName);
    user.setLastName(lastName);
    user.setRoles(roles);
    user.setVerified(verified);
    user.setPassword(password);
    user.setGender(gender);
    return user;
  }

  public static VerificationToken createToken(
      long id, String token, AUser u, Date expiryDate) {
    VerificationToken vk = new VerificationToken();
    vk.setId(id);
    vk.setToken(token);
    vk.setExpiryDate(expiryDate);
    vk.setUser(u);
    return vk;
  }

  public static Gym createGym(long id) {
    Gym gym = new Gym();
    gym.setId(id);
    gym.setWeekStartsOn(DayOfWeek.MONDAY);
    gym.setMondayOpen(true);
    gym.setMondayStartHour(8);
    gym.setMondayEndHour(22);
    gym.setTuesdayStartHour(8);
    gym.setTuesdayEndHour(22);
    gym.setWednesdayStartHour(8);
    gym.setWednesdayEndHour(22);
    gym.setThursdayStartHour(8);
    gym.setThursdayEndHour(22);
    gym.setFridayStartHour(8);
    gym.setFridayEndHour(22);
    gym.setSaturdayStartHour(8);
    gym.setSaturdayEndHour(13);
    gym.setTuesdayOpen(true);
    gym.setWednesdayOpen(true);
    gym.setThursdayOpen(true);
    gym.setFridayOpen(true);
    gym.setSaturdayOpen(true);
    gym.setSundayOpen(false);
    gym.setReservationBeforeHours(6);
    gym.setNumEvents(2);
    gym.setMinutesBetweenEvents(0);
    return gym;
  }

  public static Sale createSale(long id, Customer customer) {
    Sale sale = new Sale();
    sale.setId(id);
    sale.setCustomer(customer);
    sale.setAmountPayed(0.0);
    sale.setCompleted(false);
    return sale;
  }

  public static PersonalTrainingBundleSpecification createPersonalBundleSpec(
      long id, String name, List<APurchaseOption> options) {
    PersonalTrainingBundleSpecification specs =
        new PersonalTrainingBundleSpecification();
    specs.setId(id);
    specs.setName(name);
    specs.setDescription("Description");
    specs.setOptions(options);
    specs.setDisabled(false);
    specs.setNumDeletions(0);
    specs.setUnlimitedDeletions(true);
    return specs;
  }

  public static PersonalTrainingSession createPersonalTrainingSession(
      long id, ATrainingBundle bundleSpec) {
    PersonalTrainingSession pt = new PersonalTrainingSession();
    pt.setCompleted(false);
    pt.setStartTime(new Date());
    pt.setEndTime(new Date());
    pt.setId(id);
    pt.setTrainingBundle(bundleSpec);
    return pt;
  }

  public static PersonalTrainingBundle createPersonalBundle(
      long id,
      ATrainingBundleSpecification spec,
      APurchaseOption aPurchaseOption) {
    PersonalTrainingBundle pt = new PersonalTrainingBundle();
    pt.setName("Winter Pack");
    pt.setBundleSpec(spec);
    pt.setId(id);
    pt.setNumDeletions(0);
    pt.setUnlimitedDeletions(true);
    pt.setOption(aPurchaseOption);
    return pt;
  }

  public static Workout createWorkout(long id) {
    Workout pt = new Workout();
    pt.setName("Workout");
    pt.setId(id);
    pt.setDescription("workout");
    pt.setTemplate(true);
    pt.setTag1("workout");
    pt.setCreatedAt(new Date());
    return pt;
  }

  public static Admin createAdmin(long id, String email, List<Role> roles) {
    Admin user = new Admin();
    user.setId(id);
    user.setEmail(email);
    user.setFirstName("admin");
    user.setLastName("admin");
    user.setGender(true);
    user.setRoles(roles);
    return user;
  }

  public static Trainer createTrainer(long id) {
    Trainer user = new Trainer();
    user.setId(id);
    user.setEmail("trainer@trainer.com");
    user.setFirstName("trainer");
    user.setLastName("trainer");
    user.setGender(true);
    return user;
  }

  public static AEvent createHoliday(
      long id, String name, Date start, Date end) {
    AEvent time = new Holiday();
    time.setId(id);
    time.setName(name);
    time.setStartTime(start);
    time.setEndTime(end);
    return time;
  }

  public static AEvent createTimeOff(
      long id, String name, Date start, Date end, AUser trainer) {
    TimeOff time = new TimeOff();
    time.setId(id);
    time.setName(name);
    time.setStartTime(start);
    time.setEndTime(end);
    time.setUser(trainer);
    return time;
  }

  public static Reservation createReservation(long id, Customer customer) {
    Reservation res = new Reservation();
    res.setId(id);
    res.setConfirmed(false);
    res.setUser(customer);
    return res;
  }

  public static CourseTrainingEvent createCourseEvent(
      long id,
      String name,
      Date startTime,
      Date endTime,
      ATrainingBundleSpecification specification) {
    CourseTrainingEvent course = new CourseTrainingEvent();
    course.setId(id);
    course.setStartTime(startTime);
    course.setEndTime(endTime);
    course.setName(name);
    course.setMaxCustomers(specification.getMaxCustomers());
    course.setSpecification(specification);
    return course;
  }

  public static PersonalTrainingEvent createPersonalEvent(
      long id, String name, Date startTime, Date endTime) {
    PersonalTrainingEvent personalTrainingEvent = new PersonalTrainingEvent();
    personalTrainingEvent.setId(id);
    personalTrainingEvent.setStartTime(startTime);
    personalTrainingEvent.setEndTime(endTime);
    personalTrainingEvent.setName(name);
    return personalTrainingEvent;
  }

  public static List<Role> createCustomerRoles() {
    Role role = createCustomerRole();
    return Collections.singletonList(role);
  }

  private static Role createCustomerRole() {
    Role role = new Role();
    role.setName("CUSTOMER");
    role.setId(3L);
    return role;
  }

  private static Role createTrainerRole() {
    Role role = new Role();
    role.setName("TRAINER");
    role.setId(2L);
    return role;
  }

  public static Role createAdminRole() {
    Role role = new Role();
    role.setName("ADMIN");
    role.setId(1L);
    return role;
  }

  public static List<Role> createAdminRoles() {
    List<Role> list = new ArrayList<>();
    list.add(createAdminRole());
    list.add(createTrainerRole());
    list.add(createCustomerRole());
    return list;
  }

  public static APurchaseOption createTimePurchaseOption(
      int number, double price, Date createdAt) {
    TimePurchaseOption option = new TimePurchaseOption();
    option.setNumber(number);
    option.setId(1L);
    option.setPrice(price);
    option.setCreatedAt(createdAt);
    option.setName("myTimeOption");
    return option;
  }

  public static APurchaseOption createBundlePurchaseOption(
      int number, double price, Date createdAt) {
    BundlePurchaseOption option = new BundlePurchaseOption();
    option.setNumber(number);
    option.setId(2L);
    option.setPrice(price);
    option.setCreatedAt(createdAt);
    option.setName("myBundleOption");
    return option;
  }

  public static APurchaseOption createOnDemandPurchaseOption(
      int number, double price, Date createdAt) {
    OnDemandPurchaseOption option = new OnDemandPurchaseOption();
    option.setNumber(number);
    option.setId(3L);
    option.setPrice(price);
    option.setCreatedAt(createdAt);
    option.setName("myOnDemandOption");
    return option;
  }

  public static List<APurchaseOption> createAllOptions(
      int number1,
      double price1,
      int number2,
      double price2,
      int number3,
      double price3,
      Date createdAt) {
    ArrayList<APurchaseOption> options = new ArrayList<>();
    options.add(createTimePurchaseOption(number1, price1, createdAt));
    options.add(createBundlePurchaseOption(number2, price2, createdAt));
    options.add(createOnDemandPurchaseOption(number3, price3, createdAt));
    return options;
  }

  public static List<APurchaseOption> createSingletonBundlePurchaseOptions(
      int number1, double price1, Date createdAt) {
    ArrayList<APurchaseOption> options = new ArrayList<>();
    options.add(createBundlePurchaseOption(number1, price1, createdAt));
    return options;
  }

  public static List<APurchaseOption> createSingletonTimePurchaseOptions(
      int number1, double price1, Date createdAt) {
    ArrayList<APurchaseOption> options = new ArrayList<>();
    options.add(createTimePurchaseOption(number1, price1, createdAt));
    return options;
  }

  public static List<APurchaseOption> createSingletonOnDemandPurchaseOptions(
      int number1, double price1, Date createdAt) {
    ArrayList<APurchaseOption> options = new ArrayList<>();
    options.add(createOnDemandPurchaseOption(number1, price1, createdAt));
    return options;
  }

  public static CourseTrainingBundleSpecification createCourseBundleSpec(
      long l, String name, int maxCustomers, List<APurchaseOption> options) {
    CourseTrainingBundleSpecification specs =
        new CourseTrainingBundleSpecification();
    specs.setDisabled(false);
    specs.setDescription("Description");
    specs.setId(l);
    specs.setName(name);
    specs.setUnlimitedDeletions(true);
    specs.setNumDeletions(0);
    specs.setOptions(options);
    specs.setMaxCustomers(maxCustomers);
    return specs;
  }

  public static CourseTrainingBundle createCourseBundle(
      long l,
      Date startTime,
      ATrainingBundleSpecification spec,
      APurchaseOption option) {
    CourseTrainingBundle pt = new CourseTrainingBundle();
    pt.setName("Winter Pack");
    pt.setStartTime(startTime);
    pt.setEndTime(addMonths(startTime, option.getNumber()));
    pt.setOption(option);
    pt.setBundleSpec(spec);
    pt.setNumDeletions(0);
    pt.setUnlimitedDeletions(true);
    pt.setId(l);
    return pt;
  }

  public static Payment createPayment(long l, double v, Date date) {
    Payment p = new Payment();
    p.setId(l);
    p.setAmount(v);
    p.setCreatedAt(date);
    return p;
  }
}
