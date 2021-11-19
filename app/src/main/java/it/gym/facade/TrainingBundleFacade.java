package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.model.ATrainingBundle;
import it.gym.service.TrainingBundleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.transaction.Transactional;
import java.io.IOException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;


@Component
@Transactional
public class TrainingBundleFacade {

//    private static final Logger logger = LoggerFactory.getLogger(TrainingBundleFacade.class);

    @Autowired
    @Qualifier("trainingBundleService")
    private TrainingBundleService service;

    @Autowired
    private ObjectMapper objectMapper;

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

    public ATrainingBundle patchBundle(Long id, HttpServletRequest request) throws IOException {
        ATrainingBundle bundle = findById(id);
        bundle = objectMapper.readerForUpdating(bundle).readValue(request.getReader());
        if (bundle.isExpired()) {
            bundle.terminate();
        } else {
            bundle.activate();
        }
        bundle = save(bundle);
        return bundle;
    }
}
