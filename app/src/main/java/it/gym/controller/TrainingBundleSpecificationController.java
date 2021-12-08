package it.gym.controller;

import it.gym.facade.TrainingBundleSpecificationFacade;
import it.gym.model.APurchaseOption;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.pojo.TrainingBundleSpecificationDTO;
import java.io.IOException;
import java.util.List;
import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.rest.webmvc.RepositoryRestController;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RepositoryRestController
@RequestMapping("/bundleSpecs")
@PreAuthorize("isAuthenticated()")
public class TrainingBundleSpecificationController {

  @Autowired private TrainingBundleSpecificationFacade facade;

  @DeleteMapping("/{id}")
  public ResponseEntity<TrainingBundleSpecificationDTO> delete(
      @PathVariable Long id) {
    TrainingBundleSpecificationDTO spec = facade.delete(id);
    return ResponseEntity.ok(spec);
  }

  @GetMapping(path = "/{id}")
  public ResponseEntity<TrainingBundleSpecificationDTO> findById(
      @PathVariable Long id) {
    TrainingBundleSpecificationDTO dto = facade.findById(id);
    return ResponseEntity.ok(dto);
  }

  @PostMapping
  public ResponseEntity<TrainingBundleSpecificationDTO> post(
      @RequestBody ATrainingBundleSpecification spec) {
    TrainingBundleSpecificationDTO dto =
        facade.createTrainingBundleSpecification(spec);
    return ResponseEntity.ok(dto);
  }

  @PostMapping(path = "/{id}/options")
  public ResponseEntity<TrainingBundleSpecificationDTO> createOption(
      @PathVariable Long id, @RequestBody APurchaseOption option) {
    TrainingBundleSpecificationDTO s =
        facade.createOptionToBundleSpec(id, option);
    return ResponseEntity.ok(s);
  }

  @DeleteMapping(value = "/{id}/options/{optionId}")
  @PreAuthorize("hasAuthority('ADMIN')")
  public ResponseEntity<TrainingBundleSpecificationDTO> deleteOption(
      @PathVariable Long id, @PathVariable Long optionId) {
    TrainingBundleSpecificationDTO b = this.facade.deleteOption(id, optionId);
    return ResponseEntity.ok(b);
  }

  @PatchMapping(path = "/{id}")
  public ResponseEntity<TrainingBundleSpecificationDTO> patch(
      @PathVariable Long id, HttpServletRequest request) throws IOException {
    TrainingBundleSpecificationDTO spec = facade.patch(id, request);
    return ResponseEntity.ok(spec);
  }

  @GetMapping
  @ResponseBody
  public Page<TrainingBundleSpecificationDTO> findAll(Pageable pageable) {
    return facade.findAll(pageable);
  }

  @GetMapping(path = "/search")
  @ResponseBody
  public Page<TrainingBundleSpecificationDTO> search(
      @RequestParam(required = false) String name,
      @RequestParam(required = false) Boolean disabled,
      Pageable pageable) {
    return facade.search(name, disabled, pageable);
  }

  @GetMapping(path = "/list")
  @ResponseBody
  public List<TrainingBundleSpecificationDTO> list(
      @RequestParam(required = false) Boolean disabled,
      @RequestParam(required = false) String type) {
    return facade.list(disabled, type);
  }
}
