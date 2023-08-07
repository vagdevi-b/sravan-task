package com.osi.activiti.config;
/**
 * 
 * @author smanchala
 *
 */
public final class ActivitiUtil {
	
	//Common Reaminder Process for All incomplete info employees
	public static final String PROCESS_COMMON_REMAINDER_TO_EMPLOYEES = "RemainderToEmployeesForIncompleteInfo";
	//Service Task
	public static final String FETCH_INCOMPLETE_EMPLOYEES_LIST = "fetchIncompleteInfoEmployees";
	public static final String MAIL_PREPARATION_SERVICE = "mailPreparationService";
	
	//Process Properties
	public static final String PROCESS_ONE = "processOne";
	public static final String PROCESS_PERSONAL_INFO_REMAINDER = "RemainderToIncompletePersonalInfoEmployees";
	public static final String PROCESS_MEDICAL_INFO_REMAINDER = "RemainderToIncompleteMedicalInfoEmployees";
	public static final String PROCESS_EMERGENCY_INFO_REMAINDER = "RemainderToIncompleteEmergencyInfoEmployees";
	public static final String PROCESS_PASSPORT_INFO_REMAINDER = "RemainderToIncompletePassportInfoEmployees";
	public static final String PROCESS_SKILLS_INFO_REMAINDER = "RemainderToIncompleteSkillsInfoEmployees";
	public static final String PROCESS_CERTIFICATIONS_INFO_REMAINDER = "RemainderToIncompleteCertificationsInfoEmployees";
	
	public static final String INPUT_MAIL_TASK = "inputMailTask";
	
	// service task Bean properties
	public static final String GREETINGS_BEAN = "greetingsJava";
	public static final String INCOMPLETE_PERSONAL_INFO_REMAINDER = "personalInfoRemainder";
	public static final String INCOMPLETE_MEDICAL_INFO_REMAINDER = "medicalInfoRemainder";
	public static final String INCOMPLETE_EMERGENCY_INFO_REMAINDER = "emergnecyInfoRemainder";
	public static final String INCOMPLETE_PASSPORT_INFO_REMAINDER = "passportInfoRemainder";
	public static final String INCOMPLETE_SKILLS_INFO_REMAINDER = "skillsInfoRemainder";
	public static final String INCOMPLETE_CERTIFICATIONS_INFO_REMAINDER = "certificationsInfoRemainder";
	
	// HR
	public static final String PROCESS_FOR_UNVERIFIED_RECORDS_TO_HR = "RemainderToHRForUnverifiedEmployees";
	public static final String UNVERIFIED_RECORDS_REMAINDER_TO_HR = "unverifiedRecordsRemainder";
	
	public static final String PREPARE_MAIL_TO_HR = "prepareMailToHR";
	public static final String VERIFY_MAIL_INPUTS = "varifyMailInput";
	
	
	// Actual
	public static final String NEW_EMPLOYEE_CREATION_FETCH = "NewEmployeeCreationFetchList";
	public static final String NEW_EMPLOYEE_CREATION_PROCESS = "EmployeeCreationProcess_One";
}
