package com.osi.ems.service;

import java.util.Map;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiEmployees;

public interface EmployeeService {
	
	Map<String, String> getModifiedFields(int employeeId) throws BusinessException;
	
	Map<String, Boolean> checkUsernameOrOfficeEmailExist(String officeEmail, String userName) throws BusinessException;

	OsiEmployees getEmployee(int employeeId) throws BusinessException;
	
	String getTerminationDate(int employeeId) throws BusinessException;
}
