package it.gym.facade;

import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingBundleSpecification;
import it.gym.model.CourseTrainingBundle;
import it.gym.model.CourseTrainingBundleSpecification;
import it.gym.pojo.CourseBundle;
import it.gym.service.TrainingBundleService;
import it.gym.service.TrainingBundleSpecificationService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Component;

import javax.transaction.Transactional;
import java.util.Date;
import java.util.List;

import static org.apache.commons.lang3.time.DateUtils.addMonths;


@Component
@Transactional
public class TrainingBundleFacade {

    private static final Logger logger = LoggerFactory.getLogger(TrainingBundleFacade.class);

    @Autowired
    private TrainingBundleService service;

    @Autowired
    @Qualifier("trainingBundleSpecificationService")
    private TrainingBundleSpecificationService specService;

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
}
