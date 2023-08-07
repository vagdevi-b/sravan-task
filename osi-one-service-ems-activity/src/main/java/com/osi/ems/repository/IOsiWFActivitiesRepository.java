package com.osi.ems.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.osi.ems.domain.OsiWFActivities;

@Component("wfsActivitiesRepo")
@Repository
public interface IOsiWFActivitiesRepository extends CrudRepository<OsiWFActivities, Integer>{
		
	List<OsiWFActivities> findByProcessFlag(String flag);
	List<OsiWFActivities> findByProcessFlagAndObjectName(String flag, String wfType);
	
}
