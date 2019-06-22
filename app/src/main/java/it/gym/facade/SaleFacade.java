package it.gym.facade;

import it.gym.exception.InvalidSaleException;
import it.gym.exception.SalesIsNotCompletedException;
import it.gym.exception.SalesLineItemNotDeletedException;
import it.gym.model.*;
import it.gym.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Component
@Transactional
public class SaleFacade {

    @Autowired
    private SaleService saleService;

    @Autowired
    private UserService userService;

    @Autowired
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService bundleSpecService;

    @Autowired
    private TrainingBundleService bundleService;

    @Autowired
    private SalesLineItemService salesLineItemService;

    @Autowired
    private GymService gymService;

    private Sale save(Sale sale) {
        return this.saleService.save(sale);
    }

    public Sale findById(Long saleId) {
        return saleService.findById(saleId);
    }

    private void delete(Sale sale) {
        saleService.delete(sale);
    }

    public Page<Sale> findUserSales(Long id, Pageable pageable) {
        return this.saleService.findUserSales(id, pageable);
    }

    public Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqual(Long id, Date date, Pageable pageable) {
        return this.saleService.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, pageable);
    }

    public Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date, Pageable pageable) {
        return this.saleService.findSalesByCreatedAtGreaterThanEqual(date, pageable);
    }

    public Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(String lastName, Date date, Pageable pageable) {
        return this.saleService.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, pageable);
    }

    public Page<Sale> findSalesByCustomerLastName(String lastName, Pageable pageable) {
        return this.saleService.findSalesByCustomerLastName(lastName, pageable);
    }

    public Page<Sale> findAll(Pageable pageable) {
        return this.saleService.findAll(pageable);
    }

    public Sale getTotalPriceBySaleId(Long saleId) {
        Sale sale = this.findById(saleId);
        sale.getTotalPrice();
        return sale;
    }

    public ATrainingBundle createBundle(ATrainingBundleSpecification spec) {
        if (spec.getType().equals(CourseTrainingBundleSpecification.TYPE)) {
            List<ATrainingBundle> l = bundleService.findBundlesBySpec(spec);
            if (l.size() == 1) {
                return l.get(0);
            } else if (l.size() > 1) {
                throw new InvalidSaleException("Sono stati creati troppi corsi");
            }
        }
        return spec.createTrainingBundle();
    }

    public Sale createSale(Long gymId, Long customerId) {
        Gym gym = gymService.findById(gymId);
        Customer customer = (Customer) userService.findById(customerId);

        Sale sale = new Sale();
        sale.setCreatedAt(new Date());
        sale.setGym(gym);
        sale.setAmountPayed(0.);
        sale.setCustomer(customer);
        sale.setPayed(false);
        return this.save(sale);
    }

    public Sale addSalesLineItem(Long saleId, Long bundleSpecId, Integer quantity) {
        Sale sale = this.findById(saleId);
        ATrainingBundleSpecification bundleSpec = this.bundleSpecService.findById(bundleSpecId);

        for (int i = 0; i < quantity; i++) {
            ATrainingBundle bundle = createBundle(bundleSpec);
            sale.addSalesLineItem(bundle);
        }
        return this.save(sale);
    }

    public Sale deleteSalesLineItem(Long saleId, Long salesLineItemId) {
        Sale sale = this.findById(saleId);
        SalesLineItem sli = salesLineItemService.findById(salesLineItemId);
        if (!sale.deleteSalesLineItem(sli))
            throw new SalesLineItemNotDeletedException(saleId, salesLineItemId);
        this.salesLineItemService.delete(sli);
        return this.save(sale);
    }

    public Sale confirmSale(Long saleId) {
        String messageTemplate = "Impossibile confermare vendita (#%d) vuota.";
        Sale sale = findById(saleId);
        if (!sale.confirmSale()) throw new InvalidSaleException(String.format(messageTemplate, sale.getId()));
        if (!sale.addBundlesToCustomersCurrentBundles()) {
            String message = String.format("Impossibile confermare vendita per il cliente %s.",
                    sale.getCustomer().getLastName());
            throw new InvalidSaleException(message);
        }
        return this.save(sale);
    }

    public Sale paySale(Long saleId, Double amount) {
        Sale sale = this.findById(saleId);
        if (!sale.isCompleted()) {
            throw new SalesIsNotCompletedException(saleId);
        }
        Double amountPayed = sale.getAmountPayed();
        boolean payed = amountPayed + amount == sale.getTotalPrice();
        if (!payed) {
            if (amountPayed + amount > sale.getTotalPrice())
                throw new InvalidSaleException("Stai pagando più del dovuto!");
        } else {
            sale.setPayed(true);
            sale.setPayedDate(new Date());
        }
        sale.setAmountPayed(amountPayed + amount);
        return this.save(sale);
    }

    public Sale deleteSaleById(Long saleId) {
        Sale sale = this.findById(saleId);
        if (!sale.isDeletable() || !sale.removeBundlesFromCustomersCurrentBundles()) {
            throw new InvalidSaleException(String.format("Non è possibile eliminare la vendita per il cliente: %s",
                    sale.getCustomer().getLastName()));
        }
        this.salesLineItemService.deleteAll(sale.getSalesLineItems());
        this.userService.save(sale.getCustomer());
        this.delete(sale);
        return sale;
    }


}
