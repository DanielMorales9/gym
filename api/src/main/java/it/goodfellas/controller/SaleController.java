package it.goodfellas.controller;

import it.goodfellas.exception.InvalidSaleException;
import it.goodfellas.exception.SalesIsNotCompletedException;
import it.goodfellas.exception.SalesLineItemNotDeletedException;
import it.goodfellas.hateoas.SaleAssembler;
import it.goodfellas.hateoas.SaleResource;
import it.goodfellas.model.*;
import it.goodfellas.repository.AdminRepository;
import it.goodfellas.repository.SaleRepository;
import it.goodfellas.repository.SalesLineItemRepository;
import it.goodfellas.service.CustomerService;
import it.goodfellas.service.SaleService;
import it.goodfellas.service.SalesLineItemService;
import it.goodfellas.service.TrainingBundleSpecificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.stream.Collectors;

@RepositoryRestController
public class SaleController {

    private final AdminRepository adminRepository;
    private final CustomerService customerService;

    private final SaleService saleService;

    private final static Logger logger = LoggerFactory.getLogger(SaleController.class);


    private final TrainingBundleSpecificationService bundleSpecificationService;
    private final SaleRepository saleRepository;
    private final SalesLineItemService salesLineItemService;
    private final SalesLineItemRepository salesLineItemRepo;

    @Autowired
    public SaleController(AdminRepository adminRepository,
                          CustomerService customerService,
                          SaleRepository saleRepository,
                          SalesLineItemService salesLineItemService,
                          SalesLineItemRepository salesLineItemRepo,
                          SaleService saleService,
                          TrainingBundleSpecificationService bundleSpecificationService) {
        this.adminRepository = adminRepository;
        this.customerService = customerService;
        this.saleRepository = saleRepository;
        this.salesLineItemRepo = salesLineItemRepo;
        this.salesLineItemService = salesLineItemService;
        this.saleService = saleService;

        this.bundleSpecificationService = bundleSpecificationService;
    }

    @GetMapping(path = "/sales/findUserSales")
    @ResponseBody
    Page<Sale> findUserSales(@RequestParam Long id, Pageable pageable) {
        return saleRepository.findUserSales(id, pageable);
    }

    @GetMapping(path = "/sales/searchByDate")
    @ResponseBody
    Page<Sale> findSalesByDate(@RequestParam Long id, @RequestParam String date, Pageable pageable) throws ParseException {
        SimpleDateFormat formatter = new SimpleDateFormat("dd-MM-yyyy");
        Date parsedDate = formatter.parse(date);
        logger.info(parsedDate.toString());
        return saleRepository.findSalesByCustomer_IdAndCreatedAtGreaterThanEqual(id, parsedDate, pageable);
    }

    @GetMapping(path = "/sales/searchByLastName")
    @ResponseBody
    Page<Sale> findSalesByCustomer_LastName(@RequestParam String lastName, Pageable pageable) {
        return saleRepository.findSalesByCustomer_LastName(lastName, pageable);
    }

    @GetMapping(path = "/sales/createNewSale/{adminEmail}/{customerId}")
    @Transactional
    ResponseEntity<SaleResource> createNewSale(@PathVariable String adminEmail,
                                               @PathVariable Long customerId) {

        Admin admin = adminRepository.findByEmail(adminEmail);
        Customer customer = customerService.findById(customerId);

        Sale sale = new Sale();
        sale.setCreatedAt(new Date());
        sale.setAdmin(admin);
        sale.setAmountPayed(0.);
        sale.setCustomer(customer);
        sale.setPayed(false);
        sale = this.saleService.save(sale);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/sales/getTotalPrice/{saleId}")
    @Transactional
    ResponseEntity<SaleResource> getTotalPrice(@PathVariable Long saleId) {
        Sale sale = getSale(saleId);
        sale.getTotalPrice();
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/sales/addSalesLineItem/{saleId}/{bundleSpecId}")
    @Transactional
    ResponseEntity<SaleResource> addSalesLineItem(@PathVariable Long saleId, @PathVariable Long bundleSpecId,
                                        @RequestParam(defaultValue = "1") Integer quantity) {
        Sale sale = getSale(saleId);
        ATrainingBundleSpecification bundleSpec = this.bundleSpecificationService
                .findById(bundleSpecId);
        SalesLineItem sli = sale.addSalesLineItem(quantity, bundleSpec);
        sale = this.saleService.save(sale);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }


    @DeleteMapping(path = "/sales/deleteSalesLineItem/{saleId}/{salesLineItemId}")
    @Transactional
    ResponseEntity<SaleResource> deleteSalesLineItem(@PathVariable Long saleId,
                                           @PathVariable Long salesLineItemId) {
        Sale sale = getSale(saleId);
        logger.info(sale.toString());
        SalesLineItem sli = sale.getSalesLineItems().stream()
                .filter(salesLineItem -> salesLineItem.getId().equals(salesLineItemId))
                .collect(Collectors.toList()).get(0);
        if (!sale.deleteSalesLineItem(sli))
            throw new SalesLineItemNotDeletedException(saleId, salesLineItemId);
        this.salesLineItemService.delete(sli);
        sale = this.saleService.save(sale);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/sales/confirmSale/{saleId}")
    @Transactional
    ResponseEntity<SaleResource> confirmSale(@PathVariable Long saleId) {
        Sale sale = getSale(saleId);
        sale.confirmSale();
        if (!sale.addBundlesToCustomersCurrentBundles()) {
            throw new InvalidSaleException("Could not add Bundles to Customer: %s",
                    sale.getCustomer().getId());
        }
        sale = this.saleService.save(sale);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    private Sale getSale(@PathVariable Long saleId) {
        return this.saleService.findById(saleId);
    }

    @PostMapping(path = "/sales/pay/{saleId}")
    @Transactional
    ResponseEntity<SaleResource> pay(@PathVariable Long saleId, @RequestBody Double amount) {
        Sale sale = getSale(saleId);
        if (!sale.isCompleted()) {
            throw new SalesIsNotCompletedException(saleId);
        }
        Double amountPayed = sale.getAmountPayed();
        boolean payed = amountPayed + amount == sale.getTotalPrice();
        if (!payed) {
            if (amountPayed + amount > sale.getTotalPrice())
                throw new RuntimeException("Stai pagando più del dovuto!");
        }
        else {
            sale.setPayed(true);
            sale.setPayedDate(new Date());
        }
        sale.setAmountPayed(amountPayed+amount);
        sale = this.saleService.save(sale);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @DeleteMapping(path = "/sales/{saleId}")
    @Transactional
    ResponseEntity<SaleResource> deleteSale(@PathVariable Long saleId) {
        Sale sale = this.getSale(saleId);
        if (!sale.isDeletable()) {
            logger.info("sale not deletable");
            throw new InvalidSaleException("Non è possibile eliminare la vendita per il cliente: %s",
                sale.getCustomer().getLastName());
        }
        else if (!sale.removeBundlesFromCustomersCurrentBundles()) {
            logger.info("sale not deletable");
            throw new InvalidSaleException("Non è possibile eliminare la vendita per il cliente: %s",
                    sale.getCustomer().getLastName());
        }
        this.salesLineItemRepo.deleteAll(sale.getSalesLineItems());
        this.customerService.save(sale.getCustomer());
        this.saleService.delete(sale);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

}
