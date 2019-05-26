package it.gym.service;

import it.gym.exception.InvalidSaleException;
import it.gym.exception.NotFoundException;
import it.gym.exception.SalesIsNotCompletedException;
import it.gym.exception.SalesLineItemNotDeletedException;
import it.gym.model.*;
import it.gym.repository.SaleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

@Service
@Transactional
public class SaleService implements ICrudService<Sale, Long> {
    @Autowired
    private SaleRepository saleRepository;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private AdminService adminService;
    @Autowired
    private TrainingBundleSpecificationService bundleSpecService;
    @Autowired
    private SalesLineItemService salesLineItemService;

    public Sale save(Sale var1) {
        return this.saleRepository.save(var1);
    }

    public Sale findById(Long sale) {
        return this.saleRepository.findById(sale).orElseThrow(() -> new NotFoundException("Vendita", sale));
    }

    public void delete(Sale sale) {
        this.saleRepository.delete(sale);
    }

    public List<Sale> findAll() {
        return this.saleRepository.findAll();
    }

    public Page<Sale> findAll(Pageable pageable) {
        return this.saleRepository.findAll(pageable);
    }

    public Page<Sale> findUserSales(Long id, Pageable pageable) {
        return this.saleRepository.findUserSales(id, pageable);
    }

    public Page<Sale> findSalesByCustomerIdAndCreatedAtGreaterThanEqual(Long id, Date date, Pageable pageable) {
        return saleRepository.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, pageable);
    }

    public Page<Sale> findSalesByCreatedAtGreaterThanEqual(Date date, Pageable pageable) {
        return saleRepository.findSalesByCreatedAtGreaterThanEqual(date, pageable);
    }

    public Page<Sale> findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(String lastName,
                                                                              Date date,
                                                                              Pageable pageable) {
        return saleRepository.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, pageable);
    }

    public Page<Sale> findSalesByCustomerLastName(String lastName, Pageable pageable) {
        return saleRepository.findSalesByCustomerLastName(lastName, pageable);
    }

    public Sale createSale(String adminEmail, Long customerId) {
        Admin admin = adminService.findByEmail(adminEmail);
        Customer customer = customerService.findById(customerId);

        Sale sale = new Sale();
        sale.setCreatedAt(new Date());
        sale.setAdmin(admin);
        sale.setAmountPayed(0.);
        sale.setCustomer(customer);
        sale.setPayed(false);
        return this.save(sale);
    }

    public Sale getTotalPriceBySaleId(Long saleId) {
        Sale sale = this.findById(saleId);
        sale.getTotalPrice();
        return sale;
    }

    public Sale addSalesLineItem(Long saleId, Long bundleSpecId, Integer quantity) {
        Sale sale = this.findById(saleId);
        ATrainingBundleSpecification bundleSpec = this.bundleSpecService.findById(bundleSpecId);
        for (int i = 0; i < quantity; i++) {
            sale.addSalesLineItem(bundleSpec);
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
        this.customerService.save(sale.getCustomer());
        this.delete(sale);
        return sale;
    }

}
