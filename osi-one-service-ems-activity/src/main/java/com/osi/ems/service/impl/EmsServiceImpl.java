package com.osi.ems.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiNotifications;
import com.osi.ems.repository.IOsiNotificationsRepository;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;
import com.osi.ems.service.EMSService;

@Service("emsService")
public class EmsServiceImpl implements EMSService {

	@Autowired
	private OsiEmployeesRepositoryCustom employeeRepo;
	
	@Autowired
	private IOsiNotificationsRepository notificationsRepo;
	
	@Autowired
	private Environment env;
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Transactional
	@Override
	public OsiNotifications saveNotifications(ActivityExecution execution, OsiEmployees employee, String object) throws BusinessException {
			String rmNotifyCode = env.getProperty("ems.probation.notify.rm");
			String buNotifyCode = env.getProperty("ems.probation.notify.bu");
			String hrNotifyCode = env.getProperty("ems.probation.notify.hr");
			OsiNotifications notification = new OsiNotifications();
			if(object.equalsIgnoreCase(rmNotifyCode)) {
				OsiNotifications existNotifications = notificationsRepo.findByNotificationEmpIdAndNotificationObjectAndNotificationStatus(employee.getEmployeeId(), object, "PROCESS");
				if(existNotifications != null && existNotifications.getNoOfTimesAsOfNow() == 1) {
					notification.setNotificationId(existNotifications.getNotificationId());
					notification.setNoOfTimesAsOfNow(existNotifications.getNoOfTimesAsOfNow()+1);
					notification.setNotificationDate(existNotifications.getNotificationDate());
				} else {
					notification.setNoOfTimesAsOfNow(1);
					notification.setNotificationDate(this.getCurrentDateinUTC());
				}
			} else {
				notification.setNoOfTimesAsOfNow(1);
				notification.setNotificationDate(this.getCurrentDateinUTC());
			}
			if(object.equalsIgnoreCase(rmNotifyCode) || object.equalsIgnoreCase(buNotifyCode) || object.equalsIgnoreCase(hrNotifyCode)) {
				notification.setNotificationObjectId((String) execution.getVariable("mainProcessInstanceId"));
			} else
				notification.setNotificationObjectId(employee.getEmployeeId()+"");
			
			notification.setNotificationEmpId(employee.getEmployeeId());
			notification.setNotificationObject(object);
			notification.setNotificationStatus("PROCESS");
			notification = notificationsRepo.save(notification);
			execution.setVariable(object, notification);
			return notification;
	}
	
	@Transactional
	@Override
	public void updateNotifications(ActivityExecution execution, String object) throws BusinessException {
		LOGGER.info("## -- EMSService : setInput  -- Begin");
		try {
			
			System.out.println(execution.getProcessDefinitionId());
			System.out.println(execution.getProcessInstanceId());
			OsiNotifications notification = (OsiNotifications) execution.getVariable(object);
			if(notification != null) {
				//OsiNotifications notification = notificationsRepo.findOne(notificationId);
				
				notification.setNotificationActionDate(this.getCurrentDateinUTC());
				notification.setNotificationAction("OK");
				notification.setNotificationStatus("COMPLETED");
				if(object.equalsIgnoreCase("Get DL List From HR"))
					notification.setDlList((String) execution.getVariable("dlList"));
				else if(object.equalsIgnoreCase("Mail Stop from Admin"))
					notification.setComments((String) execution.getVariable("mailStop"));
				
				notification = notificationsRepo.save(notification);
				//System.out.println(notification);
				execution.removeVariable("notificationId");
			}
		} catch(Exception e) {	
			throw new BusinessException("ERR_1016", e.getMessage());
		}
	}
	
	@Transactional
	@Override
	public void updateTerminationNotifications(ActivityExecution execution, OsiNotifications notification) throws BusinessException {
		LOGGER.info("## -- EMSService : setInput  -- Begin");
		try {
			Integer notificationId = (Integer) execution.getVariable("notificationId");
			if(notificationId != null) {
				//OsiNotifications notification = notificationsRepo.findOne(notificationId);
				OsiNotifications notifications = notificationsRepo.findByNotificationId(notification.getNotificationId());
				notifications.setNotificationActionDate(this.getCurrentDateinUTC());
				notifications.setNotificationAction("ok");
				notifications.setNotificationStatus("COMPLETED");
				
				notification = notificationsRepo.save(notifications);
				System.out.println(notification);
				execution.removeVariable("notificationId");
			}
		} catch(Exception e) {
			throw new BusinessException("ERR_1016", e.getMessage());
		}
	}
	
