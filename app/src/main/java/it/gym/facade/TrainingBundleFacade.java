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
        return service.search(specId, expired, time, pageable);
    }

    public Page<ATrainingBundle> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    public ATrainingBundle deleteById(Long id) {
        ATrainingBundle bundle = service.findById(id);
        bundle.getCustomer().deleteBundle(bundle);
        service.delete(bundle);
        return bundle;
    }

    public ATrainingBundle save(ATrainingBundle bundle) {
        return service.save(bundle);
    }

    public List<ATrainingBundle> getExpiredBundles() {
        List<ATrainingBundle> notExpired = this.service.findBundlesByNotExpired();
        List<ATrainingBundle> expired = notExpired
                .stream().filter(ATrainingBundle::isExpired).collect(Collectors.toList());

        expired.forEach(ATrainingBundle::terminate);
        return this.service.saveAll(expired);

    }

    public List<ATrainingBundle> getActiveBundles() {
        return this.service.findBundlesByNotExpired();
    }
}
