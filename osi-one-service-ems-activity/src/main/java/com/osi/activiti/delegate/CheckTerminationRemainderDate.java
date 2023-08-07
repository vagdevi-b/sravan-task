package com.osi.activiti.delegate;

import java.util.Date;

import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.apache.commons.lang3.time.DateUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.service.EmployeeService;

@Component("checkTerminationRemainderStartDate")
public class CheckTerminationRemainderDate {
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Environment env;
	
	@Autowired
	private EmployeeService employeeService;
	
	public boolean onExecute(ActivityExecution execution) throws BusinessException {
		LOGGER.info("## CheckTerminationRemainderDate : Begin");
		boolean sendRemainder = false;
		try { 
			OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
			if(DateUtils.isSameDay(wfRecord.getStartDate(), new Date())) {
				LOGGER.info("Sending remainder");
				String separationDate = employeeService.getTerminationDate(wfRecord.getObjectId());
				execution.setVariable("empSeparationDate", separationDate);
				sendRemainder = true;
				String lmsMail = env.getProperty("lms.service.mail");
				String tmsMail = env.getProperty("tms.service.mail");
				if((lmsMail == null || lmsMail.isEmpty()) ||
						(tmsMail == null || tmsMail.isEmpty())) {
					throw new BusinessException("ERR_1026","External System(s) (LMS/TMS) mail ids not Found");
				} else {
					execution.setVariable("lmsMail", lmsMail);
					execution.setVariable("tmsMail", tmsMail);
				}
			} else {
				LOGGER.info("NOT Sending remainder");
			}
		} catch(BusinessException e) {
			LOGGER.info("Error Occurred while executing the CheckTerminationRemainderDate : "+e.getMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			throw new BusinessException("ERR_1022", "Error Occurred while executing the CheckTerminationRemainderDate");
		}
		LOGGER.info("## CheckTerminationRemainderDate : End");
		return sendRemainder;
	}
}
