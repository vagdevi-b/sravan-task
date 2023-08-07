package com.osi.ems.repository.custom;

import java.sql.Timestamp;
import java.util.List;
import java.util.Map;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiAssignments;
import com.osi.ems.domain.OsiEmployees;

public interface OsiEmployeesRepositoryCustom {
		
	OsiEmployees getEmployee(int employeeId) throws DataAccessException;

	void saveOfficeInfoFormIT(OsiEmployees employee) throws DataAccessException;
	
	Map<String, String> getModifiedFields(int employeeId) throws DataAccessException;
	
	List<OsiEmployees> getEmployeesNotUpdatedSkills() throws DataAccessException;
	
	List<OsiEmployees> getOnProbationEmployees() throws DataAccessException;
	
	Integer updateProbation(int emlployeeId, String probationAction, Integer extendedValue, String probationReason) throws DataAccessException;

	OsiAssignments findEmployeeByIdAndDate(Integer empId, String searchDate) throws DataAccessException;

	Integer updateAssignments(Integer employeeId, String effectiveEndDate) throws DataAccessException;

	String convertTimestampToString(Timestamp timestamp) throws DataAccessException;

	Integer getMaxAssignmentId() throws DataAccessException;

	Integer TerminateEmployee(Integer employeeId) throws DataAccessException;

	Integer saveEmployeeInfo(OsiEmployees osiEmployees) throws DataAccessException;

	OsiEmployees getEmployees(int employeeId) throws DataAccessException;

	Integer updateEmployee(Integer employeeId, String effectiveEndDate) throws DataAccessException;
	
	List<OsiEmployees> getHeadInfo(int employeeId, String headType) throws DataAccessException;

	Map<String, Boolean> checkUsernameOrOfficeEmailExist(String officeEmail, String userName) throws DataAccessException;

	String getTerminationDate(int employeeId) throws DataAccessException;

	OsiAssignments findAssignmentByEmployeeId(Integer empId) throws DataAccessException;
	
}

