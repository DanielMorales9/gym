package it.gym.repository;
import it.gym.model.TimeOff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.Date;
import java.util.List;


@RepositoryRestResource(path="/timesOff")
public interface TimeOffRepository extends JpaRepository<TimeOff, Long> {

    @Query("select t from TimeOff as t where t.startTime >= :starttime  and t.endTime <= :endtime")
    List<TimeOff> findAllTimesOff(@RequestParam("starttime") Date starttime,
                                  @RequestParam("endtime") Date endtime);

    @Query("select t.type from TimeOff as t where t.startTime <= :starttime and t.endTime >= :endtime")
    List<String> findTimesOffTypeInBetween(@RequestParam("starttime") Date starttime,
                                           @RequestParam("endtime") Date endtime);

//    @Query("selectBundle t from TimeOff as t where t.startTime <= :starttime and t.endTime >= :endtime and t.type = :type")
//    List<TimeOff> findTimesOffInBetweenByType(@RequestParam("starttime") Date starttime,
//                                              @RequestParam("endtime") Date endtime,
//                                              @RequestParam("type") String type);

    @Query("select t from TimeOff as t where not (t.startTime > :endtime or t.endTime < :starttime)")
    List<TimeOff> findOverlappingTimesOff(@RequestParam("starttime") Date starttime,
                                          @RequestParam("endtime") Date endtime);

    @Query("select t from TimeOff as t where not (t.startTime > :endtime or t.endTime < :starttime) and t.type = :type")
    List<TimeOff> findOverlappingTimesOffByType(@RequestParam("starttime") Date starttime,
                                                @RequestParam("endtime") Date endtime,
                                                @RequestParam("type") String type);

    @Query("select t from TimeOff as t where t.user.id = :id and t.startTime >= :starttime " +
            "and t.endTime <= :endtime")
    List<TimeOff> findAllTimesOffById(@RequestParam("id") Long id,
                                      @RequestParam("starttime") Date starttime,
                                      @RequestParam("endtime") Date endtime);

    @Query("select t from TimeOff as t where t.type = :type and t.startTime >= :starttime " +
            "and t.endTime <= :endtime ")
    List<TimeOff> findAllTimesOffByType(@RequestParam("type")String type,
                                        @RequestParam("starttime") Date starttime,
                                        @RequestParam("endtime") Date endtime);
}

