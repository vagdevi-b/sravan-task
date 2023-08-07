package com.osi.activiti.delegate;

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
import com.osi.ems.domain.ConfigMails;
import com.osi.ems.domain.OsiConfigParameters;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiWFActivitiesRepository;
import com.osi.ems.service.IConfigParamsService;
import com.osi.ems.service.WfActivitiesService;

@Component("configDelegate")
public class EmsConfigDetailsDelegate /*extends ActivityBehaviour */{
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Environment env;
	
	@Autowired
	private IConfigParamsService configParamService;
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	@Autowired
	private WfActivitiesService wfActivitiesService;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	//@Override
	public ConfigMails onExecute(ActivityExecution execution) throws BpmnError {
		ConfigMails configDetails = null;
		boolean isExceptionOccured = false;
		LOGGER.info("## -- EMSService : setInput  -- Begin");
		String hrMail = null;
		String pmoMail = null;
		String itMail = null;
		String adminMail = null;
		String financeMail = null;
		String serviceUrl = env.getProperty("ems.service.url");
		String dlList = null;
		LOGGER.info("****************                     "+serviceUrl);
		try {
			configDetails = new ConfigMails();
			/*String hrMail = env.getProperty("ems.config.hrMail");
			String pmoMail = env.getProperty("ems.config.pmoMail");
			String itMail = env.getProperty("ems.config.itMail");
			String adminMail = env.getProperty("ems.config.adminMail");
			String financeMail = env.getProperty("ems.config.financeMail");
			String serviceUrl = env.getProperty("ems.service.url");*/
			
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			if(employee.equals(null)) {
				LOGGER.info("Employee object is null");
				throw new BusinessException("ERR_1003", "Employee Details Not Found in execution");
			}
			List<OsiConfigParameters> configList = configParamService.findByOrgId(employee.getOrgId());
			//List<OsiConfigParameters> configList = configParamRepo.findByOrgId(employee.getOrgId());
			for(OsiConfigParameters config : configList) {
				switch (config.getConfigName()) {
				case "HR_MAIL":
					hrMail = config.getConfigValue();
					break;
				case "IT_MAIL":
					itMail = config.getConfigValue();
					break;
				case "PMO_MAIL":
					pmoMail = config.getConfigValue();
					break;
				case "ADMIN_MAIL":
					adminMail = config.getConfigValue();
					break;
				case "FINANCE_MAIL":
					financeMail = config.getConfigValue();
					break;
				case "DL_LIST_EMP_CREATION":
					dlList = config.getConfigValue();
				}
			}
			
			if(hrMail.isEmpty() && pmoMail.isEmpty() && itMail.isEmpty() && adminMail.isEmpty() && financeMail.isEmpty() && serviceUrl.isEmpty()) {
				throw new BusinessException("ERR_1003", "Mail Configuration Details Not Found");
			}
			if(dlList == null ||dlList.isEmpty()) {
				throw new BusinessException("ERR_1003", "DL List Details Not Found");
			}else {
				String[] dlLists = dlList.split(",");
				configDetails.setDlLists(dlLists);
			}
			configDetails.setHrMail(hrMail);
			configDetails.setPmoMail(pmoMail);
			configDetails.setItMail(itMail);
			configDetails.setAdminMail(adminMail);
			configDetails.setFinanceMail(financeMail);
			configDetails.setServiceURL(serviceUrl + "/"+execution.getProcessInstanceId());
			/*OsiNotifications notification = emsService.saveNotifications(execution, employee, "Get DL List From HR");
			execution.setVariable("notificationId", notification.getNotificationId()); */
			//execution.setVariable("configDetails", configDetails);
		} catch (BusinessException e) {
			isExceptionOccured = true;
			LOGGER.info("Error Occured while executing the Get Config mails from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
		} catch(Exception e) {
			isExceptionOccured = true;
			LOGGER.info("Error Occured while executing the Get Config mails from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error Occured while executing the Get Config mails from DB");
			
			throw new BpmnError("ERR_1019", "Error Occured while executing the Get Config mails from DB");
		} finally {
			/**
			 * Rollback to 'N' state in osi_wf_activities table
			 */
			if(isExceptionOccured) {
				if(!execution.getCurrentActivityName().equalsIgnoreCase("Get Email Config List For Probation")) {
					try {
						OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
						if(wfActivitiesService.findById(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
							wfRecord.setProcessFlag(initialProcessFlag);
							wfsActivitiesRepo.save(wfRecord);
						}
					} catch(BusinessException e) {
						LOGGER.info("Error Occured while executing the Get Config mails from DB");
						execution.setVariable("processDefId", execution.getProcessDefinitionId());
						execution.setVariable("processInsId", execution.getCurrentActivityName());
						execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
						throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
					}
				}
			}
		}
		LOGGER.info("## -- EMSService : setInput  -- End");
		return configDetails;
	}

}
