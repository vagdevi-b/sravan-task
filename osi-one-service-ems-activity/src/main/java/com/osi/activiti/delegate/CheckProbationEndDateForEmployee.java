package com.osi.activiti.delegate;

import java.util.List;

import org.activiti.engine.RuntimeService;
import org.activiti.engine.delegate.BpmnError;
import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.joda.time.Days;
import org.joda.time.LocalDate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiNotifications;
import com.osi.ems.repository.IOsiNotificationsRepository;
import com.osi.ems.service.EMSService;

@Service("chkProbDate")
public class CheckProbationEndDateForEmployee {
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Environment env;
	
	@Autowired
	private IOsiNotificationsRepository notificationsRepo;
	
	@Autowired
	private EMSService emsService;
	
	@Autowired
	private RuntimeService runtimeService;
	
	public String onExecute(ActivityExecution execution) throws BpmnError {
		String probCheckResult = "NOTREACHED";
		OsiEmployees buInfo;
		LocalDate today = LocalDate.now();
		try {
			
			OsiEmployees employee = (OsiEmployees) execution.getVariable("employee");
			if(employee.equals(null)) {
				LOGGER.info("Employee object is null");
				throw new BusinessException("ERR_1003", "Employee Details Not Found in execution");
			} else {
				List<OsiNotifications> existNotifications = notificationsRepo.findByNotificationEmpIdAndNotificationStatusAndNotificationObjectEndingWithIgnoreCase(employee.getEmployeeId(), "PROCESS", " For Probation End");
				List<OsiNotifications> existingNotifications = existNotifications;
				if(existNotifications.isEmpty()) {
					LocalDate probEndDate = LocalDate.parse(employee.getProbEndDate());
					
					int gapPeriodInDays = Days.daysBetween(today, probEndDate).getDays();
					LOGGER.info("Probtion Period Gap(In Days): "+gapPeriodInDays);
					int firstGapPeriod = Integer.parseInt(env.getProperty("ems.probation.initial.reminder.gap.period"));
					//int secondGapPeriod = Integer.parseInt(env.getProperty("ems.probation.subsequent.reminder.gap.period"));
					/*if(gapPeriodInDays == 0) {
						probCheckResult = "REACHED";
					} else */if(gapPeriodInDays == firstGapPeriod){
						//probCheckResult = "REMAINDER";
						probCheckResult = "REACHED";
					} 
				} else {
					String rmNotifyCode = env.getProperty("ems.probation.notify.rm");
					OsiNotifications rmWaitingNotification = existNotifications.stream().filter(e -> e.getNotificationObject().equalsIgnoreCase(rmNotifyCode)).findFirst().orElse(null);
					if(rmWaitingNotification!= null) {
						LocalDate currentNotificationDate = (rmWaitingNotification.getNotificationDate() != null ? new LocalDate(rmWaitingNotification.getNotificationDate()) : null);
						int reminderGapDays = Days.daysBetween(currentNotificationDate, today).getDays();
						LOGGER.info("Probtion Period Gap(In Days): "+reminderGapDays);
						int secondGapPeriod = Integer.parseInt(env.getProperty("ems.probation.subsequent.reminder.gap.period"));
						if(reminderGapDays == secondGapPeriod) {
							probCheckResult = "REACHED";
							
							runtimeService.deleteProcessInstance(rmWaitingNotification.getNotificationObjectId(), "Deleted by Probation flow");
						} else if(reminderGapDays == secondGapPeriod * rmWaitingNotification.getNoOfTimesAsOfNow()) {
							probCheckResult = "SECONDLEVEL";
							String buName = env.getProperty("ems.probation.bu.head");
							if(!buName.isEmpty()) {
								if(employee.getSupervisorId() != null) {
									buInfo = emsService.getBuHeadInfo(employee.getSupervisorId(), buName);
									execution.setVariable("buInfo", buInfo);
									execution.setVariable("skipComments", "First Level (RM) Approval Skipped");
									execution.setVariable("probationAction", "SKIPPED By the System");
									execution.setVariable("probationReason", "Supervisor is Not Responded in time");
									execution.setVariable("extendedValue", "NA");
									emsService.updateProbationNotifications(rmWaitingNotification.getNotificationId(), "Skipped by the System");
									
									runtimeService.deleteProcessInstance(rmWaitingNotification.getNotificationObjectId(), "Deleted by Probation flow");
								} else {
									throw new BusinessException("ERR_1003", "Employee SupervisorId is Null for: "+employee.getEmployeeId());
								}
							}  else {
								throw new BusinessException("ERR_1002", "Invalid ems.probation.bu.head Property value");
							}
						}
					} else {
						String buNotifyCode = env.getProperty("ems.probation.notify.bu");
						OsiNotifications buWaitingNotification = existingNotifications.stream().filter(ef -> ef.getNotificationObject().equalsIgnoreCase(buNotifyCode)).findFirst().orElse(null);
						if(buWaitingNotification != null) {
							LocalDate currentNotificationDate = (buWaitingNotification.getNotificationDate() != null ? new LocalDate(buWaitingNotification.getNotificationDate()) : null);
							int reminderGapDays = Days.daysBetween(currentNotificationDate, today).getDays();
							LOGGER.info("Probtion Period Gap(In Days): "+reminderGapDays);
							int secondGapPeriod = Integer.parseInt(env.getProperty("ems.probation.subsequent.reminder.gap.period"));
							if(reminderGapDays == secondGapPeriod) {
								probCheckResult = "THIRDLEVEL";
								
								String buName = env.getProperty("ems.probation.bu.head");
								if(!buName.isEmpty()) {
									if(employee.getSupervisorId() != null) {
										buInfo = emsService.getBuHeadInfo(employee.getSupervisorId(), buName);
										execution.setVariable("buInfo", buInfo);
										List<OsiNotifications> rmCompletedNotifications = notificationsRepo.findByNotificationEmpIdAndNotificationStatusAndNotificationObjectEndingWithIgnoreCase(employee.getEmployeeId(), "COMPLETED", " RM For Probation End");
										LocalDate probEndDate = LocalDate.parse(employee.getProbEndDate());
										for(OsiNotifications n : rmCompletedNotifications) {
											int days = Days.daysBetween(new LocalDate(n.getNotificationDate()), probEndDate).getDays();
											if( days > 0 && days <= 15) {
												execution.setVariable("probationAction", n.getNotificationAction());
												execution.setVariable("probationReason", n.getComments());
												execution.setVariable("extendedValue", n.getDlList());
											}
										};
										execution.setVariable("skipComments", "Second Level (BU) Approval Skipped");
										
										execution.setVariable("probationActionBu", "SKIPPED By the System");
										execution.setVariable("probationReasonBu", "Next level Supervisor is Not Responded in time");
										execution.setVariable("extendedValueBu", "NA");
										
										emsService.updateProbationNotifications(buWaitingNotification.getNotificationId(), "Skipped by the System");
										
										runtimeService.deleteProcessInstance(buWaitingNotification.getNotificationObjectId(), "Deleted by Probation flow");
									} else {
										throw new BusinessException("ERR_1003", "Employee SupervisorId is Null for: "+employee.getEmployeeId());
									}
								}  else {
									throw new BusinessException("ERR_1002", "Invalid ems.probation.bu.head Property value");
								}
							}
						}
					}
				}
				/*else {
					LOGGER.info("**********************    Already Processing");
				}*/
			}
		} catch(NumberFormatException e) {
			LOGGER.info("Invalid Gap Period in Resource.properties");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			throw new BpmnError("ERR_1023", "Invalid Gap Period in Resource.properties");
		} catch(BusinessException e) {
			LOGGER.info("Error Occured while executing the Get Config mails from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getSystemMessage());
			throw new BpmnError(e.getErrorCode(), e.getSystemMessage());
		} catch(Exception e) {
			LOGGER.info("Error Occured while executing the Get Config mails from DB");
			execution.setVariable("processDefId", execution.getProcessDefinitionId());
			execution.setVariable("processInsId", execution.getCurrentActivityName());
			execution.setVariable("error", e.getMessage() + " -- "+e.getLocalizedMessage());
			throw new BpmnError("ERR_1019", "Error Occured while executing the Get Config mails from DB");
		}
		return probCheckResult;
	}
}
