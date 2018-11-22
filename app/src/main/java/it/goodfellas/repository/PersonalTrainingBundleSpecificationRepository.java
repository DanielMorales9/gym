package it.goodfellas.repository;

import it.goodfellas.model.PersonalTrainingBundleSpecification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

@RepositoryRestResource(path = "/pBundleSpecs", collectionResourceRel = "pBundleSpecs")
public interface PersonalTrainingBundleSpecificationRepository extends JpaRepository<PersonalTrainingBundleSpecification, Long> {

}
