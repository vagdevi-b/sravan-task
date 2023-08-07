package com.osi.ems.service;

import java.util.List;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmpCertifications;

public interface ICertificationsService {
	
	List<OsiEmpCertifications> getUnverifiedCertifications(Integer employeeId) throws BusinessException;
}
