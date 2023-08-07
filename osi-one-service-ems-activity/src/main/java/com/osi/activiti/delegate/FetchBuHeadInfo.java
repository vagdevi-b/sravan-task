package com.osi.activiti.delegate;

import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.service.EMSService;

@Component("fetchBuHeadInfo")
public class FetchBuHeadInfo {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EMSService emsService;
	
	@Autowired
	private Environment env;
	
	//@Override
	public OsiEmployees onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## -- FetchBuHeadInfo: Begin");
		OsiEmployees buInfo;
		try {
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			String probCheckResult = (String) execution.getVariable("probCheckResult");
			if(!employee.equals(null)) {
				
				String buName = env.getProperty("ems.probation.bu.head");
				if(!buName.isEmpty()) {
					if(employee.getSupervisorId() != null) {
						//buInfo = emsService.getBuHeadInfo(employee.getEmployeeId(), buName);
						buInfo = emsService.getBuHeadInfo(employee.getSupervisorId(), buName);
						
						/*StringBuilder buHeadMailBody = new StringBuilder();
						buHeadMailBody.append("Hi ");
						buHeadMailBody.append(buInfo.getFullName());
						buHeadMailBody.append(",<br/><br/>");
						buHeadMailBody.append("<div style='padding-left:30px'>Probation period has been completed for the below employee. Please take appropriate action and update the same.</div><br/><br/>");
						buHeadMailBody.append("Employee Name: ");
						buHeadMailBody.append(employee.getFullName());
						buHeadMailBody.append("<br/>Employee Number: ");
						buHeadMailBody.append(employee.getEmployeeNumber() + "<br/><br/>");
						buHeadMailBody.append("<b>Supervisor Action Info</b> <br/>");
						if(probCheckResult.equalsIgnoreCase("REACHED")) {
							buHeadMailBody.append("<TABLE>");
							buHeadMailBody.append("<TR style='text-align: left;'><TH>Status</TH><TD>${probationAction}</TD></TR>");
							buHeadMailBody.append("<TR style='text-align: left;'><TH>Reason</TH><TD>${probationReason}</TD></TR>");
							buHeadMailBody.append("<TR style='text-align: left;'><TH>Extended</TH><TD>${extendedValue}</TD></TR>");
							buHeadMailBody.append("</TABLE><BR/>");
						}
						buHeadMailBody.append("<form name='probationForm' action='${configDetails.serviceURL}/completeprobationtask'>");
						buHeadMailBody.append("<input type='radio' name='probationActionBu' value='approve'>Approve<br/>");
						buHeadMailBody.append("<input type='radio' name='probationActionBu' value='terminate'>Terminate<br/>");
						buHeadMailBody.append("<input type='radio' name='probationActionBu' value='extend'>Extend ");
						buHeadMailBody.append("(Extended Months)<input type='' name='extendedValueBu' ><br/>");
						buHeadMailBody.append("Reason: <textarea rows='3' cols='10' name='probationReasonBu'></textarea>");
						buHeadMailBody.append("<br/><input type='submit' value='submit' /></form><br/>");
						buHeadMailBody.append("Note:This email is compatible with Google Chrome browser<br/><br/>");
						buHeadMailBody.append("Thanks,<br/><B>EMS System</B>");
						
						execution.setVariable("buHeadMailBody", buHeadMailBody.toString());*/
					}  else {
						throw new BusinessException("ERR_1003", "Employee SupervisorId is Null for: "+employee.getEmployeeId());
					}
				}  else {
					throw new BusinessException("ERR_1002", "Invalid ems.probation.bu.head Property value");
				}
				
			} else {
				throw new BusinessException("ERR_1002", "Employee Object in execution is NULL");
			}
		} catch (BusinessException e) {
			LOGGER.info("Exception while executing the Fetch Bu Head Info");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getSystemMessage() + " -- "+e.getSystemMessage());
			throw new BpmnError("Err_1002", e.getSystemMessage());
		} catch (Exception e) {
			LOGGER.info("Exception while executing the Fetch Employee Info");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Exception while executing the Fetch Employee Info");
			throw new BpmnError("Err_1002", "Exception while executing the Fetch Employee Info");
		}
		LOGGER.info("## -- FetchBuHeadInfo : End");
		return buInfo;
	}
}
