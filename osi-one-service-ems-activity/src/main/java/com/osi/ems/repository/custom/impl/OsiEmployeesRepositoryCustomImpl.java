package com.osi.ems.repository.custom.impl;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.TimeZone;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import com.osi.activiti.exception.BusinessException;
import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiAssignments;
import com.osi.ems.domain.OsiEmployees;
import com.osi.ems.repository.custom.OsiEmployeesRepositoryCustom;

@Repository("empRepo")
public class OsiEmployeesRepositoryCustomImpl implements OsiEmployeesRepositoryCustom {
	
		private final Logger LOGGER = LoggerFactory.getLogger(getClass());
		
		@PersistenceContext
		private EntityManager entityManager;
		
		@Autowired
		private Environment env;
		
		@Value("DEFAULT_END_DATE")
		private String defaultEndDate;
		
		public List<OsiEmployees> getAllEmployees() {
			return null;
		}
		
		@Override
		public OsiEmployees getEmployee(int employeeId) throws DataAccessException {
			OsiEmployees employee = null;
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getWFEmpList  -- Begin");
			try {
					String query = "select e.employee_id,e.employee_number,e.first_name,e.last_name, e.start_date, e.title, e.employee_type, e.office_email,"
							+ " e.system_type, e.mail_stop, l.location_name, "
							//+ "d.DEPT_SHORT_NAME as dept, "
							+ " concat(if(d.SEGMENT1 is null, '', concat(d.SEGMENT1, '.')), if(d.SEGMENT2 is null, '', concat(d.SEGMENT2, '.')), if(d.SEGMENT3 is null, '', concat(d.SEGMENT3, '.')), if(d.SEGMENT4 is null, '', concat(d.SEGMENT4, '.')), if(d.SEGMENT5 is null, '', concat(d.SEGMENT5, '.')), if(d.SEGMENT6 is null, '', concat(d.SEGMENT6, '.')),  if(d.SEGMENT7 is null, '', concat(d.SEGMENT7, '.')),if(d.SEGMENT8 is null, '', concat(d.SEGMENT8, '.')), if(d.SEGMENT9 is null, '', concat(d.SEGMENT9, '.')),if(d.SEGMENT10 is null, '', concat(d.SEGMENT10, '.'))) as dept, "
							+ " a.supervisor_id, e1.full_name as supervisor_name, e1.office_email as supervisor_mail,"
							+ " concat(COALESCE(c.country_calling_code,''),c.contact_number) as contact_number, g.grade_name, e.org_id, e.full_name, e.user_name "
							+ " ,j.job_code_name, e.middle_name, o.ORG_NAME"
							+ " from osi_employees e"
							+ " left join osi_assignments a on a.employee_id = e.employee_id and sysdate() between a.effective_start_date and a.effective_end_date" 
							+ " left join osi_locations l on l.location_id = a.location_id " 
							//+" left join osi_department d on d.DEPT_ID = a.dept_id"
							+ " left join osi_departments d on d.dept_id = a.dept_id " 
							+ " left join osi_employees e1 on e1.employee_id = a.supervisor_id and sysdate() between e1.effective_start_date and e1.effective_end_date"
							+ " left join osi_contacts c on c.employee_id = e.employee_id and c.contact_type = 'personal'"
							+ " left join osi_grades g on g.grade_id = a.grade_id "
							+ " left join osi_job_codes j on j.job_code_id = a.job_id and j.org_id = e.org_id"
							+ " left join osi_organizations o on o.ORG_ID = e.org_id"
							+ " where"
							+ " e.employee_id = "+ employeeId +" and" 
							+ " sysdate() between e.effective_start_date and e.effective_end_date";
					Object[] object = (Object[]) this.entityManager.createNativeQuery(query).getSingleResult();
					employee = new OsiEmployees();
					employee.setEmployeeId(object[0]!= null ? Integer.parseInt(object[0].toString()) : null);
					employee.setEmployeeNumber(object[1]!= null ? object[1].toString() : null);
					employee.setFirstName(object[2]!= null ? object[2].toString() : null);
					employee.setLastName(object[3]!= null ? object[3].toString() : null);
					employee.setStartDate(object[4]!= null ? object[4].toString() : null);
					employee.setTitle(object[5]!= null ? object[5].toString() : null);
					employee.setEmployeeType(object[6]!= null ? object[6].toString() : null);
					employee.setOfficeEmail(object[7]!= null ? object[7].toString().toLowerCase() : null);
					employee.setSystemType(object[8]!= null ? object[8].toString() : null);
					employee.setMailStop(object[9]!= null ? object[9].toString() : null);
					employee.setLocationName(object[10]!= null ? object[10].toString() : null);
					employee.setDepartmentName(object[11]!= null ? object[11].toString() : null);
					employee.setSupervisorId(object[12]!= null ? Integer.parseInt(object[12].toString()) : null);
					employee.setSupervisorName(object[13]!= null ? object[13].toString() : null);
					employee.setSupervisorMail(object[14]!= null ? object[14].toString().toLowerCase() : null);
					employee.setContactNumber(object[15]!= null ? object[15].toString() : "");
					employee.setGrade(object[16]!= null ? object[16].toString() : "");
					employee.setOrgId(object[17]!= null ? Integer.parseInt(object[17].toString()) : null);
					employee.setFullName(object[18]!= null ? object[18].toString() : "");
					employee.setUserName(object[19]!= null ? object[19].toString() : "");
					employee.setJobName(object[20]!= null ? object[20].toString() : "");
					employee.setMiddleName(object[21]!= null ?object[21].toString() : "");
					employee.setOrgName(object[22]!= null ?object[22].toString() : "");
			} catch (NoResultException ne) {
				LOGGER.error("Exception : "+ne.getMessage());
				throw new DataAccessException("ERR_1001", "Exception occured in getting the list of employee with id: "+employeeId);
			} catch (Exception e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while executing "+e.getMessage());
			}
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getWFEmpList  -- End");
			return employee;
		}
		
		@Override
		public void saveOfficeInfoFormIT(OsiEmployees employee) throws DataAccessException {
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : saveOfficeInfoFormIT  -- Begin");
			try {
				String updateQuery = "update osi_employees set office_email = ?1, serial_number = ?2, user_name = ?3, mail_stop = ?4 where employee_id = ?5 and sysdate() between effective_start_date and effective_end_date";
				this.entityManager.createNativeQuery(updateQuery)
					.setParameter(1, employee.getOfficeEmail())
					.setParameter(2, employee.getSerialNumber())
					.setParameter(3, employee.getUserName())
					.setParameter(4, employee.getMailStop())
					.setParameter(5, employee.getEmployeeId())
					.executeUpdate();
			}  catch (Exception e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while saving IT info "+e.getMessage());
			}
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : saveOfficeInfoFormIT  -- End");
		}
		
		public void getEmpSecondMaxRecord(OsiEmployees employee) throws DataAccessException {
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : saveOfficeInfoFormIT  -- Begin");
			try {
				String updateQuery = "update osi_employees set office_email = ?1, serial_number = ?2, user_name = ?3 where employee_id = ?4 and sysdate() between effective_start_date and effective_end_date";
				this.entityManager.createNativeQuery(updateQuery)
					.setParameter(1, employee.getOfficeEmail())
					.setParameter(2, employee.getSerialNumber())
					.setParameter(3, employee.getUserName())
					.setParameter(4, employee.getEmployeeId())
					.executeUpdate();
			}  catch (Exception e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while saving IT info "+e.getMessage());
			}
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : saveOfficeInfoFormIT  -- End");
		}
	
