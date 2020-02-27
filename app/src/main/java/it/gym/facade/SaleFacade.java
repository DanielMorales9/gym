package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.ConflictException;
import it.gym.model.*;
import it.gym.service.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

@Component
@Transactional
public class SaleFacade {
    private final Logger logger = LoggerFactory.getLogger(getClass());

    @Autowired
    private SaleService saleService;

    @Autowired
    private UserService userService;

    @Autowired
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService bundleSpecService;

    @Qualifier("trainingBundleService")
    @Autowired
    private TrainingBundleService bundleService;

    @Autowired
    private SalesLineItemService salesLineItemService;
    @Autowired
    private PaymentService paymentService;

    private Sale save(Sale sale) {
        return this.saleService.save(sale);
    }

    public Sale findById(Long saleId) {
        return saleService.findById(saleId);
    }

    private void delete(Sale sale) {
        saleService.delete(sale);
    }

    public Page<Sale> findUserSales(Long id, Boolean payed, Pageable pageable) {
        return this.saleService.findUserSales(id, payed, pageable);
    }

    public Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqual(Long id,
                                                                        Date date,
                                                                        Boolean payed,
                                                                        Pageable pageable) {
        return this.saleService.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, payed, pageable);
    }

    public Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date, Boolean payed, Pageable pageable) {
        return this.saleService.findSalesByCreatedAtGreaterThanEqual(date, payed, pageable);
    }

    public Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(String lastName,
                                                                              Date date,
                                                                              Boolean payed,
                                                                              Pageable pageable) {
        return this.saleService.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date,
                payed, pageable);
    }

    public Page<Sale> findSalesByCustomerLastName(String lastName, Boolean payed, Pageable pageable) {
        return this.saleService.findSalesByCustomerLastName(lastName, payed, pageable);
    }

    public Page<Sale> findAll(Boolean payed, Pageable pageable) {
        return this.saleService.findAll(payed, pageable);
    }

    public Sale getTotalPriceBySaleId(Long saleId) {
        Sale sale = this.findById(saleId);
        sale.getTotalPrice();
        return sale;
    }

    public Sale createSale(Long customerId) {
        Customer customer = (Customer) userService.findById(customerId);

        Sale sale = new Sale();
        sale.setCreatedAt(new Date());
        sale.setAmountPayed(0.);
        sale.setCustomer(customer);
        sale.setPayed(false);
        return this.save(sale);
    }

    public Sale addSalesLineItem(Long saleId, Long bundleSpecId, Long optionId) {
        Sale sale = this.findById(saleId);
        ATrainingBundleSpecification bundleSpec = this.bundleSpecService.findById(bundleSpecId);
        ATrainingBundle bundle = bundleSpec.createTrainingBundle();
        boolean ret = bundle.assignOption(optionId);
        bundle.setCustomer(sale.getCustomer());
        if (!ret) {
            throw new BadRequestException("L'opzione indicata non è disponibile");
        }

        sale.addSalesLineItem(bundle);
        return this.save(sale);
    }

    public Sale deleteSalesLineItem(Long saleId, Long salesLineItemId) {
        Sale sale = this.findById(saleId);
        SalesLineItem sli = salesLineItemService.findById(salesLineItemId);
        if (!sale.deleteSalesLineItem(sli))
            throw new ConflictException("Impossibile eliminate riga con id " + saleId + " della vendita con id " + saleId);
        ATrainingBundle trainingBundle = sli.getTrainingBundle();
        if (trainingBundle.isDeletable()) {
            bundleService.delete(trainingBundle);
        }
        this.salesLineItemService.delete(sli);
        return this.save(sale);
    }

    public Sale confirmSale(Long saleId) {
        String messageTemplate = "Impossibile confermare vendita (#%d) vuota.";
        Sale sale = findById(saleId);
        if (!sale.confirm()) throw new BadRequestException(String.format(messageTemplate, sale.getId()));
        if (!sale.addBundlesToCustomersCurrentBundles()) {
            String message = String.format("Impossibile confermare vendita per il cliente %s.",
                    sale.getCustomer().getLastName());
            throw new BadRequestException(message);
        }
        return this.save(sale);
    }

    public Sale paySale(Long saleId, Double amount) {
        Sale sale = this.findById(saleId);
        logger.debug("Paying");
        logger.debug(sale.toString());

        if (!sale.isCompleted()) {
            String message = String.format("La vendita (%d) non è stata completata.", saleId);
            logger.debug(message);
            throw new BadRequestException(message);
        }

        Double amountPayed = sale.getAmountPayed();
        Double totalPrice = sale.getTotalPrice();

        if (amountPayed + amount > totalPrice) {
            String message = "Stai pagando più del dovuto!";
            logger.debug(message);
            throw new BadRequestException(message);
        }

        sale.pay(amount);

        return this.save(sale);
    }

    public Sale deleteSaleById(Long saleId) {
        Sale sale = this.findById(saleId);
        if (!sale.isDeletable()) {
            throw new BadRequestException(String.format("Non è possibile eliminare la vendita per il cliente: %s",
                    sale.getCustomer().getLastName()));
        }
        sale.removeBundlesFromCustomersCurrentBundles();
        this.userService.save(sale.getCustomer());
        List<ATrainingBundle> bundles = getDeletableBundles(sale);
        this.bundleService.deleteAll(bundles);
        this.salesLineItemService.deleteAll(sale.getSalesLineItems());
        this.paymentService.deleteAll(sale.getPayments());

        this.delete(sale);
        return sale;
    }

    private List<ATrainingBundle> getDeletableBundles(Sale sale) {
        return sale.getSalesLineItems()
                    .stream()
                    .map(SalesLineItem::getTrainingBundle)
                    .collect(Collectors.toList());
    }

    public Sale deletePayment(Long saleId, Long paymentId) {
        Sale sale = this.findById(saleId);
        Payment p = sale
                .getPayments()
                .stream()
                .filter(payment -> payment.getId().equals(paymentId))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("Questo pagamento non esiste"));

        sale.getPayments().remove(p);

        sale.setAmountPayed(sale.getAmountPayed() - p.getAmount());
        sale.setPayed(false);
        sale.setPayedDate(null);

        paymentService.delete(p);

        return this.save(sale);
    }

    public Page<Sale> getSales(String lastName, Date date, Boolean payed, Pageable pageable) {
        if (date != null && lastName != null) {
            return findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, payed, pageable);
        }
        else if (lastName != null) {
            return findSalesByCustomerLastName(lastName, payed, pageable);
        } else if (date != null) {
            return findSalesByCreatedAtGreaterThanEqual(date, payed, pageable);
        } else {
            return findAll(payed, pageable);
        }
    }
}
