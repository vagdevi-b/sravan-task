package com.osi.ems.service;

import com.osi.activiti.exception.BusinessException;

public interface IHistoryCleanupService {

	public void cleanupHistory() throws BusinessException;
}
