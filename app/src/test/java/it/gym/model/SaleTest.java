package it.gym.model;

import org.apache.commons.lang3.time.DateUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.time.DayOfWeek;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static org.assertj.core.api.Assertions.assertThat;

@RunWith(SpringRunner.class)
public class SaleTest {

    @Test
    public void addPersonalToSalesLineItem() {
        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addPersonalToSalesLineItem(sale);

        ATrainingBundleSpecification expectedSpecs = createPersonalBundleSpecification();
        SalesLineItem expectedSli = createSalesLineItem(expectedSpecs, createPersonalBundle(expectedSpecs));
        assertThat(sli).isEqualTo(expectedSli);
    }

    @Test
    public void addCourseToSalesLineItem() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addCourseToSalesLineItem(sale, start);

        CourseTrainingBundleSpecification expectedSpecs = (CourseTrainingBundleSpecification) createCourseBundleSpecification(start);
        CourseTrainingBundle expectedBundle = (CourseTrainingBundle) createCourseBundle(start, expectedSpecs);
        SalesLineItem expectedSli = createSalesLineItem(expectedSpecs, expectedBundle);

        assertThat(sli.getBundleSpecification()).isEqualTo(expectedSpecs);
        assertThat(sli.getTrainingBundle()).isEqualTo(expectedBundle);

        assertThat(sli).isEqualTo(expectedSli);
    }

    @Test
    public void deletePersonalToSalesLineItem() {
        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addPersonalToSalesLineItem(sale);
        sale.deleteSalesLineItem(sli);

        assertThat(sale).isEqualTo(createSale(createCustomer()));
    }

    @Test
    public void deleteCourseToSalesLineItem() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addCourseToSalesLineItem(sale, start);
        sale.deleteSalesLineItem(sli);

        Sale expected = createSale(createCustomer());
        assertThat(sale).isEqualTo(expected);
    }

    @Test
    public void isPersonalBasedSaleDeletable() {

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addPersonalToSalesLineItem(sale);

        assertThat(sale.isDeletable()).isTrue();
    }

    @Test
    public void isCourseBasedSaleDeletable() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addCourseToSalesLineItem(sale, start);

        assertThat(sale.isDeletable()).isTrue();
    }

    @Test
    public void confirmPersonalBasedSale() {

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addPersonalToSalesLineItem(sale);

        assertThat(sale.confirmSale()).isTrue();
    }

    @Test
    public void confirmCourseBasedSale() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addCourseToSalesLineItem(sale, start);

        assertThat(sale.confirmSale()).isTrue();
    }

    @Test
    public void whenConfirmPersonalBasedSaleReturnsFalse() {

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addPersonalToSalesLineItem(sale);
        sale.deleteSalesLineItem(sli);

        assertThat(sale.confirmSale()).isFalse();
    }

    @Test
    public void whenConfirmCourseBasedSaleReturnsFalse() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addCourseToSalesLineItem(sale, start);
        sale.deleteSalesLineItem(sli);

        assertThat(sale.confirmSale()).isFalse();
    }

    @Test
    public void addBundlesToCustomersCurrentBundles() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        addPersonalToSalesLineItem(sale);
        addCourseToSalesLineItem(sale, start);

        sale.addBundlesToCustomersCurrentBundles();

        List<ATrainingBundle> expected = sale.getSalesLineItems().stream()
                .map(SalesLineItem::getTrainingBundle).collect(Collectors.toList());
        assertThat(sale.getCustomer().getCurrentTrainingBundles()).isEqualTo(expected);
    }

    @Test
    public void removeBundlesToCustomersCurrentBundles() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        addPersonalToSalesLineItem(sale);
        addCourseToSalesLineItem(sale, start);

        sale.addBundlesToCustomersCurrentBundles();
        sale.removeBundlesFromCustomersCurrentBundles();

        assertThat(sale.getCustomer().getCurrentTrainingBundles()).isEmpty();
    }

    private Date getDate() {
        Calendar cal = Calendar.getInstance();
        cal.set(2019, Calendar.JUNE, 21, 0, 0, 0);
        return cal.getTime();
    }

    private SalesLineItem addPersonalToSalesLineItem(Sale sale) {
        ATrainingBundleSpecification spec = createPersonalBundleSpecification();
        ATrainingBundle a = spec.createTrainingBundle();
        return sale.addSalesLineItem(a);
    }

    private SalesLineItem addCourseToSalesLineItem(Sale sale, Date start) {
        ATrainingBundleSpecification spec = createCourseBundleSpecification(start);
        ATrainingBundle a = spec.createTrainingBundle();
        return sale.addSalesLineItem(a);
    }


    private ATrainingBundle createCourseBundle(Date start, ATrainingBundleSpecification spec) {
        CourseTrainingBundle p = new CourseTrainingBundle();
        p.setName("Course");
        p.setDescription("Description");
        p.setExpired(false);
        p.setBundleSpec(spec);
        p.setPrice(111.0);
        Date end = DateUtils.addDays(start, 30);
        p.setStartTime(start);
        p.setEndTime(end);
        p.setMaxCustomers(11);
        return p;
    }

    private ATrainingBundleSpecification createCourseBundleSpecification(Date start) {
        CourseTrainingBundleSpecification p = new CourseTrainingBundleSpecification();
        p.setId(1L);
        p.setName("Course");
        p.setDescription("Description");
        p.setDisabled(false);
        p.setPrice(111.0);
        Date end = DateUtils.addDays(start, 30);
        p.setStartTime(start);
        p.setEndTime(end);
        p.setMaxCustomers(11);
        return p;
    }

    private SalesLineItem createSalesLineItem(ATrainingBundleSpecification spec, ATrainingBundle bundle) {
        SalesLineItem sli = new SalesLineItem();
        sli.setTrainingBundle(bundle);
        sli.setBundleSpecification(spec);
        return sli;
    }


    private ATrainingBundle createPersonalBundle(ATrainingBundleSpecification spec) {
        PersonalTrainingBundle p = new PersonalTrainingBundle();
        p.setName("Personal");
        p.setDescription("Description");
        p.setExpired(false);
        p.setBundleSpec(spec);
        p.setPrice(111.0);
        p.setNumSessions(11);
        return p;
    }

    private ATrainingBundleSpecification createPersonalBundleSpecification() {
        PersonalTrainingBundleSpecification p = new PersonalTrainingBundleSpecification();
        p.setId(1L);
        p.setName("Personal");
        p.setDescription("Description");
        p.setDisabled(false);
        p.setPrice(111.0);
        p.setNumSessions(11);
        return p;
    }

    private Sale createSale(Customer customer) {
        Sale sale = new Sale();
        sale.setId(1L);
        sale.setCompleted(false);
        sale.setAmountPayed(0.0);
        sale.setPayed(false);
        sale.setPayedDate(null);
        sale.setCustomer(customer);
        return sale;
    }

    private Gym createGym() {
        Gym gym = new Gym();
        gym.setId(1L);
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

    private Customer createCustomer() {
        Customer user = new Customer();
        user.setId(1L);
        user.setEmail("customer@customer.com");
        user.setFirstName("customer");
        user.setLastName("customer");
        user.setVerified(true);
        return user;
    }
}
