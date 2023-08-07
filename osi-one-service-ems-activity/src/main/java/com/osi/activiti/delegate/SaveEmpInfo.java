package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiWFActivitiesRepository;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;

@Component("saveEmpInfo")
public class SaveEmpInfo /*extends ActivityBehaviour*/ {
	
	@Autowired
	private OsiEmployeesRepositoryCustom employeeRepo;
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());

	//@Override
	public void onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## -- SaveEmpInfo : -- Begin");
		try {
				String emailId = (String) execution.getVariable("emailId");
				String username = (String) execution.getVariable("username");
				String serialnumber = (String) execution.getVariable("serialnumber");
				String mailStop = (String) execution.getVariable("mailStop");
				if(emailId.isEmpty() && username.isEmpty() && serialnumber.isEmpty() && mailStop.isEmpty()) {
					throw new BusinessException("ERR_1004", "IT not provide the employee info(emailId/username/serialnumber/mailStop)");
				}
				OsiEmployees empVar = (OsiEmployees) execution.getVariable("employee");
				if(!empVar.equals(null)) {
					OsiEmployees emp = new OsiEmployees();
					emp.setEmployeeId(empVar.getEmployeeId());
					emp.setOfficeEmail(emailId.toUpperCase());
					emp.setSerialNumber(serialnumber);
					emp.setUserName(username);
					emp.setMailStop(mailStop);
					
					employeeRepo.saveOfficeInfoFormIT(emp);
					empVar.setOfficeEmail(emailId);
					empVar.setUserName(username);
					empVar.setSerialNumber(serialnumber);
					empVar.setMailStop(mailStop);
					//OsiEmployees employee = employeeRepo.getEmployee(empVar.getEmployeeId());
					execution.setVariable("employee", empVar);
				} else {
					throw new BusinessException("ERR_1004", "Employee object is Null");
				}
		}  catch(BusinessException e) {
			LOGGER.info("Error Occured while executing the GetSkillNotUpdatedEmployees from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", e.getSystemMessage());
		} catch(DataAccessException e) {
			LOGGER.info("Error Occured while executing the GetSkillNotUpdatedEmployees from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", e.getSystemMessage());
		} catch (Exception e) {
			LOGGER.info("Error occured while executing saveInfo");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error occured while executing the Update Employee Info");
			
			/**
			 * Rollback to 'N' state in osi_wf_activities table
			 */
			OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
			if(wfsActivitiesRepo.findOne(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
				wfRecord.setProcessFlag(initialProcessFlag);
				wfsActivitiesRepo.save(wfRecord);
			}
			throw new BpmnError("ERR_1000", "Error occured while executing the Update Employee Info");
		}
		LOGGER.info("## -- SaveEmpInfo : -- End");
	}

}
