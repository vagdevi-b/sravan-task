package com.osi.ems.service;

import java.util.List;

import org.activiti.engine.impl.pvm.delegate.ActivityExecution;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiWFActivities;

public interface WfActivitiesService {

	OsiWFActivities findById(Integer wfActivitiId) throws BusinessException;
	void saveWfRecord(OsiWFActivities wfActivity) throws BusinessException;
	void rollBackWfRecordFlag(ActivityExecution execution) throws BusinessException;
	
	List<OsiWFActivities> findByProcessFlagAndObjectName(String processFlag, String objectName) throws BusinessException;
}
