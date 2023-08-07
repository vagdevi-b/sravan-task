package com.osi.ems.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmpCertifications;
import com.osi.ems.repository.custom.impl.OsiEmpCertificationsRepoImpl;
import com.osi.ems.service.ICertificationsService;

@Service("certificationsService")
public class CertificationsServiceImpl implements ICertificationsService {
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OsiEmpCertificationsRepoImpl empCertificationsRepo;
	
	@Override
	public List<OsiEmpCertifications> getUnverifiedCertifications(Integer employeeId) throws BusinessException {
		LOGGER.info("## -- getUnverifiedCertifications: Begin");
		List<OsiEmpCertifications> unverifiedCerts = new ArrayList<>();
		try {
			unverifiedCerts = empCertificationsRepo.getUnverifiedCertifications(employeeId);
		} catch (DataAccessException e) {
			LOGGER.info("Error Occured while getting the Unverified Certificates Delegate from DB: "+ e.getSystemMessage());
			throw new BusinessException(e.getErrorCode(), e.getSystemMessage());
		}
		LOGGER.info("## -- getUnverifiedCertifications: Begin");
		return unverifiedCerts;
	}

}
