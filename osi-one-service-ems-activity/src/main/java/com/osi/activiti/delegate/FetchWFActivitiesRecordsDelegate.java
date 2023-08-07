package com.osi.activiti.delegate;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiWFActivitiesRepository;

@Component("fetchWfActDelegate")
public class FetchWFActivitiesRecordsDelegate/* extends ActivityBehaviour */{
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Environment env;
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	//@Override
	public List<OsiWFActivities> onExecute(ActivityExecution execution) throws BusinessException {
		List<OsiWFActivities> newEmpCreationList = new ArrayList<>();
		LOGGER.info("## -- EmsParentProcessDelegate : getWFRecords  -- Begin");
		try {
			String processFlag = env.getProperty("ems.wf.activities.flag.initial.process");
			if(null != processFlag && !processFlag.isEmpty()) {
				newEmpCreationList = wfsActivitiesRepo.findByProcessFlag(processFlag);
				//newEmpCreationList = wfsActivitiesRepo.findByProcessFlagAndObjectName((String)execution.getVariable("processFlag"), (String)execution.getVariable("objectName"));
				//execution.setVariable("wfRecordsList", newEmpCreationList);
			} else {
				throw new BusinessException("ERR_1001","No Process Flag is defined in property file");
			}
			LOGGER.info("New Employee Creation List : "+newEmpCreationList);
			
		} catch(BusinessException e) {
			LOGGER.info("Error occured while executing the FetchWFActivitiesRecordsDelegate");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			throw new BusinessException("ERR_1001", e.getSystemMessage());
		} catch(Exception e) {
			LOGGER.info("Error occured while executing the FetchWFActivitiesRecordsDelegate");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			throw new BpmnError("ERR_1001", "Error occured while executing the FetchWFActivitiesRecordsDelegate");
		}
		LOGGER.info("## -- EmsParentProcessDelegate : getWFRecords  -- End");
		return newEmpCreationList;
	}
}
