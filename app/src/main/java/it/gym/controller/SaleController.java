package it.gym.controller;

import it.gym.facade.SaleFacade;
import it.gym.hateoas.*;
import it.gym.model.Sale;
import it.gym.model.SalesLineItem;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.hateoas.CollectionModel;
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

    @GetMapping(path = "/{id}")
    @ResponseBody
    public ResponseEntity<SaleResource> findSaleById(@PathVariable Long id) {

        Sale sale = facade.findById(id);

        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/findByCustomer")
    @ResponseBody
    public Page<Sale> findUserSales(@RequestParam Long id,
                                    @RequestParam(required = false)
                                    @DateTimeFormat(pattern = "dd-MM-yyyy",
                                            iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                    @RequestParam(required = false) Boolean payed,
                                    Pageable pageable) {
        return facade.findAllUserSales(id, date, payed, pageable);
    }

    @GetMapping
    @ResponseBody
    public Page<Sale> findAll(@RequestParam(required = false) Boolean payed,
                              Pageable pageable) {
        return facade.findAll(payed, pageable);
    }

    @GetMapping(path = "/search")
    @ResponseBody
    @PreAuthorize("hasAuthority('ADMIN')")
    public Page<Sale> findSalesByLastNameAndDate(@RequestParam(required = false) String lastName,
                                                 @RequestParam(required = false) @DateTimeFormat(pattern = "dd-MM-yyyy",
                                                         iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                                 @RequestParam(required = false) Boolean payed,
                                                 Pageable pageable) {
        return facade.getSales(lastName, date, payed, pageable);
    }

<<<<<<< optimize-hateoas
=======

    @GetMapping(path = "/{id}/salesLineItems")
    @ResponseBody
    public List<SalesLineItem> findLinesBySaleId(@PathVariable Long id) {

        Sale sale = facade.findById(id);

        return sale.getSalesLineItems();
    }

>>>>>>> fixed hateoas
    @PostMapping
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> createSale(@RequestParam Long customerId) {
        Sale sale = this.facade.createSale(customerId);
        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }

    @PutMapping(value = "/{saleId}/salesLineItems")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> addSalesLineItem(@PathVariable Long saleId,
                                                         @RequestParam Long bundleSpecId,
                                                         @RequestParam Long optionId) {
        Sale sale = this.facade.addSalesLineItem(saleId, bundleSpecId, optionId);
        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }


    @DeleteMapping(value = "/{saleId}/salesLineItems/{salesLineItemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> deleteSalesLineItem(@PathVariable Long saleId,
                                                            @PathVariable Long salesLineItemId) {
        Sale sale = this.facade.deleteSalesLineItem(saleId, salesLineItemId);
        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }

    @GetMapping(value = "/{saleId}/confirm")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> confirmSale(@PathVariable Long saleId) {
        Sale sale = this.facade.confirmSale(saleId);
        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }

    @GetMapping(value = "/{saleId}/pay")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> pay(@PathVariable Long saleId, @RequestParam Double amount) {
        Sale sale = this.facade.paySale(saleId, amount);
        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }

    @DeleteMapping(value = "/{saleId}/payments/{paymentId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> deletePayment(@PathVariable Long saleId, @PathVariable Long paymentId) {
        Sale sale = this.facade.deletePayment(saleId, paymentId);
        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<SaleResource> deleteSale(@PathVariable Long saleId) {
        Sale sale = this.facade.deleteSaleById(saleId);
        return new ResponseEntity<SaleResource>(new SaleAssembler().toModel(sale), HttpStatus.OK);
    }

}
