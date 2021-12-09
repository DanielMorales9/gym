package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.dto.TrainingBundleSpecificationDTO;
import it.gym.exception.BadRequestException;
import it.gym.exception.NotFoundException;
import it.gym.mappers.TrainingBundleSpecificationMapper;
import it.gym.model.*;
import it.gym.repository.PurchaseOptionRepository;
import it.gym.service.EventService;
import it.gym.service.TrainingBundleService;
import it.gym.service.TrainingBundleSpecificationService;
import java.io.IOException;
import java.util.List;
import java.util.stream.Collectors;
import javax.servlet.http.HttpServletRequest;
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

  @Autowired private ObjectMapper objectMapper;

  @Autowired
  @Qualifier("trainingBundleService")
  private TrainingBundleService bundleService;

  @Autowired private TrainingBundleSpecificationMapper mapper;

  public TrainingBundleSpecificationDTO findById(Long id) {
    return mapper.toDTO(service.findById(id));
  }

  public TrainingBundleSpecificationDTO delete(Long id) {
    ATrainingBundleSpecification spec = service.findById(id);

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
    return mapper.toDTO(spec);
  }

  public TrainingBundleSpecificationDTO createTrainingBundleSpecification(
      ATrainingBundleSpecification spec) {
    return mapper.toDTO(service.save(spec));
  }

  public Page<TrainingBundleSpecificationDTO> search(
      String name, Boolean disabled, Pageable pageable) {
    return this.service.search(name, disabled, pageable).map(mapper::toDTO);
  }

  public ATrainingBundleSpecification save(ATrainingBundleSpecification spec) {
    return service.save(spec);
  }

  public Page<TrainingBundleSpecificationDTO> findAll(Pageable pageable) {
    return service.findAll(pageable).map(mapper::toDTO);
  }

  public boolean existsByName(String name) {
    return service.existsByName(name);
  }

  public TrainingBundleSpecificationDTO createOptionToBundleSpec(
      Long id, APurchaseOption option) {
    ATrainingBundleSpecification bundleSpec;
    bundleSpec = this.service.findById(id);
    bundleSpec.addOption(option);
    return mapper.toDTO(service.save(bundleSpec));
  }

  public List<TrainingBundleSpecificationDTO> list(
      Boolean disabled, String type) {
    return this.service.list(disabled, type).stream()
        .map(mapper::toDTO)
        .collect(Collectors.toList());
  }

  public TrainingBundleSpecificationDTO deleteOption(Long id, Long optionId) {
    ATrainingBundleSpecification c = service.findById(id);
    APurchaseOption o =
        this.repository
            .findById(optionId)
            .orElseThrow(() -> new NotFoundException("Opzione non trovata"));
    c.getOptions().remove(o);
    repository.delete(o);
    return mapper.toDTO(service.save(c));
  }

  public TrainingBundleSpecificationDTO patch(
      Long id, HttpServletRequest request) throws IOException {
    ATrainingBundleSpecification spec = service.findById(id);
    spec = objectMapper.readerForUpdating(spec).readValue(request.getReader());
    return mapper.toDTO(service.save(spec));
  }
}
