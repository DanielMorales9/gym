package it.gym.utility;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

import it.gym.model.*;
import java.util.List;
import org.springframework.test.web.servlet.ResultActions;

public class HateoasTest {

  public static void expectUser(ResultActions result, Admin admin, String p)
      throws Exception {
    String prefix = handlePrefix(p);
    expectAUser(result, admin, prefix);
  }

  public static void expectUser(ResultActions result, Admin admin)
      throws Exception {
    expectUser(result, admin, null);
  }

  public static void expectAdminRoles(ResultActions result, List<Role> roles)
      throws Exception {
    expectAdminRoles(result, roles, null);
  }

  public static void expectAdminRoles(
      ResultActions result, List<Role> roles, String p) throws Exception {
    String prefix = handlePrefixForArray(p);

    for (int i = 0; i < 3; i++) {
      result
          .andExpect(
              jsonPath("$" + prefix + "[" + i + "].id")
                  .value(roles.get(i).getId()))
          .andExpect(
              jsonPath("$" + prefix + "[" + i + "].name")
                  .value(roles.get(i).getName()));
    }
  }

  public static void expectGym(ResultActions result, Gym gym, String p)
      throws Exception {
    String prefix = handlePrefix(p);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(gym.getId()))
        .andExpect(jsonPath("$" + prefix + "name").value(gym.getName()))
        .andExpect(
            jsonPath("$" + prefix + "mondayStartHour")
                .value(gym.getMondayStartHour()))
        .andExpect(
            jsonPath("$" + prefix + "tuesdayStartHour")
                .value(gym.getTuesdayStartHour()))
        .andExpect(
            jsonPath("$" + prefix + "wednesdayStartHour")
                .value(gym.getWednesdayStartHour()))
        .andExpect(
            jsonPath("$" + prefix + "thursdayStartHour")
                .value(gym.getThursdayStartHour()))
        .andExpect(
            jsonPath("$" + prefix + "fridayStartHour")
                .value(gym.getFridayStartHour()))
        .andExpect(
            jsonPath("$" + prefix + "saturdayStartHour")
                .value(gym.getSaturdayStartHour()))
        .andExpect(
            jsonPath("$" + prefix + "sundayStartHour")
                .value(gym.getSundayStartHour()))
        .andExpect(
            jsonPath("$" + prefix + "mondayEndHour")
                .value(gym.getMondayEndHour()))
        .andExpect(
            jsonPath("$" + prefix + "tuesdayEndHour")
                .value(gym.getTuesdayEndHour()))
        .andExpect(
            jsonPath("$" + prefix + "wednesdayEndHour")
                .value(gym.getWednesdayEndHour()))
        .andExpect(
            jsonPath("$" + prefix + "thursdayEndHour")
                .value(gym.getThursdayEndHour()))
        .andExpect(
            jsonPath("$" + prefix + "fridayEndHour")
                .value(gym.getFridayEndHour()))
        .andExpect(
            jsonPath("$" + prefix + "saturdayEndHour")
                .value(gym.getSaturdayEndHour()))
        .andExpect(
            jsonPath("$" + prefix + "sundayEndHour")
                .value(gym.getSundayEndHour()))
        .andExpect(
            jsonPath("$" + prefix + "mondayOpen").value(gym.isMondayOpen()))
        .andExpect(
            jsonPath("$" + prefix + "tuesdayOpen").value(gym.isTuesdayOpen()))
        .andExpect(
            jsonPath("$" + prefix + "wednesdayOpen")
                .value(gym.isWednesdayOpen()))
        .andExpect(
            jsonPath("$" + prefix + "thursdayOpen").value(gym.isThursdayOpen()))
        .andExpect(
            jsonPath("$" + prefix + "fridayOpen").value(gym.isFridayOpen()))
        .andExpect(
            jsonPath("$" + prefix + "saturdayOpen").value(gym.isSaturdayOpen()))
        .andExpect(
            jsonPath("$" + prefix + "sundayOpen").value(gym.isSundayOpen()))
        .andExpect(
            jsonPath("$" + prefix + "reservationBeforeHours")
                .value(gym.getReservationBeforeHours()));
  }

  public static void expectGym(ResultActions result, Gym gym) throws Exception {
    expectGym(result, gym, null);
  }

  private static String handlePrefixForArray(String prefix) {
    return handlePrefix(prefix, true);
  }

  private static String handlePrefix(String prefix) {
    return handlePrefix(prefix, false);
  }

  private static String handlePrefix(String p, boolean isArray) {
    String prefix = handleNullPrefix(p);
    if (!prefix.equals("")) {
      if (!isArray) {
        prefix = prefix.endsWith(".") ? prefix : prefix + ".";
      }
      prefix = prefix.startsWith(".") ? prefix : "." + prefix;
    } else if (!isArray) {
      prefix = ".";
    }
    return prefix;
  }

  private static String handleNullPrefix(String prefix) {
    prefix = prefix == null ? "" : prefix;
    return prefix;
  }

  public static void expectTrainingBundleSpec(
      ResultActions result, PersonalTrainingBundleSpecification bundle)
      throws Exception {
    expectTrainingBundleSpec(result, bundle, null);
  }

  public static void expectTrainingSession(
      ResultActions result, ATrainingSession session) throws Exception {
    expectTrainingSession(result, session, null);
  }

  private static void expectTrainingSession(
      ResultActions result, ATrainingSession session, String p)
      throws Exception {
    String prefix = handlePrefix(p, false);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(session.getId()))
        .andExpect(
            jsonPath("$" + prefix + "completed").value(session.getCompleted()))
        .andExpect(
            jsonPath("$" + prefix + "deletable").value(session.isDeletable()))
        .andExpect(
            jsonPath("$" + prefix + "startTime").value(session.getStartTime()))
        .andExpect(
            jsonPath("$" + prefix + "endTime").value(session.getEndTime()))
        .andExpect(jsonPath("$" + prefix + "type").value(session.getType()));
  }

  public static void expectWorkout(ResultActions result, Workout workout)
      throws Exception {
    expectWorkout(result, workout, null);
  }

  public static void expectWorkout(
      ResultActions result, Workout workout, String p) throws Exception {
    String prefix = handlePrefix(p, false);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(workout.getId()))
        .andExpect(jsonPath("$" + prefix + "name").value(workout.getName()))
        .andExpect(
            jsonPath("$" + prefix + "description")
                .value(workout.getDescription()))
        .andExpect(jsonPath("$" + prefix + "tag1").value(workout.getTag1()))
        .andExpect(jsonPath("$" + prefix + "tag2").value(workout.getTag2()))
        .andExpect(jsonPath("$" + prefix + "tag3").value(workout.getTag3()))
        .andExpect(
            jsonPath("$" + prefix + "template").value(workout.isTemplate()))
        .andExpect(
            jsonPath("$" + prefix + "createdAt").value(workout.getCreatedAt()));
  }

  private static void expectATrainingBundleSpec(
      ResultActions result, ATrainingBundleSpecification bundle, String prefix)
      throws Exception {
    result
        .andExpect(jsonPath("$" + prefix + "id").value(bundle.getId()))
        .andExpect(jsonPath("$" + prefix + "name").value(bundle.getName()))
        .andExpect(
            jsonPath("$" + prefix + "disabled").value(bundle.getDisabled()))
        .andExpect(
            jsonPath("$" + prefix + "description")
                .value(bundle.getDescription()));
  }

  public static void expectTrainingBundleSpec(
      ResultActions result,
      PersonalTrainingBundleSpecification bundle,
      String p)
      throws Exception {
    String prefix = handlePrefix(p, false);
    expectATrainingBundleSpec(result, bundle, prefix);
    result
        .andExpect(
            jsonPath("$" + prefix + "unlimitedDeletions")
                .value(bundle.getUnlimitedDeletions()))
        .andExpect(
            jsonPath("$" + prefix + "numDeletions")
                .value(bundle.getNumDeletions()));
  }

  public static void expectTrainingBundleSpec(
      ResultActions result, CourseTrainingBundleSpecification bundle)
      throws Exception {
    expectTrainingBundleSpec(result, bundle, null);
  }

  public static void expectTrainingBundleSpec(
      ResultActions result, CourseTrainingBundleSpecification bundle, String p)
      throws Exception {
    String prefix = handlePrefix(p, false);
    expectATrainingBundleSpec(result, bundle, prefix);
    result.andExpect(
        jsonPath("$" + prefix + "maxCustomers")
            .value(bundle.getMaxCustomers()));
  }

  public static void expectSale(ResultActions result, Sale sale)
      throws Exception {
    expectSale(result, sale, null);
    expectSaleUser(result, sale.getCustomer(), "customer");
  }

  public static void expectSale(ResultActions result, Sale sale, String p)
      throws Exception {
    String prefix = handlePrefix(p, false);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(sale.getId()))
        .andExpect(
            jsonPath("$" + prefix + "amountPayed").value(sale.getAmountPayed()))
        .andExpect(
            jsonPath("$" + prefix + "totalPrice").value(sale.getTotalPrice()));
  }

  public static void expectUser(
      ResultActions result, Customer customer, String p) throws Exception {
    String prefix = handlePrefix(p, false);
    expectAUser(result, customer, prefix);
    //    result
    //        .andExpect(
    //            jsonPath("$" + prefix + "height").value(customer.getHeight()))
    //        .andExpect(
    //            jsonPath("$" + prefix +
    // "weight").value(customer.getWeight()));
  }

  public static void expectSaleUser(
      ResultActions result, Customer user, String p) throws Exception {
    String prefix = handlePrefix(p, false);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(user.getId()))
        .andExpect(
            jsonPath("$" + prefix + "firstName").value(user.getFirstName()))
        .andExpect(
            jsonPath("$" + prefix + "lastName").value(user.getLastName()));
  }

  public static void expectUser(ResultActions result, Customer customer)
      throws Exception {
    expectUser(result, customer, null);
  }

  public static void expectAUser(ResultActions result, AUser user, String p)
      throws Exception {
    String prefix = handlePrefix(p);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(user.getId()))
        .andExpect(jsonPath("$" + prefix + "email").value(user.getEmail()))
        .andExpect(
            jsonPath("$" + prefix + "firstName").value(user.getFirstName()))
        .andExpect(
            jsonPath("$" + prefix + "lastName").value(user.getLastName()))
        .andExpect(jsonPath("$" + prefix + "verified").value(user.isVerified()))
        .andExpect(jsonPath("$" + prefix + "gender").value(user.isGender()));
  }

  public static void expectedSalesLineItem(
      ResultActions result, SalesLineItem expected, String p) throws Exception {
    String prefix = handlePrefix(p);
    result.andExpect(jsonPath("$" + prefix + "id").value(expected.getId()));
    expectSaleTrainingBundle(
        result, expected.getTrainingBundle(), prefix + "trainingBundle");

    expectSaleTrainingBundleSpec(
        result,
        expected.getBundleSpecification(),
        prefix + "bundleSpecification");
  }

  private static void expectSaleTrainingBundleSpec(
      ResultActions result,
      ATrainingBundleSpecification bundleSpecification,
      String s)
      throws Exception {
    String prefix = handlePrefix(s);
    result
        .andExpect(
            jsonPath("$" + prefix + "id").value(bundleSpecification.getId()))
        .andExpect(
            jsonPath("$" + prefix + "name")
                .value(bundleSpecification.getName()));
  }

  private static void expectSaleTrainingBundle(
      ResultActions result, ATrainingBundle trainingBundle, String s)
      throws Exception {
    String prefix = handlePrefix(s);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(trainingBundle.getId()))
        .andExpect(
            jsonPath("$" + prefix + "name").value(trainingBundle.getName()));
    expectSaleOption(result, trainingBundle.getOption(), prefix + "option");
  }

  private static void expectSaleOption(
      ResultActions result, APurchaseOption option, String prefix)
      throws Exception {
    prefix = handlePrefix(prefix);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(option.getId()))
        .andExpect(jsonPath("$" + prefix + "price").value(option.getPrice()));
  }

  private static void expectATrainingBundle(
      ResultActions result, ATrainingBundle trainingBundle, String prefix)
      throws Exception {
    result
        .andExpect(jsonPath("$" + prefix + "id").value(trainingBundle.getId()))
        .andExpect(
            jsonPath("$" + prefix + "name").value(trainingBundle.getName()))
        .andExpect(
            jsonPath("$" + prefix + "unlimitedDeletions")
                .value(trainingBundle.getUnlimitedDeletions()))
        .andExpect(
            jsonPath("$" + prefix + "numDeletions")
                .value(trainingBundle.getNumDeletions()));
  }

  public static void expectTrainingBundle(
      ResultActions result, CourseTrainingBundle trainingBundle)
      throws Exception {
    expectTrainingBundle(result, trainingBundle, null);
  }

  public static void expectTrainingBundle(
      ResultActions result, PersonalTrainingBundle trainingBundle, String p)
      throws Exception {
    String prefix = handlePrefix(p);
    expectATrainingBundle(result, trainingBundle, prefix);
  }

  public static void expectTrainingBundle(
      ResultActions result, CourseTrainingBundle trainingBundle, String p)
      throws Exception {
    String prefix = handlePrefix(p);
    expectATrainingBundle(result, trainingBundle, prefix);
  }

  public static void expectCustomerRoles(
      ResultActions result, List<Role> roles, String p) throws Exception {
    String prefix = handlePrefixForArray(p);

    for (int i = 0; i < 1; i++) {
      result
          .andExpect(
              jsonPath("$" + prefix + "[" + i + "].id")
                  .value(roles.get(i).getId()))
          .andExpect(
              jsonPath("$" + prefix + "[" + i + "].name")
                  .value(roles.get(i).getName()));
    }
  }

  public static void expectEvent(ResultActions result, AEvent event)
      throws Exception {
    expectEvent(result, event, null);
  }

  private static void expectEvent(ResultActions result, AEvent event, String p)
      throws Exception {

    String prefix = handlePrefix(p);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(event.getId()))
        .andExpect(jsonPath("$" + prefix + "name").value(event.getName()))
        .andExpect(
            jsonPath("$" + prefix + "startTime")
                .value(event.getStartTime().getTime()))
        .andExpect(
            jsonPath("$" + prefix + "endTime")
                .value(event.getEndTime().getTime()))
        .andExpect(jsonPath("$" + prefix + "type").value(event.getType()));

    if ("T".equals(event.getType())) {
      expectEvent(result, (TimeOff) event, prefix);
    }
  }

  private static void expectEvent(
      ResultActions result, TimeOff event, String prefix) throws Exception {
    prefix = handlePrefix(prefix + "user");
    AUser user = event.getUser();
    result
        .andExpect(jsonPath("$" + prefix + "id").value(user.getId()))
        .andExpect(
            jsonPath("$" + prefix + "firstName").value(user.getFirstName()))
        .andExpect(
            jsonPath("$" + prefix + "lastName").value(user.getLastName()));
  }

  public static void expectReservation(
      ResultActions result, Reservation reservation) throws Exception {
    expectReservation(result, reservation, null);
  }

  public static void expectReservation(
      ResultActions result, Reservation reservation, String p)
      throws Exception {
    String prefix = handlePrefix(p);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(reservation.getId()))
        .andExpect(
            jsonPath("$" + prefix + "confirmed")
                .value(reservation.getConfirmed()));
  }

  public static void expectPayment(
      ResultActions result, Payment payment, String p) throws Exception {
    String prefix = handlePrefix(p);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(payment.getId()))
        .andExpect(
            jsonPath("$" + prefix + "amount").value(payment.getAmount()));
  }

  public static void expectOption(
      ResultActions result, APurchaseOption timeOption, String p)
      throws Exception {
    String prefix = handlePrefix(p);
    result
        .andExpect(jsonPath("$" + prefix + "id").value(timeOption.getId()))
        .andExpect(jsonPath("$" + prefix + "name").value(timeOption.getName()))
        .andExpect(
            jsonPath("$" + prefix + "price").value(timeOption.getPrice()))
        .andExpect(
            jsonPath("$" + prefix + "number").value(timeOption.getNumber()));
  }
}
