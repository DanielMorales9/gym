package it.gym.controller;

import it.gym.hateoas.*;
import it.gym.model.Sale;
import it.gym.service.SaleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Date;
import java.util.List;

@RestController
@PreAuthorize("isAuthenticated()")
@RequestMapping("/sales")
public class SaleController {

    private final SaleService saleService;

    @Autowired
    public SaleController(SaleService saleService) {
        this.saleService = saleService;

    }

    @GetMapping
    @ResponseBody
    Page<Sale> findAll(Pageable pageable) {
        return saleService.findAll(pageable);
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    ResponseEntity<SaleResource> findSaleById(@PathVariable Long id) {

        Sale sale = saleService.findById(id);

        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/customer")
    @ResponseBody
    ResponseEntity<CustomerResource> findUserBySaleId(@PathVariable Long id) {

        Sale sale = saleService.findById(id);

        return new ResponseEntity<>(new CustomerAssembler().toResource(sale.getCustomer()), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/salesLineItems")
    @ResponseBody
    ResponseEntity<List<SalesLineItemResource>> findLinesBySaleId(@PathVariable Long id) {

        Sale sale = saleService.findById(id);

        return new ResponseEntity<>(new SalesLineItemAssembler().toResources(sale.getSalesLineItems()), HttpStatus.OK);
    }

    @GetMapping(path = "/findUserSales")
    @ResponseBody
    Page<Sale> findUserSales(@RequestParam Long id, Pageable pageable) {
        return saleService.findUserSales(id, pageable);
    }

    @GetMapping(path = "/searchByDateAndId")
    @ResponseBody
    Page<Sale> findSalesByDateAndId(@RequestParam Long id,
                                    @DateTimeFormat(pattern = "dd-MM-yyyy",
                                            iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                    Pageable pageable) {
        return saleService.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, pageable);
    }

    @GetMapping(path = "/searchByDate")
    @ResponseBody
    Page<Sale> findSalesByDate(@DateTimeFormat(pattern = "dd-MM-yyyy",
            iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                               Pageable pageable) {
        return saleService.findSalesByCreatedAtGreaterThanEqual(date, pageable);
    }

    @GetMapping(path = "/searchByLastNameAndDate")
    @ResponseBody
    @PreAuthorize("hasAuthority('ADMIN')")
    Page<Sale> findSalesByLastNameAndDate(@RequestParam String lastName,
                                          @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy",
                                                  iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                          Pageable pageable) {
        return saleService.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, pageable);
    }

    @GetMapping(path = "/searchByLastName")
    @ResponseBody
    Page<Sale> findSalesByCustomerLastName(@RequestParam String lastName, Pageable pageable) {
        return saleService.findSalesByCustomerLastName(lastName, pageable);
    }

    @GetMapping(path = "/createSale/{adminEmail}/{customerId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> createSale(@PathVariable String adminEmail, @PathVariable Long customerId) {

        Sale sale = this.saleService.createSale(adminEmail, customerId);

        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/getTotalPrice/{saleId}")
    ResponseEntity<SaleResource> getTotalPrice(@PathVariable Long saleId) {
        Sale sale = this.saleService.getTotalPriceBySaleId(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/addSalesLineItem/{saleId}/{bundleSpecId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> addSalesLineItem(@PathVariable Long saleId,
                                                  @PathVariable Long bundleSpecId,
                                                  @RequestParam(defaultValue = "1") Integer quantity) {
        Sale sale = this.saleService.addSalesLineItem(saleId, bundleSpecId, quantity);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }


    @DeleteMapping(path = "/deleteSalesLineItem/{saleId}/{salesLineItemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> deleteSalesLineItem(@PathVariable Long saleId,
                                                     @PathVariable Long salesLineItemId) {
        Sale sale = this.saleService.deleteSalesLineItem(saleId, salesLineItemId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/confirmSale/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> confirmSale(@PathVariable Long saleId) {
        Sale sale = this.saleService.confirmSale(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @PostMapping(path = "/pay/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> pay(@PathVariable Long saleId, @RequestBody Double amount) {
        Sale sale = this.saleService.paySale(saleId, amount);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> deleteSale(@PathVariable Long saleId) {
        Sale sale = this.saleService.deleteSaleById(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

}
