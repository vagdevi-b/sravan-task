package com.osi.ems.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiWorkFlows;
import com.osi.ems.repository.IOsiWorkFlowsRepository;
import com.osi.ems.service.IWorkflowService;

@Service("workflowsService")
public class WorkflowServiceImpl implements IWorkflowService {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private IOsiWorkFlowsRepository workflowsRepo;
	
	@Override
	public OsiWorkFlows findById(Integer workFlowId) throws BusinessException {
		LOGGER.info("## -- findById: Begin");
		OsiWorkFlows workflow = null;
		try {
			workflow = workflowsRepo.findOne(workFlowId);
		} catch(Exception e) {
			LOGGER.info("Error while getting work flow info from DB : "+e.getMessage());
			throw new BusinessException("ERR_1007", "Error while getting work flow info from DB");
		}
		LOGGER.info("## -- findById: End");
		return workflow;
	}
	
	@Override
	public OsiWorkFlows findByWfsIdAndOrgId(Integer workFlowId, Integer orgId) throws BusinessException {
		LOGGER.info("## -- findById: Begin");
		OsiWorkFlows workflow = null;
		try {
			workflow = workflowsRepo.findByWfsIdAndOrgId(workFlowId, orgId);
		} catch(Exception e) {
			LOGGER.info("Error while getting work flow info from DB : "+e.getMessage());
			throw new BusinessException("ERR_1007", "Error while getting work flow info from DB");
		}
		LOGGER.info("## -- findById: End");
		return workflow;
	}

}
