package it.gym.hateoas;

import com.fasterxml.jackson.annotation.JsonProperty;
import it.gym.model.APurchaseOption;
import it.gym.model.ATrainingBundle;
import it.gym.model.ATrainingSession;
import org.springframework.hateoas.RepresentationModel;

import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class TrainingBundleResource extends RepresentationModel<TrainingBundleResource> {

    private final Long bundleId;
    private final String name;
    private final Date createdAt;
    private final Date expiredAt;
    private final Boolean unlimitedDeletions;
    private final Integer numDeletions;
    private final Date startTime;
    private final Date endTime;
    private final String type;
    private final Boolean isDeletable;
    private final CustomerResource customer;
    private final APurchaseOption option;
    private final InnerTrainingBundleSpecificationResource bundleSpec;
    private final List<InnerTrainingSessionResource> sessions;


    public TrainingBundleResource(ATrainingBundle model) {
        this.bundleId = model.getId();
        this.name = model.getName();
        this.createdAt = model.getCreatedAt();
        this.expiredAt = model.getExpiredAt();
        this.unlimitedDeletions = model.getUnlimitedDeletions();
        this.numDeletions = model.getNumDeletions();
        this.startTime = model.getStartTime();
        this.endTime = model.getEndTime();
        this.type = model.getType();
        this.isDeletable = model.isDeletable();
        this.customer = model.getCustomer() != null? new CustomerResource(model.getCustomer()) : null;
        this.bundleSpec = model.getBundleSpec() != null ? new InnerTrainingBundleSpecificationResource(model.getBundleSpec()) : null;
        this.option = model.getOption();
        this.sessions = model.getSessions()
                .stream()
                .map(InnerTrainingSessionResource::new)
                .collect(Collectors.toList());
    }

    @JsonProperty("id")
    public Long getBundleId() {
        return bundleId;
    }

    public String getName() {
        return name;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public Date getExpiredAt() {
        return expiredAt;
    }

    public Boolean getUnlimitedDeletions() {
        return unlimitedDeletions;
    }

    public Integer getNumDeletions() {
        return numDeletions;
    }

    public Date getStartTime() {
        return startTime;
    }

    public Date getEndTime() {
        return endTime;
    }

    public APurchaseOption getOption() {
        return option;
    }

    public String getType() {
        return type;
    }

    public Boolean getDeletable() {
        return isDeletable;
    }

    public CustomerResource getCustomer() {
        return customer;
    }

    public InnerTrainingBundleSpecificationResource getBundleSpec() {
        return bundleSpec;
    }

    public List<InnerTrainingSessionResource> getSessions() {
        return sessions;
    }

    private static class InnerTrainingSessionResource extends RepresentationModel<InnerTrainingSessionResource> {

        private final Long id;
        private final boolean isCompleted;
        private final Date startTime;
        private final Date endTime;

        public InnerTrainingSessionResource(ATrainingSession sessions) {
            id = sessions.getId();
            isCompleted = sessions.getCompleted();
            startTime = sessions.getStartTime();
            endTime = sessions.getEndTime();
        }

        @JsonProperty("id")
        public Long getSessionId() {
            return id;
        }

        public boolean isCompleted() {
            return isCompleted;
        }

        public Date getStartTime() {
            return startTime;
        }

        public Date getEndTime() {
            return endTime;
        }
    }

}
