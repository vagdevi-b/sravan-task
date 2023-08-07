package com.osi.activiti.delegate;

import java.util.HashMap;
import java.util.Map;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.service.EmployeeService;
import com.osi.ems.service.WfActivitiesService;

@Component("chkForModifications")
public class CheckForModificationsFields /*extends ActivityBehaviour*/ {
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EmployeeService employeeService;
	
	@Autowired
	private WfActivitiesService wfActivitiesService;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;

	//@Override
	public Map<String, String> onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info(" ## CheckForModificationsFields : Begin");
		boolean isExceptionOccured = false;
		Map<String, String> modifiedObject = new HashMap<>();
		try {
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			LOGGER.info("employee Object in CheckForModificationsFields :"+employee);
			if(!employee.equals(null)) {
				if(employee.getOfficeEmail() != null && !employee.getOfficeEmail().isEmpty()) {
					modifiedObject = employeeService.getModifiedFields(employee.getEmployeeId());
					LOGGER.info("modifiedObject Object in CheckForModificationsFields :"+modifiedObject);
					
					/*OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
					wfRecord.setProcessFlag(afterProcessFlag);
					wfActivitiesService.saveWfRecord(wfRecord);*/
					
					if(modifiedObject == null) {
						//execution.setVariable("modifiedFields", modifiedObject);
						isExceptionOccured = true;
						throw new BusinessException("ERR_1013", "No modified Objects Found");
					}
				} else {
					isExceptionOccured = true;
					throw new BusinessException("ERR_1027", "Employee EmailId is null");
				}
			} else {
				isExceptionOccured = true;
				throw new BusinessException("ERR_1010", "Employee object is null");
			}
		} catch(BusinessException e) {
			isExceptionOccured = true;
			LOGGER.info("Error Occured while executing the CheckForModificationsFields" + e.getSystemMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
		} catch(Exception e) {
			isExceptionOccured = true;
			LOGGER.info("Error Occured while executing the CheckForModificationsFields from DB" +e.getMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			
			throw new BpmnError("ERR_1012", "Error Occured while executing the CheckForModificationsFields");
		} finally {
			if(isExceptionOccured) {
				/**
				 * Rollback to 'N' state in osi_wf_activities table
				 */
				try {
					OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
					if(wfActivitiesService.findById(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
						wfRecord.setProcessFlag(initialProcessFlag);
						wfActivitiesService.saveWfRecord(wfRecord);
					}
				} catch(BusinessException e) {
					LOGGER.info("Error Occured while executing the finally Block in CheckForModificationsFields" + e.getSystemMessage());
					execution.setVariable("processDefId", execution.getProcessDefinitionId());
					execution.setVariable("processInsId", execution.getCurrentActivityName());
					execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
					throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
				}
			}
		}
		LOGGER.info(" ## CheckForModificationsFields : End");
		return modifiedObject;
	}

}
