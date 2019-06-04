package it.gym.controller;

import it.gym.facade.SaleFacade;
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

    @Autowired private SaleFacade saleFacade;

    @GetMapping
    @ResponseBody
    Page<Sale> findAll(Pageable pageable) {
        return saleFacade.findAll(pageable);
    }

    @GetMapping(path = "/{id}")
    @ResponseBody
    ResponseEntity<SaleResource> findSaleById(@PathVariable Long id) {

        Sale sale = saleFacade.findById(id);

        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/customer")
    @ResponseBody
    ResponseEntity<CustomerResource> findUserBySaleId(@PathVariable Long id) {

        Sale sale = saleFacade.findById(id);

        return new ResponseEntity<>(new CustomerAssembler().toResource(sale.getCustomer()), HttpStatus.OK);
    }

    @GetMapping(path = "/{id}/salesLineItems")
    @ResponseBody
    ResponseEntity<List<SalesLineItemResource>> findLinesBySaleId(@PathVariable Long id) {

        Sale sale = saleFacade.findById(id);

        return new ResponseEntity<>(new SalesLineItemAssembler().toResources(sale.getSalesLineItems()), HttpStatus.OK);
    }

    @GetMapping(path = "/findUserSales")
    @ResponseBody
    Page<Sale> findUserSales(@RequestParam Long id, Pageable pageable) {
        return saleFacade.findUserSales(id, pageable);
    }

    @GetMapping(path = "/searchByDateAndId")
    @ResponseBody
    Page<Sale> findSalesByDateAndId(@RequestParam Long id,
                                    @DateTimeFormat(pattern = "dd-MM-yyyy",
                                            iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                    Pageable pageable) {
        return saleFacade.findSalesByCustomerIdAndCreatedAtGreaterThanEqual(id, date, pageable);
    }

    @GetMapping(path = "/searchByDate")
    @ResponseBody
    Page<Sale> findSalesByDate(@DateTimeFormat(pattern = "dd-MM-yyyy",
            iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                               Pageable pageable) {
        return saleFacade.findSalesByCreatedAtGreaterThanEqual(date, pageable);
    }

    @GetMapping(path = "/searchByLastNameAndDate")
    @ResponseBody
    @PreAuthorize("hasAuthority('ADMIN')")
    Page<Sale> findSalesByLastNameAndDate(@RequestParam String lastName,
                                          @RequestParam @DateTimeFormat(pattern = "dd-MM-yyyy",
                                                  iso = DateTimeFormat.ISO.DATE_TIME) Date date,
                                          Pageable pageable) {
        return saleFacade.findSalesByCustomerLastNameAndCreatedAtGreaterThanEqual(lastName, date, pageable);
    }

    @GetMapping(path = "/searchByLastName")
    @ResponseBody
    Page<Sale> findSalesByCustomerLastName(@RequestParam String lastName, Pageable pageable) {
        return saleFacade.findSalesByCustomerLastName(lastName, pageable);
    }

    @GetMapping(path = "/createSale/{adminEmail}/{customerId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> createSale(@PathVariable String adminEmail, @PathVariable Long customerId) {

        Sale sale = this.saleFacade.createSale(adminEmail, customerId);

        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/getTotalPrice/{saleId}")
    ResponseEntity<SaleResource> getTotalPrice(@PathVariable Long saleId) {
        Sale sale = this.saleFacade.getTotalPriceBySaleId(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/addSalesLineItem/{saleId}/{bundleSpecId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> addSalesLineItem(@PathVariable Long saleId,
                                                  @PathVariable Long bundleSpecId,
                                                  @RequestParam(defaultValue = "1") Integer quantity) {
        Sale sale = this.saleFacade.addSalesLineItem(saleId, bundleSpecId, quantity);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }


    @DeleteMapping(path = "/deleteSalesLineItem/{saleId}/{salesLineItemId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> deleteSalesLineItem(@PathVariable Long saleId,
                                                     @PathVariable Long salesLineItemId) {
        Sale sale = this.saleFacade.deleteSalesLineItem(saleId, salesLineItemId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @GetMapping(path = "/confirmSale/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> confirmSale(@PathVariable Long saleId) {
        Sale sale = this.saleFacade.confirmSale(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @PostMapping(path = "/pay/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> pay(@PathVariable Long saleId, @RequestBody Double amount) {
        Sale sale = this.saleFacade.paySale(saleId, amount);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

    @DeleteMapping(path = "/{saleId}")
    @PreAuthorize("hasAuthority('ADMIN')")
    ResponseEntity<SaleResource> deleteSale(@PathVariable Long saleId) {
        Sale sale = this.saleFacade.deleteSaleById(saleId);
        return new ResponseEntity<>(new SaleAssembler().toResource(sale), HttpStatus.OK);
    }

}