		@Override
		public Map<String, String> getModifiedFields(int employeeId) throws DataAccessException {
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getModifiedFields  -- Begin");
			Map<String, String> modifiedObj = null;
			String modifiedFieldsQuery = "select max(supervisor) supervisor, max(grade) grade, max(job) job, max(location) location, max(dept) dept, max(mobile) mobile from (select"
					+ " case when psupervisor_id != supervisor_id then (select e.full_name from osi_employees e where e.employee_id = c.supervisor_id and current_timestamp between effective_start_date and effective_end_date) end supervisor, "
					+ " case when pgrade_id != grade_id then (select grade_name from osi_grades g where g.grade_id = c.grade_id ) end grade,"
					+ " case when pjob_id != job_id then (select j.job_code_name from osi_job_codes j where j.job_code_id = c.job_id) end job,"
					+ " case when plocation_id != location_id then (select location_name from osi_locations l where l.location_id=c.location_id) end location,"
					+ " case when pdept_id != dept_id then (select concat(if(d.SEGMENT1 is null, '', concat(d.SEGMENT1, '.')), if(d.SEGMENT2 is null, '', concat(d.SEGMENT2, '.')), if(d.SEGMENT3 is null, '', concat(d.SEGMENT3, '.')), if(d.SEGMENT4 is null, '', concat(d.SEGMENT4, '.')), if(d.SEGMENT5 is null, '', concat(d.SEGMENT5, '.')), if(d.SEGMENT6 is null, '', concat(d.SEGMENT6, '.')),  if(d.SEGMENT7 is null, '', concat(d.SEGMENT7, '.')),if(d.SEGMENT8 is null, '', concat(d.SEGMENT8, '.')), if(d.SEGMENT9 is null, '', concat(d.SEGMENT9, '.')),if(d.SEGMENT10 is null, '', concat(d.SEGMENT10, '.'))  )from osi_departments d where d.dept_id = c.dept_id) end dept, "
					+ " null mobile"
					+ " from ("
					+ " select * from (select assignment.employee_id, assignment.supervisor_id psupervisor_id, assignment.grade_id pgrade_id, assignment.job_id pjob_id, assignment.location_id plocation_id, assignment.dept_id pdept_id from osi_assignments assignment"
					+ " where assignment.employee_id = ?1 and assignment.assignment_id not in (select assignment_id from osi_assignments where employee_id = assignment.employee_id and current_timestamp between effective_start_date and effective_end_date)  order by assignment_id desc limit 1"
					+ " ) a,"
					+ " (select supervisor_id, grade_id, job_id, location_id, dept_id from osi_assignments where employee_id = ?2 and current_timestamp between effective_start_date and effective_end_date) b"
					+ " )c union SELECT null supervisor, null grade, null job, null LOCATION, null dept, concat(country_calling_code, '', contact_number) mobile FROM osi_contacts WHERE employee_id=?3 AND contact_type='personal' ) aa where (supervisor is not null or grade is not null or LOCATION is not null or dept is not null or job is not null or mobile is not null)";
			try {
				Object[] object = (Object[]) this.entityManager.createNativeQuery(modifiedFieldsQuery)
						.setParameter(1, employeeId)
						.setParameter(2, employeeId)
						.setParameter(3, employeeId)
						.getSingleResult();
				if(object != null)
					modifiedObj = new HashMap<String, String>();
				if(object[0]!= null) {
					modifiedObj.put("supervisor", object[0].toString());
				}
				if(object[1] != null) {
					modifiedObj.put("grade", object[1].toString());
				}
				if(object[2] != null) {
					modifiedObj.put("job", object[2].toString());
				}
				if(object[3] != null) {
					modifiedObj.put("location", object[3].toString());
				}
				if(object[4] != null) {
					modifiedObj.put("department", object[4].toString());
				}
				if(object[5] != null) {
					modifiedObj.put("mobile", object[5].toString());
				}
			} catch(NoResultException ne) {
				LOGGER.info("Error in getting modified fields repo impl");
				throw new DataAccessException("ERR_1010", "Error while executing the modified fields repo impl ");
			} catch(Exception e) {
				LOGGER.info("Error in getting modified fields repo impl");
				throw new DataAccessException("ERR_1010", "Error while executing the modified fields repo impl "+e.getMessage());
			}
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getModifiedFields  -- End");
			return modifiedObj;
		}
	
		@SuppressWarnings("unchecked")
		@Override
		public List<OsiEmployees> getEmployeesNotUpdatedSkills() throws DataAccessException {
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getEmployeesNotUpdatedSkills  -- Begin");
			List<OsiEmployees> empList = new ArrayList<OsiEmployees>();
			/*String query = "select s.employee_id, e.full_name employee, e.office_email "
					+ " from osi_emp_skills s"
					+ " left join osi_employees e on e.employee_id = s.employee_id and CURRENT_TIMESTAMP() between e.effective_start_date and e.effective_end_date"
					+ " where datediff(?1, s.last_update_date) > ?2";*/
			String query = "select s.employee_id, e.full_name employee, e.office_email "
					+ " from osi_emp_skills s, osi_employees e where e.employee_id = s.employee_id "
					+ " and CURRENT_TIMESTAMP() between e.effective_start_date and e.effective_end_date "
					+ " and datediff(current_timestamp, s.last_update_date) > ?1 and e.office_email is not null "
					+ " union "
					+ " select employee_id, full_name employee, office_email from osi_employees where employee_id not in ( "
					+ " select employee_id from osi_emp_skills "
					+ " ) and CURRENT_TIMESTAMP() between effective_start_date and effective_end_date and office_email is not null";
			try {
				int dueDateInMonths = Integer.parseInt(env.getProperty("ems.skill.remainder.process.due.date"));
				List<Object[]> outdatedSkills = this.entityManager.createNativeQuery(query)
													//.setParameter(1, this.getCurrentDateStringinUTC())
													.setParameter(1, dueDateInMonths * 30)
													.getResultList();
				for(Object[] skill : outdatedSkills) {
					OsiEmployees emp = new OsiEmployees();
					emp.setEmployeeId(skill[0] != null ? Integer.parseInt(skill[0].toString()) : null);
					emp.setFullName(skill[1] != null ? skill[1].toString(): "");	
					emp.setOfficeEmail(skill[2]!= null ? skill[2].toString().toLowerCase() : null);
					empList.add(emp);
				}
			} catch(NumberFormatException e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1010", "Error while parsing the due date in getEmployeesNotUpdatedSkills repo impl "+e.getMessage());
			} catch(Exception e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1010", "Error while executing the getEmployeesNotUpdatedSkills repo impl "+e.getMessage());
			}
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getEmployeesNotUpdatedSkills  -- End");
			return empList;
		}
		
		public String getCurrentDateStringinUTC() {
			SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		    dateFormatGmt.setTimeZone(TimeZone.getTimeZone("UTC"));	   	    
		    return dateFormatGmt.format(new Date());
		}
	