	@Transactional
	@Override
	public void closeNotifications(ActivityExecution execution, String type) throws BusinessException {
		LOGGER.info("## -- EMSService : closeNotifications  -- Begin");
		try {
			//Integer notificationId = (Integer) execution.getVariable("notificationId");
			OsiNotifications notification = (OsiNotifications) execution.getVariable(type);
			//Integer notificationId = notification.getNotificationId();
			//OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			
			String rmNotifyCode = env.getProperty("ems.probation.notify.rm");
			String buNotifyCode = env.getProperty("ems.probation.notify.bu");
			String hrNotifyCode = env.getProperty("ems.probation.notify.hr");
			String actionVar = null; 
			String comments = null;
			Integer extendedValue = null;
			if(type.equalsIgnoreCase(rmNotifyCode)) {
				actionVar = (String) execution.getVariable("probationAction");
				comments = (String) execution.getVariable("probationReason");
			} else if(type.equalsIgnoreCase(buNotifyCode)) {
				actionVar = (String) execution.getVariable("probationActionBu");
				comments = (String) execution.getVariable("probationReasonBu");
			} else if(type.equalsIgnoreCase(hrNotifyCode)) {
				actionVar = (String) execution.getVariable("probationActionHr");
				comments = (String) execution.getVariable("probationReasonHr");
			} 
			//if(notification != null && employee != null && actionVar != null) {
				//OsiNotifications notification = notificationsRepo.findOne(notificationId);
				if(actionVar.equalsIgnoreCase("extend")) {
					if(type.equalsIgnoreCase(rmNotifyCode)) {
						extendedValue = (Integer) execution.getVariable("extendedValue");
					} else if(type.equalsIgnoreCase(buNotifyCode)) {
						extendedValue = (Integer) execution.getVariable("extendedValueBu");
					} else if(type.equalsIgnoreCase(hrNotifyCode)) {
						extendedValue = (Integer) execution.getVariable("extendedValueHr");
					}
				}
				notification.setDlList(extendedValue+"");	
				notification.setNotificationActionDate(this.getCurrentDateinUTC());
				notification.setNotificationAction(actionVar);
				notification.setNotificationStatus("COMPLETED");
				notification.setComments(comments);
				
				notification = notificationsRepo.save(notification);
				System.out.println(notification);
				execution.removeVariable("notificationId");
			//}
		} catch(Exception e) {	
			throw new BusinessException("ERR_1016", e.getMessage());
		}
	}
	
	@Override
	public String getCurrentDateStringinUTC() {
		SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
	    dateFormatGmt.setTimeZone(TimeZone.getTimeZone("UTC"));	   	    
	    return dateFormatGmt.format(new Date());
	}
	
	@Override
	public Date getCurrentDateinUTC() throws BusinessException {
		Date UTCdate = null;
		 try {
			 SimpleDateFormat dateFormatIst = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			 dateFormatIst.setTimeZone(TimeZone.getTimeZone("UTC"));	   	    
			 SimpleDateFormat dateFormatUtc = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
			 UTCdate = dateFormatUtc.parse(dateFormatIst.format(new Date()));
		} catch (ParseException e) {
			throw new BusinessException("ERR_1010", "Unparsable Date");
		}
		 return UTCdate;
	}
	
	/*@Transactional
	@Override
	public void rollBackWfRecordFlag(ActivityExecution execution) throws BpmnError {
		OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
		if(!wfRecord.equals(null)) {
			//execution.setVariable("employee", employee);
			String processFlag = env.getProperty("ems.wf.activities.flag.initial.process");
			if(!processFlag.isEmpty()) {
				wfRecord.setProcessFlag(processFlag);
				wfsActivitiesRepo.save(wfRecord);
			} else {
				throw new BpmnError("ERR_1002", "No property found : ems.wf.activities.flag.after.process");
			}
		}
	}*/
	
	@Override
	public OsiEmployees getBuHeadInfo(Integer employeeId, String headType) throws BusinessException {
		LOGGER.info(" ## getBuHeadInfo : Begin");
		OsiEmployees buHeads = null;
		try {
			List<OsiEmployees> headsList = employeeRepo.getHeadInfo(employeeId, headType);
			if(!headsList.isEmpty() ) {
				String buHeadNames = headsList.stream().map(emp -> emp.getFullName()).collect(Collectors.joining("/"));
				String buHeadMails = headsList.stream().map(emp -> emp.getOfficeEmail().toLowerCase()).collect(Collectors.joining(","));
				
				buHeads = new OsiEmployees();
				buHeads.setFullName(buHeadNames);
				buHeads.setOfficeEmail(buHeadMails);
				
				LOGGER.info(buHeadMails);
				LOGGER.info(buHeadNames);
			}
		} catch(DataAccessException e) {
			LOGGER.error(" Error Occured while Geting the Bu Head Info");
			throw new BusinessException(e.getErrorCode(), e.getSystemMessage());
		} catch(Exception e) {
			LOGGER.error(" Error Occured while Geting the Bu Head Info");
			throw new BusinessException("ERR_1021", "Error Occured while getting the Bu Head information");
		}
		LOGGER.info(" ## getBuHeadInfo : End");
		return buHeads;
	}
	
	@Override
	public void updateProbationNotifications(Integer notificationId, String comments) throws BusinessException {
		try {
			OsiNotifications notification = notificationsRepo.findOne(notificationId);
			notification.setComments(comments);
			notification.setNotificationActionDate(getCurrentDateinUTC());
			notification.setNotificationAction("SKIPPED");
			notification.setNotificationStatus("COMPLETED");
			
			notificationsRepo.save(notification);
		} catch(IllegalArgumentException ie) {
			LOGGER.error("Invalid NotificationId");
			throw new BusinessException("ERR_1022", "NotificationId is NULL");
		} catch(Exception e) {
			LOGGER.error(" Error Occured while Geting the Bu Head Info");
			throw new BusinessException("ERR_1021", "Error Occured while getting the Bu Head information");
		}
	}
}
