package com.osi.activiti.service;

import javax.transaction.Transactional;

import org.activiti.engine.RuntimeService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.config.ActivitiUtil;

@Service
public class ProcessStartService {
	private final Logger LOGGER = LoggerFactory.getLogger(ProcessStartService.class);
	
	
	@Autowired
	private RuntimeService runtimeService;
	
	@Transactional
	public void startProcess() throws Exception {		
		LOGGER.info("###### :startProcess");
		runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_ONE);
	}
	
	@Transactional
	public void startRemainderProcess(String type) throws Exception {		
		LOGGER.info("###### :startProcess");
		if(type.equalsIgnoreCase("personal"))
			runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_PERSONAL_INFO_REMAINDER);
		else if(type.equalsIgnoreCase("medical"))
			runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_MEDICAL_INFO_REMAINDER);
		else if(type.equalsIgnoreCase("emergency"))
			runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_EMERGENCY_INFO_REMAINDER);
		else if(type.equalsIgnoreCase("passport"))
			runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_PASSPORT_INFO_REMAINDER);
		else if(type.equalsIgnoreCase("skills"))
			runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_SKILLS_INFO_REMAINDER);
		else if(type.equalsIgnoreCase("certifications"))
			runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_CERTIFICATIONS_INFO_REMAINDER);
		else if(type.equalsIgnoreCase("unverifiedRecords"))
			runtimeService.startProcessInstanceByKey(ActivitiUtil.PROCESS_FOR_UNVERIFIED_RECORDS_TO_HR);
	}
}