package it.gym.utility;

import it.gym.model.*;

import java.time.DayOfWeek;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.List;

import static org.apache.commons.lang3.time.DateUtils.addHours;

public class Fixture {


    public static AUser createCustomer(long id,
                                       String email,
                                       String password,
                                       String firstName,
                                       String lastName,
                                       boolean verified,
                                       List<Role> roles,
                                       Gym gym) {
        AUser user = new Customer();
        user.setId(id);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setRoles(roles);
        user.setVerified(verified);
        user.setPassword(password);
        user.setGym(gym);
        return user;
    }

    public static VerificationToken createToken(long id, String token, AUser u) {
        VerificationToken vk = new VerificationToken();
        vk.setId(id);
        vk.setToken(token);
        vk.setExpiryDate(addHours(new Date(), 2));
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
        return gym;
    }

    public static Sale createSale(long id, AUser customer, Gym gym) {
        Sale sale = new Sale();
        sale.setId(id);
        sale.setCustomer((Customer) customer);
        sale.setGym(gym);
        sale.setAmountPayed(0.0);
        sale.setCompleted(false);
        return sale;
    }

    public static ATrainingBundleSpecification createPersonalBundleSpec(long id, String name) {
        PersonalTrainingBundleSpecification specs = new PersonalTrainingBundleSpecification();
        specs.setId(id);
        specs.setName("Bundle");
        specs.setDescription("Description");
        specs.setNumSessions(11);
        specs.setPrice(111.0);
        specs.setDisabled(false);
        return specs;
    }

    public static PersonalTrainingSession createPersonalTrainingSession(long id, ATrainingBundle bundleSpec) {
        PersonalTrainingSession pt = new PersonalTrainingSession();
        pt.setCompleted(false);
        pt.setStartTime(new Date());
        pt.setEndTime(new Date());
        pt.setId(id);
        pt.setTrainingBundle(bundleSpec);
        return pt;
    }

    public static ATrainingBundle createPersonalBundle(long id) {
        PersonalTrainingBundle pt = new PersonalTrainingBundle();
        pt.setName("Winter Pack");
        pt.setNumSessions(11);
        pt.setPrice(111.0);
        pt.setDescription("Description");
        pt.setId(id);
        return pt;
    }

    public static Admin createAdmin(long id, String email, Gym gym, List<Role> roles) {
        Admin user = new Admin();
        user.setId(id);
        user.setEmail(email);
        user.setFirstName("admin");
        user.setLastName("admin");
        user.setGym(gym);
        user.setRoles(roles);
        return user;
    }

    public static Trainer createTrainer(long id) {
        Trainer user = new Trainer();
        user.setId(id);
        user.setEmail("trainer@trainer.com");
        user.setFirstName("trainer");
        user.setLastName("trainer");
        return user;
    }

    public static AEvent createHoliday(long id, String name, Date start, Date end, Gym gym) {
        AEvent time = new Holiday();
        time.setId(id);
        time.setName(name);
        time.setStartTime(start);
        time.setEndTime(end);
        time.setGym(gym);
        return time;
    }

    public static AEvent createTimeOff(long id, String name, Date start, Date end, AUser trainer, Gym gym) {
        TimeOff time = new TimeOff();
        time.setId(id);
        time.setName(name);
        time.setStartTime(start);
        time.setEndTime(end);
        time.setUser(trainer);
        time.setGym(gym);
        return time;
    }

    public static Reservation createReservation(long id, Customer customer) {
        Reservation res = new Reservation();
        res.setId(id);
        res.setConfirmed(false);
        res.setUser(customer);
        return res;
    }

    public static CourseEvent createCourseEvent(long id, String name, ATrainingSession session, Gym gym) {
        CourseEvent course = new CourseEvent();
        course.setGym(gym);
        course.setId(id);
        course.setStartTime(session.getStartTime());
        course.setEndTime(session.getEndTime());
        course.setName(name);
        course.setSession(session);
        course.setReservations(null);
        return course;
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
        list.add(createCustomerRole());
        list.add(createTrainerRole());
        list.add(createAdminRole());
        return list;
    }

    public static ATrainingBundleSpecification createCourseBundleSpec(long l, String name, Date startTime, Date endTime) {
        CourseTrainingBundleSpecification specs = new CourseTrainingBundleSpecification();
        specs.setDisabled(false);
        specs.setDescription("Description");
        specs.setId(l);
        specs.setName(name);
        specs.setPrice(111.0);
        specs.setMaxCustomers(1);
        specs.setStartTime(startTime);
        specs.setEndTime(endTime);
        return specs;
    }
}
