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
import com.osi.ems.domain.OsiNotifications;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.service.EMSService;
import com.osi.ems.service.NotificationsService;
import com.osi.ems.service.WfActivitiesService;

@Component("checkForNotifications")
public class CheckForNotifications /*extends ActivityBehaviour*/ {
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private NotificationsService notificationsService;
	
	@Autowired
	private Environment env;
	
	@Autowired
	private EMSService emsService;
	
	@Autowired
	private WfActivitiesService wfActivitiesService;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	//@Override
	public boolean onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info("## -- CheckForNotifications: Begin");
		boolean isCounterReached = false;
		boolean isExceptionOccurred = false;
		try {
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			if(!employee.equals(null)) {
				if(employee.getOfficeEmail() != null && !employee.getOfficeEmail().isEmpty()) {
					String objectName = (String) execution.getVariable("ObjectName");
					if(!objectName.isEmpty() && !objectName.equals(null)) { 
						OsiNotifications existingNotification = notificationsService.findByNotificationEmpIdAndNotificationObjectAndNotificationStatus(employee.getEmployeeId(), objectName, "PROCESS");
						if(null == existingNotification) {
							OsiNotifications newNotificationObject = new OsiNotifications();
							newNotificationObject.setNotificationObjectId(employee.getEmployeeId()+"");
							newNotificationObject.setNotificationObject(objectName);
							String notificationStatus = env.getProperty("ems.notification.create.status");
							if(!(notificationStatus.isEmpty()))
								newNotificationObject.setNotificationStatus(notificationStatus);
							else {
								isExceptionOccurred = true;
								throw new BusinessException("ERRR_1006", "(ems.notification.create.status proerty value not found");
							}
							newNotificationObject.setNoOfTimesAsOfNow(1);
							newNotificationObject.setOrgId(employee.getOrgId());
							newNotificationObject.setNotificationDate(emsService.getCurrentDateinUTC());
							
							newNotificationObject = notificationsService.saveNotification(newNotificationObject);
							execution.setVariable("newNotificationObject", newNotificationObject);
							//execution.setVariable("isCounterReached", false);
							isCounterReached = false;
						} else {
							int noOfTimes = existingNotification.getNoOfTimesAsOfNow();
							int configCount = Integer.parseInt(env.getProperty("ems.notification.object.max.remainder.count"));
							if(noOfTimes < configCount) {
								existingNotification.setNoOfTimesAsOfNow(++noOfTimes);
								existingNotification.setNotificationDate(emsService.getCurrentDateinUTC());
								existingNotification = notificationsService.saveNotification(existingNotification);
								execution.setVariable("newNotificationObject", existingNotification);
								//execution.setVariable("isCounterReached", false);
								isCounterReached = false;
							} else {
								LOGGER.info("Maximum Remainders is Reached.");
								//execution.setVariable("isCounterReached", true);
								isCounterReached = true;
							}
						}
					} else {
						isExceptionOccurred = true;
						throw new BusinessException("ERR_1021", "(ems.notification.objectName value not found");
					}
				} else {
					isExceptionOccurred = true;
					throw new BusinessException("ERR_1027", "Employee Email NULL");
				}
			}
		} catch(NumberFormatException e) {
			LOGGER.info("Error Occured while executing the CheckForNotifications : " + e.getMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			throw new BpmnError("ERR_1008", "Property Not Found : ems.notification.object.max.remainder.count");
		} catch(BusinessException e) {
			LOGGER.info("Error Occured while executing the CheckForNotifications : " + e.getSystemMessage());
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
		} catch(Exception e) {
			
			LOGGER.info("Error Occured while executing the CheckForNotifications from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			
			throw new BpmnError("ERR_1020", "Error Occured while executing the CheckForNotifications : "+e.getMessage());
		} finally {
			try {
				if(isExceptionOccurred) {				
				/**
				 * Rollback to 'N' state in osi_wf_activities table
				 */
					if(!execution.getCurrentActivityName().equalsIgnoreCase("Get Email Config List For Probation")) {
						OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
						if(wfActivitiesService.findById(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
							wfRecord.setProcessFlag(initialProcessFlag);
							wfActivitiesService.saveWfRecord(wfRecord);
						}
					}
				}
			} catch(BusinessException e) {
				LOGGER.info("Error Occured while executing finally block in the CheckForNotifications : "+ e.getSystemMessage());
				execution.setVariable("processDefId", execution.getProcessDefinitionId());
				execution.setVariable("processInsId", execution.getCurrentActivityName());
				execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
				throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
			}
		}
		LOGGER.info("## -- CheckForNotifications: End");
		return isCounterReached;
	}

}
