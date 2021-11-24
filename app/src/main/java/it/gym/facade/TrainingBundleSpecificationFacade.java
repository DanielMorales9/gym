package it.gym.facade;

import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.model.*;
import it.gym.repository.PurchaseOptionRepository;
import it.gym.service.EventService;
import it.gym.service.TrainingBundleService;
import it.gym.service.TrainingBundleSpecificationService;
import java.util.List;
import javax.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

@Component
@Transactional
public class TrainingBundleSpecificationFacade {

  private static final Logger logger =
      LoggerFactory.getLogger(TrainingBundleSpecificationFacade.class);

  @Autowired private TrainingBundleSpecificationService service;

  @Autowired private EventService eventService;

  @Autowired private PurchaseOptionRepository repository;

  @Autowired
  @Qualifier("trainingBundleService")
  private TrainingBundleService bundleService;

  public ATrainingBundleSpecification findById(Long id) {
    return service.findById(id);
  }

  public void delete(ATrainingBundleSpecification spec) {
    boolean noBundles = bundleService.findBundlesBySpec(spec).isEmpty();

    if (!noBundles) {
      throw new BadRequestException(
          "Non è possibile eliminare un pacchetto attualmente in uso.");
    }

    boolean noEvents = eventService.findEventsBySpec(spec).isEmpty();

    if (!noEvents) {
      throw new BadRequestException(
          "Non è possibile eliminare un pacchetto con eventi associati.");
    }

    service.delete(spec);
  }

  public ATrainingBundleSpecification createTrainingBundleSpecification(
      ATrainingBundleSpecification spec) {
    return service.save(spec);
  }

  public Page<ATrainingBundleSpecification> findByNameContains(
      String name, Boolean disabled, Pageable pageable) {
    return this.service.search(name, disabled, pageable);
  }

  public ATrainingBundleSpecification save(ATrainingBundleSpecification spec) {
    return service.save(spec);
  }

  public Page<ATrainingBundleSpecification> findAll(Pageable pageable) {
    return service.findAll(pageable);
  }

  public boolean existsByName(String name) {
    return service.existsByName(name);
  }

  public ATrainingBundleSpecification createOptionToBundleSpec(
      Long id, APurchaseOption option) {
    ATrainingBundleSpecification bundleSpec;
    bundleSpec = this.service.findById(id);
    bundleSpec.addOption(option);
    return service.save(bundleSpec);
  }

  public List<ATrainingBundleSpecification> list(
      Boolean disabled, String type) {
    return this.service.list(disabled, type);
  }

  public ATrainingBundleSpecification deleteOption(Long id, Long optionId) {
    ATrainingBundleSpecification c = this.findById(id);
    APurchaseOption o =
        this.repository
            .findById(optionId)
            .orElseThrow(() -> new NotFoundException("Opzione non trovata"));
    c.getOptions().remove(o);
    repository.delete(o);
    return service.save(c);
  }
}
