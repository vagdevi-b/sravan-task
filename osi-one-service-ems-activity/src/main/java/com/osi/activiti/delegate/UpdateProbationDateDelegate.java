package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;

@Component("updateProbDate")
public class UpdateProbationDateDelegate {

	Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OsiEmployeesRepositoryCustom empRepo;
	
	public void onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## UpdateProbationDateDelegate : Begin");
		try {
			OsiEmployees emp = (OsiEmployees) execution.getVariable("employee");
			String probationAction = (String) execution.getVariable("probationActionHr");
			String probationReason = (String) execution.getVariable("probationReasonHr");
			if(emp != null && probationAction != null && probationReason != null) {
				Integer extendedValue = null;
				if(probationAction.equalsIgnoreCase("extend"))
					extendedValue = Integer.parseInt(execution.getVariable("extendedValueHr").toString());
			
				empRepo.updateProbation(emp.getEmployeeId(), probationAction, extendedValue, probationReason);
			} else {
				throw new BusinessException("ERR_1014", "Invalid Employee Object is catched");
			}
		} catch(BusinessException e) {
			LOGGER.info("Error Occured while executing the UpdateProbationDateDelegate from DB : "+e.getMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", e.getSystemMessage());
		} catch(Exception e) {
			LOGGER.info("Error Occured while executing the UpdateProbationDateDelegate from DB : "+e.getMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error Occured while executing the UpdateProbationDateDelegate from DB");
			throw new BpmnError("ERR_1019", "Error Occured while executing the UpdateProbationDateDelegate from DB : "+e.getMessage());
		}
		LOGGER.info("## UpdateProbationDateDelegate : End");
	}
}
