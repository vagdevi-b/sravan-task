package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;

@Service("terminateEmp")
public class TerminateEmployee {
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OsiEmployeesRepositoryCustom empRepo;
	
	public void onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## TerminateEmployee : Begin");
		try {
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			empRepo.TerminateEmployee(employee.getEmployeeId());
		} catch (DataAccessException e) {
			LOGGER.info("Error occured while executing the TerminateEmployee");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", e.getSystemMessage());
		} catch(Exception e) {
			LOGGER.info("## Error occured while executing the TerminateEmployee ");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error occured while executing the TerminateEmployee");
			throw new BpmnError("ERR_1025", "Error occured while executing the TerminateEmployee");
		}
		LOGGER.info("## TerminateEmployee : End");
	}
}