		@SuppressWarnings("unchecked")
		@Override
		public List<OsiEmployees> getOnProbationEmployees() throws DataAccessException {
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getOnProbationEmployees  -- Begin");
			List<OsiEmployees> onProbEmployeesList = new ArrayList<>();
			String onProbationEmpListQuery = "select e.employee_id as empId, e.employee_number, e.full_name name, e.office_email, e1.full_name supervisor, " + 
					" e1.office_email supervisormail, a.probation_end_date, e.org_id, " +
					" e.first_name, e.last_name, e.title, e.employee_type, e.user_name, e.serial_number, " + 
					" a.dept_id,concat(if(r.SEGMENT1 is null, '', concat(r.SEGMENT1, '.')), if(r.SEGMENT2 is null, '', concat(r.SEGMENT2, '.')), if(r.SEGMENT3 is null, '', concat(r.SEGMENT3, '.')), if(r.SEGMENT4 is null, '', concat(r.SEGMENT4, '.')), if(r.SEGMENT5 is null, '', concat(r.SEGMENT5, '.')), if(r.SEGMENT6 is null, '', concat(r.SEGMENT6, '.')),  if(r.SEGMENT7 is null, '', concat(r.SEGMENT7, '.')),if(r.SEGMENT8 is null, '', concat(r.SEGMENT8, '.')), if(r.SEGMENT9 is null, '', concat(r.SEGMENT9, '.')),if(r.SEGMENT10 is null, '', concat(r.SEGMENT10, '.'))) dept," + 
					" a.location_id,l.location_name, a.grade_id,g.grade_name, e.start_date, concat(if(c.country_calling_code is null, '', c.country_calling_code),' ', c.contact_number) mobile, e1.employee_id " + 
					" from osi_assignments a " + 
					" left join osi_employees e on e.employee_id = a.employee_id " + 
					" and CURRENT_TIMESTAMP() between e.effective_start_date and e.effective_end_date " + 
					" left join osi_employees e1 on e1.employee_id = a.supervisor_id " + 
					" and CURRENT_TIMESTAMP() between e1.effective_start_date and e1.effective_end_date " + 
					" left join osi_locations l on l.location_id = a.location_id " + 
					" left join osi_grades g on g.grade_id = a.grade_id " + 
					" left join osi_departments r on r.dept_id = a.dept_id " + 
					" left join osi_contacts c on c.employee_id = e.employee_id and c.contact_type='personal' " + 
					" where a.on_probation = 1  " + 
					" and CURRENT_TIMESTAMP() between a.effective_start_date and a.effective_end_date" + 
					//" and CURRENT_DATE() IN (" +
					" and a.probation_end_date in ( " + 
					" select pdate from (select assignment.probation_end_date as pdate" + 
//					" case " + 
//					"	when a.probation_unit='days' then DATE_ADD(a.probation_end_date, INTERVAL a.probation_unit_value DAY)" + 
//					"	when a.probation_unit='months' then DATE_ADD(a.probation_end_date,INTERVAL a.probation_unit_value MONTH) " + 
//					"	when a.probation_unit='years' then DATE_ADD(a.probation_end_date,INTERVAL  a.probation_unit_value YEAR) " + 
//					" end pdate" + 
					" from osi_assignments assignment where CURRENT_TIMESTAMP() between assignment.effective_start_date and assignment.effective_end_date "
					+ " and assignment.on_probation = 1 "
					+ " and CURRENT_DATE() <= assignment.probation_end_date"
					+ " ) d)";
			try {
				List<Object[]> onProbEmployees = this.entityManager.createNativeQuery(onProbationEmpListQuery)
													.getResultList();
				for(Object[] probEmp : onProbEmployees) {
					OsiEmployees emp = new OsiEmployees();
					emp.setEmployeeId(probEmp[0] != null ? Integer.parseInt(probEmp[0].toString()) : null);
					emp.setEmployeeNumber(probEmp[1] != null ? probEmp[1].toString() : null);
					emp.setFullName(probEmp[2] != null ? probEmp[2].toString() : "");	
					emp.setOfficeEmail(probEmp[3]!= null ? probEmp[3].toString().toLowerCase() : null);
					emp.setSupervisorName(probEmp[4]!= null ? probEmp[4].toString().toLowerCase() : "");
					emp.setSupervisorMail(probEmp[5]!= null ? probEmp[5].toString().toLowerCase() : null);
					emp.setProbEndDate(probEmp[6]!= null ? probEmp[6].toString() : null);
					emp.setOrgId(probEmp[7] != null ? Integer.parseInt(probEmp[7].toString()) : null);
					emp.setFirstName(probEmp[8]!= null ? probEmp[8].toString() : null);
					emp.setLastName(probEmp[9]!= null ? probEmp[9].toString() : null);
					emp.setTitle(probEmp[10]!= null ? probEmp[10].toString() : null);
					emp.setEmployeeType(probEmp[11]!= null ? probEmp[11].toString() : null);
					emp.setUserName(probEmp[12]!= null ? probEmp[12].toString() : null);
					emp.setSerialNumber(probEmp[13]!= null ? probEmp[13].toString() : null);
					emp.setDepartmentName(probEmp[15]!= null ? probEmp[15].toString() : null);
					emp.setLocationName(probEmp[17]!= null ? probEmp[17].toString() : null);
					emp.setGrade(probEmp[19]!= null ? probEmp[19].toString() : null);
					emp.setStartDate(probEmp[20]!= null ? probEmp[20].toString() : null);
					emp.setContactNumber(probEmp[21]!= null ? probEmp[21].toString() : null);
					emp.setSupervisorId(probEmp[22] != null ? Integer.parseInt(probEmp[22].toString()) : null);
					onProbEmployeesList.add(emp);
				}
			}  catch(NumberFormatException e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1010", "Error while executing the getOnProbationEmployees repo impl " + e.getMessage());
			} catch(Exception e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1012", "Error while executing the getOnProbationEmployees repo impl " + e.getMessage());
			}
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : getOnProbationEmployees  -- End");
			return onProbEmployeesList;
		}
	
