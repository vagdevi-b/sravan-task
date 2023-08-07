package com.osi.activiti.delegate;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;

@Component("probEmp")
public class FetchOnProbationEmployeesDelegate {
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OsiEmployeesRepositoryCustom empRepo;
	
	public List<OsiEmployees> getList(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## FetchOnProbationEmployeesDelegate : Begin");
		List<OsiEmployees> onProbEmpList = new ArrayList<>();
		try {
			onProbEmpList = empRepo.getOnProbationEmployees();
		} catch(DataAccessException e) {
			LOGGER.info("Error Occured while executing the FetchOnProbationEmployeesDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", "Error Occured while executing the FetchOnProbationEmployeesDelegate from DB");
		} catch(Exception e) {
			//throw new BusinessException("ERR_1012", "Error Occured while executing the FetchOnProbationEmployeesDelegate");
			LOGGER.info("Error Occured while executing the FetchOnProbationEmployeesDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error Occured while executing the FetchOnProbationEmployeesDelegate from DB");
			
			throw new BpmnError("ERR_1019", "Error Occured while executing the FetchOnProbationEmployeesDelegate from DB");
		}
		LOGGER.info("## FetchOnProbationEmployeesDelegate : End");
		return onProbEmpList;
	}
}
