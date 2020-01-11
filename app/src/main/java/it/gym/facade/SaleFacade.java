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

    @Autowired
    private TrainingBundleService bundleService;

    @Autowired
    private SalesLineItemService salesLineItemService;

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

    public Sale createSale(Long customerId) {
        Customer customer = (Customer) userService.findById(customerId);

        Sale sale = new Sale();
        sale.setCreatedAt(new Date());
        sale.setAmountPayed(0.);
        sale.setCustomer(customer);
        sale.setPayed(false);
        return this.save(sale);
    }

    public Sale addSalesLineItem(Long saleId, Long bundleSpecId) {
        Sale sale = this.findById(saleId);
        ATrainingBundleSpecification bundleSpec = this.bundleSpecService.findById(bundleSpecId);

        ATrainingBundle bundle = bundleSpec.createTrainingBundle();
        if (bundle == null) {
            throw new BadRequestException("Qualcosa è andato storto");
        }
        sale.addSalesLineItem(bundle);
        return this.save(sale);
    }

    public Sale addSalesLineItemByBundle(Long saleId, Long bundleId) {
        Sale sale = this.findById(saleId);
        ATrainingBundle bundle = this.bundleService.findById(bundleId);
        sale.addSalesLineItem(bundle);
        return this.save(sale);
    }

    public Sale deleteSalesLineItem(Long saleId, Long salesLineItemId) {
        Sale sale = this.findById(saleId);
        SalesLineItem sli = salesLineItemService.findById(salesLineItemId);
        if (!sale.deleteSalesLineItem(sli))
            throw new ConflictException("Impossibile eliminate riga con id " + saleId + " della vendita con id " + saleId);
        ATrainingBundle trainingBundle = sli.getTrainingBundle();
        if (trainingBundle.isNotGroup() && trainingBundle.isDeletable()) {
            bundleService.delete(trainingBundle);
        }
        this.salesLineItemService.delete(sli);
        return this.save(sale);
    }

    public Sale confirmSale(Long saleId) {
        String messageTemplate = "Impossibile confermare vendita (#%d) vuota.";
        Sale sale = findById(saleId);
        if (!sale.confirmSale()) throw new BadRequestException(String.format(messageTemplate, sale.getId()));
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
        boolean payed = amountPayed + amount == sale.getTotalPrice();
        if (!payed) {
            if (amountPayed + amount > sale.getTotalPrice()) {
                String message = "Stai pagando più del dovuto!";
                logger.debug(message);
                throw new BadRequestException(message);
            }
        } else {
            sale.setPayed(true);
            sale.setPayedDate(new Date());
        }
        sale.setAmountPayed(amountPayed + amount);
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


        this.delete(sale);
        return sale;
    }

    private List<ATrainingBundle> getDeletableBundles(Sale sale) {
        return sale.getSalesLineItems()
                    .stream()
                    .map(SalesLineItem::getTrainingBundle)
                    .filter(ATrainingBundle::isNotGroup)
                    .collect(Collectors.toList());
    }
}
