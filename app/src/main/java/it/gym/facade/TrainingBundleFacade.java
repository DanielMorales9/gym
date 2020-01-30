package it.gym.facade;

import it.gym.model.ATrainingBundle;
import it.gym.service.TrainingBundleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.List;


@Component
@Transactional
public class TrainingBundleFacade {

//    private static final Logger logger = LoggerFactory.getLogger(TrainingBundleFacade.class);

    @Autowired
    @Qualifier("trainingBundleService")
    private TrainingBundleService service;

    public ATrainingBundle findById(Long id) {
        return service.findById(id);
    }

    public Page<ATrainingBundle> findBundlesBySpecId(Long specId, Pageable pageable) {
        return service.findBundlesBySpecId(specId, pageable);
    }

    public Page<ATrainingBundle> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    public ATrainingBundle deleteById(Long id) {
        ATrainingBundle bundle = service.findById(id);
        service.delete(bundle);
        return bundle;
    }

    public ATrainingBundle save(ATrainingBundle bundle) {
        return service.save(bundle);
    }

    public List<ATrainingBundle> findBundlesBySpecIdNotExpired(Long specId) {
        return service.findBundlesBySpecIdNotExpired(specId);
    }

}
