package com.osi.ems.service;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiNotifications;

public interface NotificationsService {
	
	OsiNotifications findByNotificationId(int notificationId) throws BusinessException;
	OsiNotifications findByNotificationEmpIdAndNotificationObjectAndNotificationStatus(Integer employeeId, String objectName, String status) throws BusinessException;
	OsiNotifications saveNotification(OsiNotifications notificationEntity) throws BusinessException;
}
