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
import com.osi.ems.domain.OsiNotifications;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiNotificationsRepository;
import com.osi.ems.repository.IOsiWFActivitiesRepository;
import com.osi.ems.service.EMSService;


@Component("updateNotifications")
public class UpdateNotificationsDelegate /*extends ActivityBehaviour*/ {
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private IOsiNotificationsRepository notificationsRepo;
	
	@Autowired
	private EMSService emsService;
	
	@Autowired
	private Environment env;
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	@Value("${ems.wf.activities.flag.initial.process}")
	String initialProcessFlag;
	@Value("${ems.wf.activities.flag.after.process}")
	String afterProcessFlag;
	
	//@Override
	public void onExecute(ActivityExecution execution) throws BpmnError {
		LOGGER.info(" ## -- UpdateNotificationsDelegate : Begin");
		try {
			
			OsiNotifications notification = (OsiNotifications) execution.getVariable("newNotificationObject");
			if(notification != null) {
				String notificationStatus = env.getProperty("ems.notification.complete.status");
				if(notificationStatus.isEmpty())
					throw new BusinessException("ERRR_1006", "(ems.notification.complete.status proerty value not found");
				notification.setNotificationStatus(notificationStatus);
				notification.setNotificationDate(emsService.getCurrentDateinUTC());
				notificationsRepo.save(notification);
				execution.removeVariable("newNotificationObject");
			} else {
				throw new BusinessException("ERR_1008", "notification is Empty while updating notifications");
			}
		} catch(BusinessException e) {
			LOGGER.info("Error Occured while executing the UpdateNotificationsDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			
			throw new BpmnError("ERR_1019", e.getSystemMessage());
		} catch(Exception e) {
			//throw new BpmnError("ERR_1006", "Error Occured while updating notifications");
			
			LOGGER.info("Error Occured while executing the UpdateNotificationsDelegate from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- Error Occured while executing the UpdateNotificationsDelegate from DB");
			
			/**
			 * Rollback to 'N' state in osi_wf_activities table
			 */
			if(!execution.getCurrentActivityName().equalsIgnoreCase("Get Email Config List For Probation")) {
				OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
				if(wfsActivitiesRepo.findOne(wfRecord.getActivityId()).getProcessFlag().equalsIgnoreCase(afterProcessFlag)) {
					wfRecord.setProcessFlag(initialProcessFlag);
					wfsActivitiesRepo.save(wfRecord);
				}
			}
			throw new BpmnError("ERR_1019", "Error Occured while executing the UpdateNotificationsDelegate from DB");
		}
		LOGGER.info(" ## -- UpdateNotificationsDelegate : End");
	}

}
