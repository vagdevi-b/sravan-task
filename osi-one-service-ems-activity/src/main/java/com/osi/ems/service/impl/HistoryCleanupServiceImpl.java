package com.osi.ems.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.repository.custom.IActivitiHistoryCleanup;
import com.osi.ems.service.IHistoryCleanupService;

@Service
public class HistoryCleanupServiceImpl implements IHistoryCleanupService {
	
	Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	IActivitiHistoryCleanup histCleanRepo;
	
	@Override
	public void cleanupHistory() throws BusinessException {
		LOGGER.info(" ## HistoryCleanupServiceImpl : Begin ");
		try {
			histCleanRepo.cleanupHistory();
		} catch(DataAccessException e) {
			throw new BusinessException(e.getErrorCode(), e.getSystemMessage());
		}
		LOGGER.info(" ## HistoryCleanupServiceImpl : End ");
	}

}
