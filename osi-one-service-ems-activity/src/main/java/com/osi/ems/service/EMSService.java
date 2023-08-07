package com.osi.ems.service;

import java.util.Date;

import org.activiti.engine.impl.pvm.delegate.ActivityExecution;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.domain.OsiNotifications;

//@Component("emsService")
public interface EMSService {
	
	OsiNotifications saveNotifications(ActivityExecution execution, OsiEmployees employee, String object) throws BusinessException ;
	void updateNotifications(ActivityExecution execution, String object) throws BusinessException ;
	void updateTerminationNotifications(ActivityExecution execution, OsiNotifications notification) throws BusinessException ;
	void closeNotifications(ActivityExecution execution, String type) throws BusinessException ;	
	//void rollBackWfRecordFlag(ActivityExecution execution) throws BpmnError ;
	Date getCurrentDateinUTC() throws BusinessException;
	String getCurrentDateStringinUTC();
	
	OsiEmployees getBuHeadInfo(Integer employeeId, String headType) throws BusinessException;
	void updateProbationNotifications(Integer notificationId, String comments) throws BusinessException;
}
