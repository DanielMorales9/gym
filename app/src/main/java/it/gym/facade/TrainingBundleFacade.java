package it.gym.facade;

import com.fasterxml.jackson.databind.ObjectMapper;
import it.gym.exception.MethodNotAllowedException;
import it.gym.model.ATrainingBundle;
import it.gym.model.CourseTrainingBundle;
import it.gym.model.CourseTrainingBundleSpecification;
import it.gym.pojo.CourseBundle;
import it.gym.service.TrainingBundleService;
import it.gym.service.TrainingBundleSpecificationService;
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

import static org.apache.commons.lang3.time.DateUtils.addMonths;


@Component
@Transactional
public class TrainingBundleFacade {

//    private static final Logger logger = LoggerFactory.getLogger(TrainingBundleFacade.class);

    @Autowired
    private TrainingBundleService service;

    @Autowired
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService specService;

    @Autowired
    private ObjectMapper objectMapper;

    public List<CourseTrainingBundle> findCoursesLargerThanInterval(Date startTime, Date endTime) {
        return service.findCoursesLargerThanInterval(startTime, endTime);
    }

    public ATrainingBundle findById(Long id) {
        return service.findById(id);
    }

    public Page<ATrainingBundle> findBundlesBySpecId(Long specId, Pageable pageable) {
        return service.findBundlesBySpecId(specId, pageable);
    }

    public Page<ATrainingBundle> findAll(Pageable pageable) {
        return service.findAll(pageable);
    }

    public ATrainingBundle createTrainingBundle(CourseBundle params) {
        CourseTrainingBundleSpecification spec = (CourseTrainingBundleSpecification)
                specService.findById(params.getSpecId());
        CourseTrainingBundle bundle = new CourseTrainingBundle();

        // compute start and end
        Date startTime = params.getStartTime();
        Date endTime = addMonths(startTime, spec.getNumber());

        bundle.setStartTime(startTime);
        bundle.setEndTime(endTime);
        bundle.setExpired(false);
        bundle.setName(params.getName());

        bundle.setBundleSpec(spec);

        return this.service.save(bundle);
    }

    public ATrainingBundle deleteById(Long id) {
        ATrainingBundle bundle = service.findById(id);
        service.delete(bundle);
        return bundle;
    }

    public ATrainingBundle save(ATrainingBundle bundle) {
        return service.save(bundle);
    }

    public ATrainingBundle update(Long id, HttpServletRequest request) throws IOException {
        ATrainingBundle bundle = service.findById(id);
        if (!bundle.isDeletable()) {
            throw new MethodNotAllowedException("Non è possibile modificare un pacchetto in uso");
        }
        bundle = objectMapper.readerForUpdating(bundle).readValue(request.getReader());
        if (bundle.getType().equals("C")) {
            bundle.update();
        }
        else {
            throw new MethodNotAllowedException("Non è possibile modificare un pacchetto personal");
        }
        return service.save(bundle);
    }

    public List<ATrainingBundle> findBundlesBySpecIdNotExpired(Long specId) {
        return service.findBundlesBySpecIdNotExpired(specId);
    }
}
