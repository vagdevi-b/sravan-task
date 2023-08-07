package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.domain.OsiWorkFlows;
import com.osi.ems.service.EMSService;
import com.osi.ems.service.EmployeeService;
import com.osi.ems.service.IWorkflowService;
import com.osi.ems.service.WfActivitiesService;

@Component("fetchEmpInfo")
public class FetchEmpInfo/* extends ActivityBehaviour*/ {
	

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EmployeeService employeeService;
	
	@Autowired
	private IWorkflowService workflowsService;
	
	@Autowired
	private WfActivitiesService wfActivitiesService;
	
	@Autowired
	private EMSService emsService;
	
	@Autowired
	private Environment env;
	
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	//@Override
	public OsiEmployees onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## -- FetchEmpInfo: Begin");
		OsiEmployees employee = null;
		try {
			OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
			if(!wfRecord.equals(null)) {
				
				employee = employeeService.getEmployee(wfRecord.getObjectId());
				
				//OsiWorkFlows workFlow = workflowsService.findById(wfRecord.getWfsId());
				OsiWorkFlows workFlow = workflowsService.findByWfsIdAndOrgId(wfRecord.getWfsId(), employee.getOrgId());
				if(workFlow != null && workFlow.getStartOrStop() != null && workFlow.getStartOrStop() == 1) {
					execution.setVariable("runWorkflow", true);
					wfRecord.setObjectType(workFlow.getActivityName());
					
					//employee = employeeRepo.getEmployee(wfRecord.getObjectId());
					LOGGER.info(employee.toString());
					//execution.setVariable("employee", employee);
					String processFlag = env.getProperty("ems.wf.activities.flag.after.process");
					if(!processFlag.isEmpty()) {
						wfRecord.setProcessFlag(processFlag);
						wfRecord.setActualStartDate(emsService.getCurrentDateinUTC());
						wfActivitiesService.saveWfRecord(wfRecord);
					} else {
						throw new BusinessException("ERR_1002", "No property found : ems.wf.activities.flag.after.process");
					}
				} else {
					wfRecord.setProcessFlag(afterProcessFlag);
					wfActivitiesService.saveWfRecord(wfRecord);
					execution.setVariable("runWorkflow", false);
				}
				
			} else {
				throw new BusinessException("ERR_1006", "WfRecord is NULL");
			}
		} catch (BusinessException e) {
			execution.setVariable("runWorkflow", false);
			if(e.getErrorCode() == "ERR_1001")
				LOGGER.info("Employee Details Not Found with Employee Id: ");
			else {
				execution.setVariable("processDefId", execution.getProcessDefinitionId());
				execution.setVariable("processInsId", execution.getCurrentActivityName());
				execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
				throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
			}
		} catch (Exception e) {
			execution.setVariable("runWorkflow", false);
			LOGGER.info("Exception while executing the Fetch Employee Info");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Exception while executing the Fetch Employee Info");
			throw new BpmnError("ERR_1005", "Exception while executing the Fetch Employee Info");
		}
		LOGGER.info("## -- FetchEmpInfo : End");
		return employee;
	}
	
}
