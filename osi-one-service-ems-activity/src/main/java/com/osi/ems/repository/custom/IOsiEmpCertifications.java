package com.osi.ems.repository.custom;

import java.util.List;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmpCertifications;

public interface IOsiEmpCertifications {
	
	List<OsiEmpCertifications> getUnverifiedCertifications(Integer employeeId) throws DataAccessException ;
	
}
