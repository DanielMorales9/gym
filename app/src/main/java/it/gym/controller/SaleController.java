package it.gym.controller;

import it.gym.facade.SaleFacade;
import it.gym.hateoas.*;
import it.gym.model.Sale;
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

    @Autowired
    private SaleFacade facade;

    @GetMapping
    @ResponseBody
    public Page<Sale> findAll(@RequestParam(required = false) Boolean payed,
                              Pageable pageable) {
        return facade.findAll(payed, pageable);
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    public ResponseEntity<SaleResource> findSaleById(@PathVariable Long id) {

        Sale sale = facade.findById(id);

        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/customer")
    @ResponseBody
    ResponseEntity<AUserResource> findUserBySaleId(@PathVariable Long id) {

        Sale sale = facade.findById(id);

        return new ResponseEntity<>(new AUserAssembler().toResource(sale.getCustomer()), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/salesLineItems")
    @ResponseBody
    ResponseEntity<List<SalesLineItemResource>> findLinesBySaleId(@PathVariable Long id) {

        Sale sale = facade.findById(id);

        return new ResponseEntity<>(new SalesLineItemAssembler().toResources(sale.getSalesLineItems()), HttpStatus.OK);
    }

    @GetMapping(path = "/findUserSales")
    @ResponseBody
    public Page<Sale> findUserSales(@RequestParam Long id,
                                    @RequestParam(required = false) Boolean payed,
                                    Pageable pageable) {
        return facade.findUserSales(id, payed, pageable);
    }

    @GetMapping(path = "/searchByDateAndId")
    @ResponseBody
    public Page<Sale> findSalesByDateAndId(@RequestParam Long id,
                                           @RequestParam
                                           @DateTimeFormat(pattern = "dd-MM-yyyy",
                                                   iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                           @RequestParam(required = false) Boolean payed,
                                           Pageable pageable) {
        return facade.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, payed, pageable);
    }

    @GetMapping(path = "/searchByDate")
    @ResponseBody
    public Page<Sale> findSalesByDate(@RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy",
            iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                      Pageable pageable) {
        return facade.findSalesByCreatedAtGreaterThanEqual(date, pageable);
    }

    @GetMapping(path = "/searchByLastNameAndDate")
    @ResponseBody
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Sale> findSalesByLastNameAndDate(@RequestParam String lastName,
                                                 @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy",
                                                         iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                                 @RequestParam(required = false) Boolean payed,
                                                 Pageable pageable) {
        return facade.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, payed, pageable);
    }

    @GetMapping(path = "/searchByLastName")
    @ResponseBody
    public Page<Sale> findSalesByCustomerLastName(@RequestParam String lastName,
                                                  @RequestParam(required = false) Boolean payed,
                                                  Pageable pageable) {
        return facade.findSalesByCustomerLastName(lastName, payed, pageable);
    }

    @GetMapping(path = "/createSale/{customerId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> createSale(@PathVariable Long customerId) {
        Sale sale = this.facade.createSale(customerId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/getTotalPrice/{saleId}")
    public ResponseEntity<SaleResource> getTotalPrice(@PathVariable Long saleId) {
        Sale sale = this.facade.getTotalPriceBySaleId(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/addSalesLineItem")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> addSalesLineItem(@RequestParam Long saleId,
                                                         @RequestParam Long bundleSpecId,
                                                         @RequestParam(required = false) Long optionId) {
        Sale sale = this.facade.addSalesLineItem(saleId, bundleSpecId, optionId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }


    @DeleteMapping(path = "/deleteSalesLineItem/{saleId}/{salesLineItemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> deleteSalesLineItem(@PathVariable Long saleId,
                                                            @PathVariable Long salesLineItemId) {
        Sale sale = this.facade.deleteSalesLineItem(saleId, salesLineItemId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/confirmSale/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> confirmSale(@PathVariable Long saleId) {
        Sale sale = this.facade.confirmSale(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/pay/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> pay(@PathVariable Long saleId, @RequestParam Double amount) {
        Sale sale = this.facade.paySale(saleId, amount);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> deleteSale(@PathVariable Long saleId) {
        Sale sale = this.facade.deleteSaleById(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

}
