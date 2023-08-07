package com.osi.ems.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.osi.ems.domain.OsiWorkFlows;

@Component("workflowsRepo")
@Repository
public interface IOsiWorkFlowsRepository extends CrudRepository<OsiWorkFlows, Integer>{

	OsiWorkFlows findByWfsIdAndOrgId(Integer workFlowId, Integer orgId);
	
}
