package com.osi.ems.service.impl;

import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;
import com.osi.ems.service.EmployeeService;

@Service("employeeService")
public class EmployeeServiceImpl implements EmployeeService {
	
	private Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private OsiEmployeesRepositoryCustom empRepo;

	@Override
	public Map<String, String> getModifiedFields(int employeeId) throws BusinessException {
		LOGGER.info(" ## getModifiedFields : Begin");
		Map<String, String> modifiedObject = null;
		try {
			modifiedObject = empRepo.getModifiedFields(employeeId);
		} catch(DataAccessException e) {
			LOGGER.info("Error Occured while executing the getModificationsFields from DB" +e.getMessage());
			throw new BusinessException(e.getErrorCode(), e.getSystemMessage());
		}
		LOGGER.info(" ## getModifiedFields : End");
		return modifiedObject;
	}

	@Override
	public Map<String, Boolean> checkUsernameOrOfficeEmailExist(String officeEmail, String userName)
			throws BusinessException {
		LOGGER.info(" ## checkUsernameOrOfficeEmailExist : Begin");
		Map<String, Boolean> existMap = null;
		try {
			existMap = empRepo.checkUsernameOrOfficeEmailExist(officeEmail, userName);
		} catch(DataAccessException e) {
			LOGGER.info("Error Occured while executing the getModificationsFields from DB" +e.getMessage());
			throw new BusinessException(e.getErrorCode(), e.getSystemMessage());
		}
		LOGGER.info(" ## checkUsernameOrOfficeEmailExist : End");
		return existMap;
	}
	
	@Override
	public OsiEmployees getEmployee(int employeeId) throws BusinessException {
		LOGGER.info(" ## getEmployee : Begin");
		OsiEmployees employee = null;
		try {
			employee = empRepo.getEmployee(employeeId);
		} catch(DataAccessException e) {
			LOGGER.info("Exception while executing the Fetch Employee Info" +e.getSystemMessage());
			throw new BusinessException(e.getErrorCode(), e.getSystemMessage());
		}
		LOGGER.info(" ## getEmployee : End");
		return employee;
	}
	
	@Override
	public String getTerminationDate(int employeeId) throws BusinessException {
		LOGGER.info(" ## getTerminationDate : Begin");
		String terminationDate = null;
		try {
			terminationDate = empRepo.getTerminationDate(employeeId);
		} catch(DataAccessException e) {
			LOGGER.info("Exception while getting the Employee Termination Date Info" +e.getSystemMessage());
			throw new BusinessException(e.getErrorCode(), e.getSystemMessage());
		}
		LOGGER.info(" ## getTerminationDate : End");
		return terminationDate;
	}

}
