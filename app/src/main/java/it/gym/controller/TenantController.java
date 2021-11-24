package it.gym.controller;

import it.gym.model.Tenant;
import it.gym.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(value = "/tenants")
public class TenantController {

  @Autowired private TenantService service;

  @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE)
  @ResponseStatus(HttpStatus.CREATED)
  public Tenant createTenant(@RequestBody Tenant tenant) {
    return service.createTenant(tenant);
  }

  @DeleteMapping("/{uuid}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void deleteTenant(@RequestParam String uuid) {
    service.deleteById(uuid);
  }

  @GetMapping
  public Page<Tenant> getTenants(Pageable pageable) {
    return service.findAll(pageable);
  }
}
