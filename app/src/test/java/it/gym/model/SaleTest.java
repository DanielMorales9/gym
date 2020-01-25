package it.gym.model;

import org.apache.commons.lang3.time.DateUtils;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.test.context.junit4.SpringRunner;

import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import static it.gym.utility.Fixture.createCourseBundleSpec;
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

        CourseTrainingBundleSpecification expectedSpecs =
                createCourseBundleSpec(1L, "Course", 11, 1, 111.);
        TimeOption option = expectedSpecs.getOptions().get(0);
        CourseTrainingBundle expectedBundle = createCourseBundle(start, expectedSpecs, option);
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

        assertThat(sale.confirm()).isTrue();
    }

    @Test
    public void confirmCourseBasedSale() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addCourseToSalesLineItem(sale, start);

        assertThat(sale.confirm()).isTrue();
    }

    @Test
    public void whenConfirmPersonalBasedSaleReturnsFalse() {

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addPersonalToSalesLineItem(sale);
        sale.deleteSalesLineItem(sli);

        assertThat(sale.confirm()).isFalse();
    }

    @Test
    public void whenConfirmCourseBasedSaleReturnsFalse() {
        Date start = getDate();

        Sale sale = createSale(createCustomer());
        SalesLineItem sli = addCourseToSalesLineItem(sale, start);
        sale.deleteSalesLineItem(sli);

        assertThat(sale.confirm()).isFalse();
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
        CourseTrainingBundleSpecification spec =
                createCourseBundleSpec(1L, "Course", 11, 1, 111.);
        TimeOption option = spec.getOptions().toArray(new TimeOption[]{})[0];
        ATrainingBundle a = createCourseBundle(start, spec, option);
        return sale.addSalesLineItem(a);
    }


    private CourseTrainingBundle createCourseBundle(Date start, ATrainingBundleSpecification spec, TimeOption option) {
        CourseTrainingBundle p = new CourseTrainingBundle();
        p.setName("Course");
        p.setBundleSpec(spec);
        p.setOption(option);
        Date end = DateUtils.addMonths(start, option.getNumber());
        p.setStartTime(start);
        p.setEndTime(end);
        return p;
    }

    private SalesLineItem createSalesLineItem(ATrainingBundleSpecification spec, ATrainingBundle bundle) {
        SalesLineItem sli = new SalesLineItem();
        sli.setTrainingBundle(bundle);
        sli.setBundleSpecification(spec);
        return sli;
    }


    private PersonalTrainingBundle createPersonalBundle(ATrainingBundleSpecification spec) {
        PersonalTrainingBundle p = new PersonalTrainingBundle();
        p.setName("Personal");
        p.setBundleSpec(spec);
        return p;
    }

    private PersonalTrainingBundleSpecification createPersonalBundleSpecification() {
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
