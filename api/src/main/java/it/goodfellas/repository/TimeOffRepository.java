package it.goodfellas.repository;
import it.goodfellas.model.TimeOff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;


@RepositoryRestResource(path="/timesOff")
public interface TimeOffRepository extends JpaRepository<TimeOff, Long> {

    @Query("select t from TimeOff as t where t.startTime <= :starttime and t.endTime >= :endtime")
    List<TimeOff> findAllTimesOff(@RequestParam("starttime") Date starttime,
                                  @RequestParam("endtime") Date endtime);
}

