package com.osi.ems.repository.custom;

import java.util.List;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmpSkills;

public interface IOsiEmpSkills {
	
	List<OsiEmpSkills> getUnverifiedSkills(Integer employeeId) throws DataAccessException ;
	
}
