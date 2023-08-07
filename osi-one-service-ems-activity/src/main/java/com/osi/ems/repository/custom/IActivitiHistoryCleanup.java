package com.osi.ems.repository.custom;

import com.osi.activiti.exception.DataAccessException;

public interface IActivitiHistoryCleanup {

	void cleanupHistory() throws DataAccessException;
}
