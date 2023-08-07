package com.osi.ems.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Repository;

import com.osi.ems.domain.OsiNotifications;

@Component("notificationsRepo")
@Repository
public interface IOsiNotificationsRepository extends CrudRepository<OsiNotifications, Integer>{
	
	OsiNotifications findByNotificationId(int id);
	//List<OsiNotifications> findByProcessFlagAndObjectName(String flag, String wfType);
	OsiNotifications findByNotificationEmpIdAndNotificationObjectAndNotificationStatus(Integer employeeId, String objectName, String status);
	
	List<OsiNotifications> findByNotificationEmpIdAndNotificationStatusAndNotificationObjectEndingWithIgnoreCase(Integer employeeId, String status, String objectName);
}
