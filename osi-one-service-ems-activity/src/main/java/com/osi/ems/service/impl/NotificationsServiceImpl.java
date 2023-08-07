package com.osi.ems.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiNotifications;
import com.osi.ems.repository.IOsiNotificationsRepository;
import com.osi.ems.service.NotificationsService;

@Service("notificationsService")
public class NotificationsServiceImpl implements NotificationsService {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private IOsiNotificationsRepository notificationsRepo;

	@Override
	public OsiNotifications findByNotificationId(int notificationId) throws BusinessException {
		LOGGER.info("## -- findByNotificationId: Begin");
		OsiNotifications notification = null;
		try {
			notification = notificationsRepo.findByNotificationId(notificationId);
		} catch(Exception e) {
			LOGGER.info("Error Occured while executing the findByNotificationId : "+e.getMessage());
			throw new BusinessException("ERR_1009", "Error Occurred while executing the Notifications");
		}
		LOGGER.info("## -- findByNotificationId: End");
		return notification;
	}

	@Override
	public OsiNotifications findByNotificationEmpIdAndNotificationObjectAndNotificationStatus(Integer employeeId,
			String objectName, String status) throws BusinessException {
		LOGGER.info("## -- findByNotificationEmpIdAndNotificationObjectAndNotificationStatus: Begin");
		OsiNotifications notification = null;
		try {
			notification = notificationsRepo.findByNotificationEmpIdAndNotificationObjectAndNotificationStatus(employeeId, objectName, status);
		} catch(Exception e) {
			LOGGER.info("Error Occured while executing the findByNotificationEmpIdAndNotificationObjectAndNotificationStatus : "+e.getMessage());
			throw new BusinessException("ERR_1009", "Error Occurred while executing the Notifications");
		}
		LOGGER.info("## -- findByNotificationEmpIdAndNotificationObjectAndNotificationStatus: End");
		return notification;
	}

	@Override
	public OsiNotifications saveNotification(OsiNotifications notificationEntity) throws BusinessException {
		LOGGER.info("## -- saveNotification: Begin");
		OsiNotifications notification = null;
		try {
			notification = notificationsRepo.save(notificationEntity);
		} catch(Exception e) {
			LOGGER.info("Error Occured while executing the saveNotification : "+e.getMessage());
			throw new BusinessException("ERR_1009", "Error Occurred while saving the Notifications");
		}
		LOGGER.info("## -- saveNotification: End");
		return notification;
	}

}
