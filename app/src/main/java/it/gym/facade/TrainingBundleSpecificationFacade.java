package it.gym.facade;

import it.gym.controller.ReservationController;
import it.gym.exception.BadRequestException;
import it.gym.model.*;
import it.gym.service.TrainingBundleService;
import it.gym.service.TrainingBundleSpecificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;


@Component
@Transactional
public class TrainingBundleSpecificationFacade {

    private static final Logger logger = LoggerFactory.getLogger(TrainingBundleSpecificationFacade.class);

    @Autowired
    private TrainingBundleSpecificationService service;

    @Autowired
    private TrainingBundleService bundleService;

    public ATrainingBundleSpecification findById(Long id) {
        return service.findById(id);
    }

    public void delete(ATrainingBundleSpecification spec) {
        List<ATrainingBundle> bundles = bundleService.findBundlesBySpec(spec);
        boolean isDeletable = bundles.isEmpty();
        if (!isDeletable) {
            throw new BadRequestException("Non è possibile eliminare un pacchetto attualmente in uso");
        }
        service.delete(spec);
    }

    public ATrainingBundleSpecification createTrainingBundleSpecification(ATrainingBundleSpecification spec) {
        return service.save(spec);
    }

    public Page<ATrainingBundleSpecification> findByNameContains(String query, Pageable pageable) {
        return service.findByNameContains(query, pageable);
    }

    public ATrainingBundleSpecification save(ATrainingBundleSpecification spec) {
        return service.save(spec);
    }

    public Page<ATrainingBundleSpecification> findByNameContainsAndIsDisabled(String query, boolean b, Pageable pageable) {
        return service.findByNameContainsAndIsDisabled(query, b, pageable);
    }

    public Page<ATrainingBundleSpecification> findByIsDisabled(boolean b, Pageable pageable) {
        return service.findByIsDisabled(b, pageable);
    }

    public Page<ATrainingBundleSpecification> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }
}