		@Override
		public Integer updateProbation(int employeeId, String probationAction, Integer extendedValue, String probationReason) throws DataAccessException {
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : updateProbation  -- Begin");
			try {
				String currentTS = this.getCurrentUTCDate(0).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
				String advTS = this.getCurrentUTCDate(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
				OsiAssignments originalAssignmentRecord = this.findEmployeeByIdAndDate(employeeId,currentTS);
				
				
				String originalEffEndDate = originalAssignmentRecord.getEffectiveEndDate();
				Integer version = originalAssignmentRecord.getVersion();
				Date previousProbEndDate = originalAssignmentRecord.getProbationEndDate();
				
				Integer updatedFlag = this.updateAssignments(employeeId, currentTS);
				
				if(updatedFlag > 0) {
									    
					originalAssignmentRecord.setEffectiveStartDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(advTS));
					originalAssignmentRecord.setEffectiveEndDate(originalEffEndDate);
					originalAssignmentRecord.setVersion(++version);
					originalAssignmentRecord.setLastUpdateDate(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").parse(advTS));
					originalAssignmentRecord.setAssignmentId(this.getMaxAssignmentId() + 1);
					originalAssignmentRecord.setChangeReason(probationReason);
					
					if(probationAction.equalsIgnoreCase("approve") || probationAction.equalsIgnoreCase("terminate")) {
						originalAssignmentRecord.setOnProbation(null);
						originalAssignmentRecord.setProbationUnit(null);
						originalAssignmentRecord.setProbationUnitValue(null);
						originalAssignmentRecord.setProbationEndDate(null);
					} else if(probationAction.equalsIgnoreCase("extend")) {
						originalAssignmentRecord.setOnProbation(1);
						originalAssignmentRecord.setProbationUnit("months");
						Calendar c = Calendar.getInstance();
					    c.setTime(previousProbEndDate);
					    c.add(Calendar.MONTH, extendedValue);
					    Date extendedProbDate = c.getTime();
						originalAssignmentRecord.setProbationUnitValue(extendedValue);
						originalAssignmentRecord.setProbationEndDate(extendedProbDate);
					} 
					this.saveAssignment(originalAssignmentRecord);
				}
			} catch (Exception e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while executing "+e.getMessage());
			}
			LOGGER.info("## -- OsiEmployeesRepositoryCustomImpl : updateProbation  -- End");
			return null;
		}
	
		public ZonedDateTime getCurrentUTCDate(int addMinutes) throws BusinessException {
			
			return ZonedDateTime.now(ZoneId.of("Z")).plusMinutes(addMinutes);
		}
		
		@Override
		public OsiAssignments findEmployeeByIdAndDate(Integer empId, String searchDate) throws DataAccessException {
			OsiAssignments assignment = new OsiAssignments();
			LOGGER.info("findEmployeeByIdAndDate :: Begin ");
			
			try {
				DateTimeFormatter dtf = DateTimeFormatter.ofPattern("HH:mm:ss");
				LocalDateTime now = LocalDateTime.now();
				String time  = dtf.format(now);   
				String query = "select version, assignment_id, assignment_type, effective_start_date, effective_end_date"
						+ ",contract_start_date, contract_end_date, is_manager, supervisor_id, employee_id, grade_id, referred_by_id"
						+ ",change_reason, dept_id, job_id, location_id, on_probation, probation_unit, probation_unit_value "
						+ ",created_by, creation_date, last_updated_by, last_update_date, probation_end_date "
						+ "from osi_assignments "
						+ "where employee_id = :empId "
						+ " and now() between effective_start_date and effective_end_date "
						+ "order by last_update_date desc ";
				
				Object [] assignments = (Object[]) this.entityManager.createNativeQuery(query)
						.setParameter("empId", empId)
//						.setParameter(1, searchDate)
						.getSingleResult();
				
				//for(Object[]  assignments : newObject){
					assignment.setVersion((Integer)assignments[0]);
					assignment.setAssignmentId((Integer)assignments[1]);
					assignment.setAssignmentType((String)assignments[2]);
					assignment.setEffectiveStartDate((Date)assignments[3]);
					assignment.setEffectiveEndDate(convertTimestampToString((Timestamp)assignments[4]));
					           
					assignment.setContractStartDate((Timestamp)assignments[5]);
					assignment.setContractEndDate((Timestamp)assignments[6]);
					assignment.setIsManager((Integer)assignments[7]);
					assignment.setSupervisorId((Integer)assignments[8]);
					assignment.setEmployeeId((Integer)assignments[9]);
					           
					assignment.setGradeId((Integer)assignments[10]);
					assignment.setReferredById((Integer)assignments[11]);
					assignment.setChangeReason((String)assignments[12]);
					assignment.setDeptId((Integer)assignments[13]);
					assignment.setJobId((Integer)assignments[14]);
					           
					assignment.setLocationId((Integer)assignments[15]);
					assignment.setOnProbation(Boolean.valueOf((Boolean)assignments[16]) ? 1 : 0);
					assignment.setProbationUnit((String)assignments[17]);
					assignment.setProbationUnitValue((Integer)assignments[18]);
					           
					assignment.setCreatedBy((Integer)assignments[19]);
					assignment.setCreatedDate((Timestamp)assignments[20]);
					assignment.setUpdatedBy((Integer)assignments[21]);
					assignment.setLastUpdateDate((Timestamp)assignments[22]);
					assignment.setProbationEndDate((Date)assignments[23]);
				//}
				
			}catch (NoResultException e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1002", " No Records Found "+e.getMessage());
			}catch (Exception e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while updating "+e.getMessage());
			}
			LOGGER.info("findEmployeeByIdAndDate :: End ");
			return assignment;
		}
		
		@Override
		public Integer updateAssignments(Integer employeeId, String effectiveEndDate) throws DataAccessException {
			Integer result;
			LOGGER.info("updateAssignments :: Begin ");
			try {
				String updateQuery = "update osi_assignments e set "
						+ " e.effective_end_date = ?1, e.LAST_UPDATE_DATE = ?2 where "
						+ " e.employee_id = ?3 and "
						+ " ?4 between e.effective_start_date and e.effective_end_date";
				result = this.entityManager.createNativeQuery(updateQuery)
						.setParameter(1, effectiveEndDate)
						.setParameter(2, this.getCurrentDateStringinUTC())
						.setParameter(3, employeeId)
						.setParameter(4, new java.sql.Timestamp(new Date().getTime()))
						.executeUpdate();
			}catch (NoResultException e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1002", " No Records Found "+e.getMessage());
			}catch (Exception e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while updating "+e.getMessage());
			}
			LOGGER.info("updateAssignments :: End ");
			return result;
		}
		
		@Transactional
		public Integer saveAssignment(OsiAssignments newAssignment) throws DataAccessException {
			
			LOGGER.info("saveAssignment :: Begin ");
			
			Integer result = null;
			try {
				
				Query query = entityManager.createNativeQuery("insert into osi_assignments(version, assignment_id, assignment_type, effective_start_date, effective_end_date"
						+ ",contract_start_date, contract_end_date, is_manager, supervisor_id, employee_id, grade_id, referred_by_id"
						+ ",change_reason, dept_id, job_id, location_id, on_probation, probation_unit, probation_unit_value "
						+ ",created_by, creation_date, last_updated_by, last_update_date, probation_end_date )"
						+ "values(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24)");
				   
				   query.setParameter(1, newAssignment.getVersion());
				   query.setParameter(2, newAssignment.getAssignmentId());
				   query.setParameter(3, newAssignment.getAssignmentType());
				   query.setParameter(4, newAssignment.getEffectiveStartDate());
				   query.setParameter(5, newAssignment.getEffectiveEndDate());
				   
				   query.setParameter(6, newAssignment.getContractStartDate());
				   query.setParameter(7, newAssignment.getContractEndDate());
				   query.setParameter(8, newAssignment.getIsManager());
				   query.setParameter(9, newAssignment.getSupervisorId());
				   query.setParameter(10, newAssignment.getEmployeeId());
				  
				   query.setParameter(11, newAssignment.getGradeId());
				   query.setParameter(12, newAssignment.getReferredById());
				   query.setParameter(13, newAssignment.getChangeReason());
				   query.setParameter(14, newAssignment.getDeptId());
				   query.setParameter(15, newAssignment.getJobId());
				   
				   query.setParameter(16, newAssignment.getLocationId());
				   query.setParameter(17, newAssignment.getOnProbation());
				   query.setParameter(18, newAssignment.getProbationUnit());
				   query.setParameter(19, newAssignment.getProbationUnitValue());
				   
				   query.setParameter(20, newAssignment.getCreatedBy());
				   query.setParameter(21, newAssignment.getCreatedDate());
				   query.setParameter(22, newAssignment.getUpdatedBy());
				   query.setParameter(23, newAssignment.getLastUpdateDate());
				   query.setParameter(24, newAssignment.getProbationEndDate());
				   
				   result = query.executeUpdate();
				   
			}catch(Exception e){
				LOGGER.error("Error Occured :: "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while saving "+e.getMessage());
			}
			LOGGER.info("saveAssignment :: End ");
			return result;
		}
		
		@Override
		public String convertTimestampToString(Timestamp timestamp) throws DataAccessException {
			String timestampString = null;
			LOGGER.info("convertTimestampToString :: Begin ");
			try{
				
				SimpleDateFormat dateFormat = null;
				if(timestamp != null) {
					dateFormat = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
					timestampString = dateFormat.format(timestamp);
				}
			}
			catch(Exception e){
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured getting the current time stamp "+e.getMessage());
			}
			LOGGER.info("convertTimestampToString :: End ");
			return timestampString;
		}
		
		@Override
		public Integer getMaxAssignmentId() throws DataAccessException {
			Integer assignmentId = null;
			LOGGER.info("getMaxAssignmentId :: Begin ");
			try {
				String query = "select max(assignment_id) from osi_assignments";
				assignmentId = (Integer) this.entityManager.createNativeQuery(query).getSingleResult();
				
			}catch (NoResultException e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1002", " No Records Found "+e.getMessage());
			}catch (Exception e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while updating "+e.getMessage());
			}
			LOGGER.info("getMaxAssignmentId :: End ");
			return assignmentId;
		}
		
		@Override
		public Integer TerminateEmployee(Integer employeeId) throws DataAccessException {
			Integer result = 0;
			LOGGER.info("updateAssignments :: Begin ");
			try {
				OsiEmployees oldRecord = this.getEmployees(employeeId);
				if(oldRecord != null) {
					
					String currentTS = this.getCurrentUTCDate(0).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
					String advTS = this.getCurrentUTCDate(1).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
					int r = this.updateEmployee(employeeId, currentTS);
					if(r > 0) {
						oldRecord.setEffectiveStartDate(advTS);
						oldRecord.setEffectiveEndDate(defaultEndDate);
						oldRecord.setEmployeeStatus(0);
						
						result= this.saveEmployeeInfo(oldRecord);
						OsiAssignments existAssignmentRecord = this.findAssignmentByEmployeeId(employeeId);
						if(existAssignmentRecord != null) {
							String existEffEndDate = existAssignmentRecord.getEffectiveEndDate();
							
							SimpleDateFormat dateFormatGmt = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
						    dateFormatGmt.setTimeZone(TimeZone.getTimeZone("UTC"));	   
						    Date effEndDate = dateFormatGmt.parse(existEffEndDate);
						    
						    Calendar cal = Calendar.getInstance();
					        cal.setTimeInMillis(effEndDate.getTime());
					        cal.add(Calendar.SECOND, 1);
					        
					        Date modifiedEffEndDate = cal.getTime();
					        
							existAssignmentRecord.setEffectiveStartDate(modifiedEffEndDate);
							existAssignmentRecord.setEffectiveEndDate(defaultEndDate);
							
							result= this.saveAssignment(existAssignmentRecord);
						}
						if(result <= 0) {
							LOGGER.error("Exception occured Unable to Update an Employee");
							throw new DataAccessException("ERR_1002", " Exception occured : Unable to Terminate an Employee");
						}
					} else {
						LOGGER.error("Exception occured Unable to Update an Employee");
						throw new DataAccessException("ERR_1002", " Exception occured : Unable to Update an Employee");
					}
				}
			}catch (DataAccessException e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException(e.getErrorCode(), e.getSystemMessage());
			}catch (Exception e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while updating "+e.getMessage());
			}
			LOGGER.info("updateAssignments :: End ");
			return result;
		}
		
		@Override
		public Integer saveEmployeeInfo(OsiEmployees osiEmployees) throws DataAccessException {
			try {
				LOGGER.info("saveEmployeeInfo : Begin");
				Query query = entityManager.createNativeQuery("insert into osi_employees(employee_id,employee_number,first_name, last_name, middle_name,full_name,title, suffix,prefix"
						+ ",employee_type,applicant_number,date_of_birth, start_date,effective_start_date,effective_end_date"
						+ ",org_id,blood_group,background_check_status,background_date_check,correspondence_language,office_email,personal_email"
						+ ",expense_check_send_to_address_id,fte_capacity, hold_applicant_date_until,mail_stop,preferred_name"
						+ ",last_medical_test_date, last_medical_test_by, nationality, marital_status,national_identifier,on_military_service,previous_last_name"
						+ ",rehire_reason, rehire_recommendation,resume_exists,resume_last_updated,resume_id,second_passport_exists,gender, work_schedule_id"
						+ ",receipt_of_death_cert_date,uses_tobacco_flag,photo_id,date_of_death,original_date_of_hire,passport_number,passport_date_of_issue," 
						+ "passport_date_of_expiry,passport_issuance_authority,passport_place_of_issue,communication_address_id,permanent_address_id, version"
						+ ",Attribute1,Attribute2, Attribute3, Attribute4, Attribute5, Attribute6, Attribute7, Attribute8, Attribute9, Attribute10,Attribute11,Attribute12"
						+",Attribute13,Attribute14,Attribute15,Attribute16,Attribute17, Attribute18, Attribute19, Attribute20, Attribute21,Attribute22, Attribute23,Attribute24, Attribute25"
						+ ",created_by, creation_date, last_updated_by,last_update_date,attachment_id, termination_date, total_exp, user_name, system_type, serial_number, employee_status, is_proxy_enabled, skip_proxy_ops ) "
						+ "values(?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22, ?23, ?24, ?25, ?26, ?27, ?28, ?29, ?30, "
						+ "?31, ?32, ?33, ?34, ?35, ?36, ?37, ?38, ?39, ?40, ?41, ?42, ?43, ?44, ?45, ?46, ?47, ?48, ?49, ?50, ?51, ?52, ?53, ?54, ?55, ?56, ?57, ?58, ?59, ?60, "
						+ "?61, ?62, ?63, ?64, ?65, ?66, ?67, ?68, ?69, ?70, ?71, ?72, ?73, ?74, ?75, ?76, ?77, ?78, ?79, ?80, ?81, ?82, ?83, ?84, ?85, ?86, ?87, ?88, ?89, ?90, ?91, ?92, ?93)");
					  
					   query.setParameter(1, osiEmployees.getEmployeeId());
					   query.setParameter(2, osiEmployees.getEmployeeNumber());
					   query.setParameter(3, osiEmployees.getFirstName());
					   query.setParameter(4, osiEmployees.getLastName());
					   query.setParameter(5, osiEmployees.getMiddleName());
					   
					   query.setParameter(6, osiEmployees.getFullName());
					   query.setParameter(7, osiEmployees.getTitle());
					   query.setParameter(8, osiEmployees.getSuffix());
					   query.setParameter(9, osiEmployees.getPrefix());
					   query.setParameter(10, osiEmployees.getEmployeeType());
					  
					   query.setParameter(11, osiEmployees.getApplicantNumber());
					   query.setParameter(12, osiEmployees.getDateOfBirth());
					   query.setParameter(13, osiEmployees.getStartDate());
					   query.setParameter(14, osiEmployees.getEffectiveStartDate());
					   query.setParameter(15, osiEmployees.getEffectiveEndDate());
					   
					   query.setParameter(16, osiEmployees.getOrgId());
					   query.setParameter(17, osiEmployees.getBloodType());
					   query.setParameter(18, osiEmployees.getBackgroundCheckStatus());
					   query.setParameter(19, osiEmployees.getBackgroundDateCheck());
					   query.setParameter(20, osiEmployees.getCorrespondenceLanguage());
					   query.setParameter(21, osiEmployees.getOfficeEmail());
					   query.setParameter(22, osiEmployees.getPersonalEmail());
					   query.setParameter(23, osiEmployees.getExpenseCheckSendToAddressId());
					   query.setParameter(24, osiEmployees.getFteCapacity());
					   query.setParameter(25, osiEmployees.getHoldApplicantDateUntil());
					   query.setParameter(26, osiEmployees.getMailStop());
					   query.setParameter(27, osiEmployees.getKnownAs());
					   query.setParameter(28, osiEmployees.getLastMedicalTestDate());
					   query.setParameter(29, osiEmployees.getLastMedicalTestBy());
					   query.setParameter(30, osiEmployees.getNationality());
					   query.setParameter(31, osiEmployees.getMaritalStatus());
					   query.setParameter(32, osiEmployees.getNationalIdentifier());
					   query.setParameter(33, osiEmployees.getOnMilitaryService());
					   query.setParameter(34, osiEmployees.getPreviousLastName());
					   query.setParameter(35, osiEmployees.getRehireReason());
					   query.setParameter(36, osiEmployees.getRehireRecommendation());
					   query.setParameter(37, osiEmployees.getResumeExists());
					   query.setParameter(38, osiEmployees.getResumeLastUpdated());
					   query.setParameter(39, osiEmployees.getResumeId());
					   
					   query.setParameter(40, osiEmployees.getSecondPassportExists());
					   query.setParameter(41, osiEmployees.getGender());
					   query.setParameter(42, osiEmployees.getWorkScheduleId());
					   query.setParameter(43, osiEmployees.getReceiptOfDeathCertDate());
					   query.setParameter(44, osiEmployees.getUsesTobaccoFlag());
					   query.setParameter(45, osiEmployees.getPhotoId());
					   query.setParameter(46, osiEmployees.getDateOfDeath());
					   query.setParameter(47, osiEmployees.getOriginalDateOfHire());				   
					   query.setParameter(48, osiEmployees.getPassportNumber());
					   query.setParameter(49, osiEmployees.getPassportDateOfIssue());
					   query.setParameter(50, osiEmployees.getPassportDateOfExpiry());
					   query.setParameter(51, osiEmployees.getPassportIssuanceAuthority());
					   query.setParameter(52, osiEmployees.getPassportPlaceOfIssue());
					   query.setParameter(53, osiEmployees.getMailAddressId());
					   query.setParameter(54, osiEmployees.getPermanentAddressId());
					   query.setParameter(55, osiEmployees.getVersion());
					   query.setParameter(56, osiEmployees.getAttribute1());
					   query.setParameter(57, osiEmployees.getAttribute2());
					   query.setParameter(58, osiEmployees.getAttribute3());
					   query.setParameter(59, osiEmployees.getAttribute4());
					   query.setParameter(60, osiEmployees.getAttribute5());
					   query.setParameter(61, osiEmployees.getAttribute6());
					   query.setParameter(62, osiEmployees.getAttribute7());
					   query.setParameter(63, osiEmployees.getAttribute8());
					   query.setParameter(64, osiEmployees.getAttribute9());
					   query.setParameter(65, osiEmployees.getAttribute10());
					   query.setParameter(66, osiEmployees.getAttribute11());
					   query.setParameter(67, osiEmployees.getAttribute12());
					   query.setParameter(68, osiEmployees.getAttribute13());
					   query.setParameter(69, osiEmployees.getAttribute14());
					   query.setParameter(70, osiEmployees.getAttribute15());
					   query.setParameter(71, osiEmployees.getAttribute16());
					   query.setParameter(72, osiEmployees.getAttribute17());
					   query.setParameter(73, osiEmployees.getAttribute18());
					   query.setParameter(74, osiEmployees.getAttribute19());
					   query.setParameter(75, osiEmployees.getAttribute20());
					   query.setParameter(76, osiEmployees.getAttribute21());
					   query.setParameter(77, osiEmployees.getAttribute22());
					   query.setParameter(78, osiEmployees.getAttribute23());
					   query.setParameter(79, osiEmployees.getAttribute24());
					   query.setParameter(80, osiEmployees.getAttribute25());
					   query.setParameter(81, osiEmployees.getCreatedBy());
					   query.setParameter(82, osiEmployees.getCreationDate());
					   query.setParameter(83, osiEmployees.getLastUpdatedBy());
					   query.setParameter(84, osiEmployees.getLastUpdateDate());
					   query.setParameter(85, osiEmployees.getAttachmentId());
					   query.setParameter(86, osiEmployees.getTerminationDate());
					   query.setParameter(87, osiEmployees.getTotalExp());
					   query.setParameter(88, osiEmployees.getUserName());
					   
					   query.setParameter(89, osiEmployees.getSystemType());
					   query.setParameter(90, osiEmployees.getSerialNumber());
					   query.setParameter(91, osiEmployees.getEmployeeStatus());
					   
					   query.setParameter(92, osiEmployees.getIsProxyEnabled());
					   query.setParameter(93, osiEmployees.getIsProxyRestricted());
					   
					   query.executeUpdate();
					   
					   LOGGER.info("saveEmployeeInfo : End");
			} catch (Exception e) {
				LOGGER.error("Exception: "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while executing "+e.getMessage());
			}
			return osiEmployees.getEmployeeId();
		}
		
		@Override
		public OsiEmployees getEmployees(int employeeId) throws DataAccessException {
			OsiEmployees osiEmployees = null;
			try {
				LOGGER.info("getEmployees : Begin");
				String getEmployeeQuery = "select employee_id,employee_number,first_name, last_name, middle_name,full_name,title, suffix,prefix "
						+ ",employee_type,applicant_number,date_of_birth, start_date,effective_start_date,effective_end_date"
						+ ",org_id,blood_group,background_check_status,background_date_check,correspondence_language,office_email,personal_email"
						+ ",expense_check_send_to_address_id,fte_capacity, hold_applicant_date_until,mail_stop,preferred_name"
						+ ",last_medical_test_date, last_medical_test_by, nationality, marital_status,national_identifier,on_military_service,previous_last_name"
						+ ",rehire_reason, rehire_recommendation,resume_exists,resume_last_updated,resume_id,second_passport_exists,gender, work_schedule_id"
						+ ",receipt_of_death_cert_date,uses_tobacco_flag,photo_id,date_of_death,original_date_of_hire,passport_number,passport_date_of_issue," 
						+ "passport_date_of_expiry,passport_issuance_authority,passport_place_of_issue,communication_address_id,permanent_address_id, version"
						+ ",Attribute1,Attribute2, Attribute3, Attribute4, Attribute5, Attribute6, Attribute7, Attribute8, Attribute9, Attribute10,Attribute11,Attribute12"
						+",Attribute13,Attribute14,Attribute15,Attribute16,Attribute17, Attribute18, Attribute19, Attribute20, Attribute21,Attribute22, Attribute23,Attribute24, Attribute25"
						+ ",created_by, creation_date, last_updated_by,last_update_date,attachment_id, termination_date, user_name, system_type, serial_number, total_exp, employee_status"
						+ ", is_proxy_enabled, skip_proxy_ops "
						+ " from osi_employees e " 
						+ " where "
						+ " e.employee_id = ?1 "
						+ " and CURRENT_TIMESTAMP() between e.effective_start_date and e.effective_end_date";
				
				Object[] object = (Object[]) this.entityManager.createNativeQuery(getEmployeeQuery)
				.setParameter(1, employeeId).getSingleResult();
				
				osiEmployees = new OsiEmployees();
				osiEmployees.setEmployeeId(object[0]!= null ? Integer.parseInt(object[0].toString()) : null);
				osiEmployees.setEmployeeNumber(object[1]!= null ? object[1].toString() : null);
				osiEmployees.setFirstName(object[2]!= null ? object[2].toString() : null);
				osiEmployees.setLastName(object[3]!= null ? object[3].toString() : null);
				osiEmployees.setMiddleName(object[4]!= null ? object[4].toString(): null);
				osiEmployees.setFullName(object[5]!= null ? object[5].toString() : null);
				osiEmployees.setTitle(object[6]!= null ? object[6].toString() : null);
				osiEmployees.setSuffix(object[7]!=null ? object[7].toString() : null);
				osiEmployees.setPrefix(object[8]!= null ? object[8].toString() : null);
				osiEmployees.setEmployeeType(object[9]!= null ? object[9].toString() : null);
				osiEmployees.setApplicantNumber(object[10]!= null ? object[10].toString() : null);
				osiEmployees.setDateOfBirth(object[11]!= null ? object[11].toString() : null);
				osiEmployees.setStartDate(object[12]!= null ? object[12].toString():null);
				osiEmployees.setEffectiveStartDate(object[13]!= null ? convertTimestampToString((Timestamp)object[13]) : null);
				osiEmployees.setEffectiveEndDate(object[14]!= null ? convertTimestampToString((Timestamp)object[14]): null);
				osiEmployees.setOrgId(object[15]!= null ? Integer.parseInt(object[15].toString()) : null);
				osiEmployees.setBloodType(object[16]!= null ? object[16].toString(): null);
				osiEmployees.setBackgroundCheckStatus(object[17]!= null ? Integer.parseInt(object[17].toString()): null);
				osiEmployees.setBackgroundDateCheck(object[18]!= null ? object[18].toString(): null);
				osiEmployees.setCorrespondenceLanguage(object[19]!= null ? object[19].toString(): null);
				osiEmployees.setOfficeEmail(object[20]!= null ? object[20].toString(): null);
				osiEmployees.setPersonalEmail(object[21]!= null ? object[21].toString(): null);
				osiEmployees.setExpenseCheckSendToAddressId(object[22]!= null ? Integer.parseInt(object[22].toString()): null);
				osiEmployees.setFteCapacity(object[23]!= null ? Integer.parseInt(object[23].toString()): null);
				osiEmployees.setHoldApplicantDateUntil(object[24]!= null ? object[24].toString(): null);
				osiEmployees.setMailStop(object[25]!= null ? object[25].toString(): null);
				osiEmployees.setKnownAs(object[26]!= null ? object[26].toString(): null);
				
				osiEmployees.setLastMedicalTestDate(object[27]!= null ? object[27].toString(): null);
				
				osiEmployees.setLastMedicalTestBy(object[28]!= null ? object[28].toString(): null);
				osiEmployees.setNationality(object[29]!= null ? object[29].toString(): null);
				osiEmployees.setMaritalStatus(object[30]!= null ? object[30].toString(): null);
				osiEmployees.setNationalIdentifier(object[31]!= null ? object[31].toString(): null);
				osiEmployees.setOnMilitaryService(object[32]!= null ? Integer.parseInt(object[32].toString()): null);
				osiEmployees.setPreviousLastName(object[33]!= null ? object[33].toString(): null);
				osiEmployees.setRehireReason(object[34]!= null ? object[34].toString(): null);
				osiEmployees.setRehireRecommendation(object[35]!= null ? object[35].toString(): null);
				osiEmployees.setResumeExists(object[36]!= null ? Integer.parseInt(object[36].toString()): null);
				osiEmployees.setResumeLastUpdated(object[37]!= null ? object[37].toString(): null);
				osiEmployees.setResumeId(object[38]!= null ? Integer.parseInt(object[38].toString()): null);
				osiEmployees.setSecondPassportExists(object[39]!= null ? Integer.parseInt(object[39].toString()): null);
				osiEmployees.setGender(object[40]!= null ? object[40].toString(): null);
				osiEmployees.setWorkScheduleId(object[41]!= null ? Integer.parseInt(object[41].toString()): null);
				osiEmployees.setReceiptOfDeathCertDate(object[42]!= null ? object[42].toString(): null);
				osiEmployees.setUsesTobaccoFlag(object[43]!= null ? Integer.parseInt(object[43].toString()): null);
				osiEmployees.setPhotoId(object[44]!= null ? Integer.parseInt(object[44].toString()): null);
				osiEmployees.setDateOfDeath(object[45]!= null ? object[45].toString(): null);
				osiEmployees.setOriginalDateOfHire(object[46]!= null ? object[46].toString(): null);
				osiEmployees.setPassportNumber(object[47]!= null ? object[47].toString(): null);
				osiEmployees.setPassportDateOfIssue(object[48]!= null ? object[48].toString(): null);
				osiEmployees.setPassportDateOfExpiry(object[49]!= null ? object[49].toString(): null);
				osiEmployees.setPassportIssuanceAuthority(object[50]!= null ? object[50].toString(): null);
				osiEmployees.setPassportPlaceOfIssue(object[51]!= null ? object[51].toString(): null);
				osiEmployees.setMailAddressId(object[52]!= null ? Integer.parseInt(object[52].toString()): null);
				osiEmployees.setPermanentAddressId(object[53]!= null ? Integer.parseInt(object[53].toString()): null);
				osiEmployees.setVersion(object[54]!= null ? Integer.parseInt(object[54].toString()): null);
				osiEmployees.setAttribute1(object[55]!= null ? object[55].toString(): null);
				osiEmployees.setAttribute2(object[56]!= null ? object[56].toString(): null);
				osiEmployees.setAttribute3(object[57]!= null ? object[57].toString(): null);
				osiEmployees.setAttribute4(object[58]!= null ? object[58].toString(): null);
				osiEmployees.setAttribute5(object[59]!= null ? object[59].toString(): null);
				osiEmployees.setAttribute6(object[60]!= null ? object[60].toString(): null);
				osiEmployees.setAttribute7(object[61]!= null ? object[61].toString(): null);
				osiEmployees.setAttribute8(object[62]!= null ? object[62].toString(): null);
				osiEmployees.setAttribute9(object[63]!= null ? object[63].toString(): null);
				osiEmployees.setAttribute10(object[64]!= null ? object[64].toString(): null);
				osiEmployees.setAttribute11(object[65]!= null ? object[65].toString(): null);
				osiEmployees.setAttribute12(object[66]!= null ? object[66].toString(): null);
				osiEmployees.setAttribute13(object[67]!= null ? object[67].toString(): null);
				osiEmployees.setAttribute14(object[68]!= null ? object[68].toString(): null);
				osiEmployees.setAttribute15(object[69]!= null ? object[69].toString(): null);
				osiEmployees.setAttribute16(object[70]!= null ? object[70].toString(): null);
				osiEmployees.setAttribute17(object[71]!= null ? object[71].toString(): null);
				osiEmployees.setAttribute18(object[72]!= null ? object[72].toString(): null);
				osiEmployees.setAttribute19(object[73]!= null ? object[73].toString(): null);
				osiEmployees.setAttribute20(object[74]!= null ? object[74].toString(): null);
				osiEmployees.setAttribute21(object[75]!= null ? object[75].toString(): null);
				osiEmployees.setAttribute22(object[76]!= null ? object[76].toString(): null);
				osiEmployees.setAttribute23(object[77]!= null ? object[77].toString(): null);
				osiEmployees.setAttribute24(object[78]!= null ? object[78].toString(): null);
				osiEmployees.setAttribute25(object[79]!= null ? object[79].toString(): null);
				osiEmployees.setCreatedBy(object[80]!= null ? Integer.parseInt(object[80].toString()) : null);
				osiEmployees.setCreationDate(object[81]!= null ? object[81].toString(): null);
				osiEmployees.setLastUpdatedBy(object[82]!= null ? Integer.parseInt(object[82].toString()): null);
				osiEmployees.setLastUpdateDate(object[83]!= null ? object[83].toString(): null);
				osiEmployees.setAttachmentId(object[84]!= null ? Integer.parseInt(object[84].toString()): null);
				osiEmployees.setTerminationDate(object[85]!= null ? convertTimestampToString((Timestamp)object[85]) : null);
				
				osiEmployees.setUserName(object[86]!= null ? object[86].toString(): null);
				osiEmployees.setSystemType(object[87]!= null ? object[87].toString(): null);
				osiEmployees.setSerialNumber(object[88]!= null ? object[88].toString(): null);
				osiEmployees.setTotalExp(object[89]!= null ? Double.parseDouble(object[89].toString()): null);
				osiEmployees.setEmployeeStatus(object[90]!= null ? Integer.parseInt(object[90].toString()) : null);
				
				osiEmployees.setIsProxyEnabled(object[91]!= null ? Integer.parseInt(object[91].toString()) : null);
				osiEmployees.setIsProxyRestricted(object[92]!= null ? Integer.parseInt(object[92].toString()) : null);
				
				LOGGER.info("getEmployees : End");
			}  catch(NoResultException e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1002", "No Records Found "+e.getMessage());
			} catch (Exception e) {
				LOGGER.error("Exception : "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while executing "+e.getMessage());
			}
			return osiEmployees;
		}
		
		@Override
		public Integer updateEmployee(Integer employeeId, String effectiveEndDate) throws DataAccessException {
			Integer result;
			LOGGER.info("updateAssignments :: Begin ");
			try {
				String updateQuery = "update osi_employees e set "
						+ " e.effective_end_date = ?1, e.LAST_UPDATE_DATE = ?2 where "
						+ " e.employee_id = ?3 and "
						+ " ?4 between e.effective_start_date and e.effective_end_date";
				result = this.entityManager.createNativeQuery(updateQuery)
						.setParameter(1, effectiveEndDate)
						.setParameter(2, this.getCurrentDateStringinUTC())
						.setParameter(3, employeeId)
						.setParameter(4, new java.sql.Timestamp(new Date().getTime()))
						.executeUpdate();
			} catch (Exception e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while updating osi_employees "+e.getMessage());
			}
			LOGGER.info("updateAssignments :: End ");
			return result;
		}
		
		@SuppressWarnings("unchecked")
		@Override
		public List<OsiEmployees> getHeadInfo(int employeeId, String headType) throws DataAccessException {
			List<OsiEmployees> employeesList = null;
			LOGGER.info("getHeadInfo :: Begin ");
			try {
				List<Object[]> employeesListObj = this.entityManager.createNativeQuery("CALL getBuHead(:employeeId, :type)")
						.setParameter("employeeId", employeeId)
						.setParameter("type", headType)
						.getResultList();
					if(employeesListObj.size() != 0)
						employeesList = new ArrayList<OsiEmployees>();
					for(Object[] employeeObj : employeesListObj) {
						OsiEmployees employee = new OsiEmployees();
						employee.setEmployeeNumber((String) employeeObj[0]);
						employee.setFullName((String) employeeObj[1]);
						employee.setOfficeEmail((String) employeeObj[2]);
						employeesList.add(employee);
					}
			} catch (NoResultException ne) {
				LOGGER.error("Exception : "+ne.getMessage());
				throw new DataAccessException("ERR_1002", "No records found for search employee "+ne.getMessage());
			} catch (Exception e) {
				throw new DataAccessException("ERR_1000", "Exception occured while executing "+e.getMessage());
			}
			LOGGER.info("getHeadInfo :: End ");
			return employeesList;
		}
		
		@Override
		public Map<String, Boolean> checkUsernameOrOfficeEmailExist(String officeEmail, String userName) throws DataAccessException {
			LOGGER.info("checkUsernameOrOfficeEmailExist :: Begin ");
			Map<String, Boolean> resultMap = new HashMap<>();
			String mailExist = "select count(*) from osi_employees where office_email = :mailId";
			String userNameExist = "select count(*) from osi_employees where user_name = :userName";
			try {
				BigInteger mailCount = (BigInteger) this.entityManager.createNativeQuery(mailExist)
							.setParameter("mailId", officeEmail).getSingleResult();
				if(mailCount.intValue() == 0)
					resultMap.put("officeMail", false);
				else
					resultMap.put("officeMail", true);
				
				BigInteger userNameCount = (BigInteger) this.entityManager.createNativeQuery(userNameExist)
						.setParameter("userName", userName).getSingleResult();
				if(userNameCount.intValue() == 0)
					resultMap.put("userName", false);
				else
					resultMap.put("userName", true);
			} catch (NoResultException ne) {
				LOGGER.error("Exception : "+ne.getMessage());
				throw new DataAccessException("ERR_1002", "No records found for search employee "+ne.getMessage());
			} catch (Exception e) {
				throw new DataAccessException("ERR_1000", "Exception occured while executing "+e.getMessage());
			}
			LOGGER.info("checkUsernameOrOfficeEmailExist :: End ");
			return resultMap;
		}
		
		@Override
		@Transactional
		public String getTerminationDate(int employeeId) throws DataAccessException {
			String terminationDate = null;
			LOGGER.info("getTerminationDate :: Begin ");
			try {
				String getTerminationDateQuery = "select DATE_FORMAT(e.termination_date, '%Y-%m-%d') from osi_employees e where e.employee_id = :empId order by e.effective_end_date desc limit 1;";
				terminationDate = (String) this.entityManager.createNativeQuery(getTerminationDateQuery)
						.setParameter("empId", employeeId).getSingleResult();
			} catch (NoResultException ne) {
				LOGGER.error("Exception : "+ne.getMessage());
				throw new DataAccessException("ERR_1002", "No records found for the given employee Id "+ne.getMessage());
			} catch(Exception e) {
				throw new DataAccessException("ERR_1000", "Exception occured while executing "+e.getMessage());
			}
			LOGGER.info("getTerminationDate :: End ");
			return terminationDate;
		}
		
		@SuppressWarnings("unchecked")
		@Override
		public OsiAssignments findAssignmentByEmployeeId(Integer empId) throws DataAccessException {
			OsiAssignments assignment = null;
			LOGGER.info("findAssignmentByEmployeeId :: Begin ");
			try {
				String query = "select version, assignment_id, assignment_type, effective_start_date, effective_end_date"
						+ ",contract_start_date, contract_end_date, is_manager, supervisor_id, employee_id, grade_id, referred_by_id"
						+ ",change_reason, dept_id, job_id, location_id, on_probation, probation_unit, probation_unit_value "
						+ ",created_by, creation_date, last_updated_by, last_update_date, probation_end_date "
						+ "from osi_assignments "
						+ "where employee_id = :empId "
						+ "order by last_update_date desc limit 1";
				
				Object [] assignments = (Object[]) this.entityManager.createNativeQuery(query)
						.setParameter("empId", empId)
						.getSingleResult();
				
					assignment = new OsiAssignments();
					assignment.setVersion((Integer)assignments[0]);
					assignment.setAssignmentId((Integer)assignments[1]);
					assignment.setAssignmentType((String)assignments[2]);
					assignment.setEffectiveStartDate((Date)assignments[3]);
					assignment.setEffectiveEndDate(convertTimestampToString((Timestamp)assignments[4]));
					           
					assignment.setContractStartDate((Timestamp)assignments[5]);
					assignment.setContractEndDate((Timestamp)assignments[6]);
					assignment.setIsManager(assignments[7]!= null ? new Boolean(assignments[7].toString())?1:0 : null);
					assignment.setSupervisorId((Integer)assignments[8]);
					assignment.setEmployeeId((Integer)assignments[9]);
					           
					assignment.setGradeId((Integer)assignments[10]);
					assignment.setReferredById((Integer)assignments[11]);
					assignment.setChangeReason((String)assignments[12]);
					assignment.setDeptId((Integer)assignments[13]);
					assignment.setJobId((Integer)assignments[14]);
					           
					assignment.setLocationId((Integer)assignments[15]);
					assignment.setOnProbation(assignments[16]!= null ? new Boolean(assignments[16].toString())?1:0 : null);
					assignment.setProbationUnit((String)assignments[17]);
					assignment.setProbationUnitValue((Integer)assignments[18]);
					//assignment.setPayGradeId((Integer)assignments[19]);
					           
					assignment.setCreatedBy((Integer)assignments[19]);
					assignment.setCreatedDate((Timestamp)assignments[20]);
					assignment.setUpdatedBy((Integer)assignments[21]);
					assignment.setLastUpdateDate((Timestamp)assignments[22]);
					assignment.setProbationEndDate((Date)assignments[23]);
//				}
				
			}catch (NoResultException e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1002", " No Records Found");
			}catch (Exception e) {
				LOGGER.error("Exception occured "+e.getMessage());
				throw new DataAccessException("ERR_1000", "Exception occured while updating");
			}
			LOGGER.info("findAssignmentByEmployeeId :: End ");
			return assignment;
		}
		
}
