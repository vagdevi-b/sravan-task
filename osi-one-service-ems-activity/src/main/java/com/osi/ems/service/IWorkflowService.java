package com.osi.ems.service;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiWorkFlows;

public interface IWorkflowService {

	OsiWorkFlows findById(Integer workFlowId) throws BusinessException;
	
	OsiWorkFlows findByWfsIdAndOrgId(Integer workFlowId, Integer orgId) throws BusinessException;
}
