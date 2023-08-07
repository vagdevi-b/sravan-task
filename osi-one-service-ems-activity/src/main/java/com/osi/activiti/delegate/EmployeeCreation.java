package com.osi.activiti.delegate;

import java.util.List;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.service.WfActivitiesService;

@Component("empCreation")
public class EmployeeCreation {
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private WfActivitiesService wfActivitiesService;
	
	public List<OsiWFActivities> getWFEmpList(ActivityExecution execution) throws BpmnError {
		List<OsiWFActivities> newEmpCreationList = null;
		LOGGER.info("## -- EmployeeCreation : getWFEmpList  -- Begin");
		try {
			
			newEmpCreationList = wfActivitiesService.findByProcessFlagAndObjectName((String)execution.getVariable("processFlag"), (String)execution.getVariable("objectName"));
			LOGGER.info("New Employee Creation List : "+newEmpCreationList);
			
		}  catch(BusinessException e) {
			LOGGER.info("Error Occured while executing the getWFEmpList : "+e.getSystemMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
			
		}  catch(Exception e) {
			LOGGER.info("Error Occured while executing the getWFEmpList : "+e.getMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error Occurred while executing findByProcessFlagAndObjectName");
			throw new BpmnError("ERR_1024", "Error Occurred while executing findByProcessFlagAndObjectName");
		}
		LOGGER.info("## -- EmployeeCreation : getWFEmpList  -- End");
		return newEmpCreationList;
	}
	
}
