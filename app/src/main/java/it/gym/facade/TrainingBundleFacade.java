package it.gym.facade;

import it.gym.model.ATrainingBundle;
import it.gym.model.Customer;
import it.gym.service.TrainingBundleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;


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

    public Page<ATrainingBundle> search(Long specId, Boolean expired, Date time, Pageable pageable) {
        Page<ATrainingBundle> bundles;
        if (specId != null) {
            bundles = service.findBundlesBySpecId(specId, pageable);
        }
        else if (expired != null && time != null) {
            if (expired) {
                bundles = service.findBundlesByExpiredAtGreaterThan(time, pageable);
            }
            else {
                bundles = service.findBundlesByCreatedAtGreaterThan(time, pageable);
            }
        }
        else if (time != null) {
            bundles = service.findBundlesByCreatedAtGreaterThan(time, pageable);
        }
        else if (expired != null) {
            if (expired) {
                bundles = service.findBundlesByExpired(pageable);
            }
            else {
                bundles = service.findBundlesByNotExpired(pageable);
            }
        }
        else {
            bundles = service.findAll(pageable);
        }
        return bundles;

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

}
