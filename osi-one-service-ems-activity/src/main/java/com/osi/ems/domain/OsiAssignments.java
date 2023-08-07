package com.osi.ems.domain;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

@Entity
@Table(name = "osi_assignments")
public class OsiAssignments implements java.io.Serializable {
	
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer version;
	private Integer assignmentId;
	private String assignmentType;
	private Date effectiveStartDate;
	private String effectiveEndDate;
	private Date contractStartDate;
	private Date contractEndDate;
	private Integer isManager;
	private Integer supervisorId;
	private Integer employeeId;
	private Integer gradeId;
	private Integer referredById;
	private String changeReason;
	private Integer deptId;
	private Integer jobId;
	private Integer locationId;
	private Integer onProbation;
	private String probationUnit;
	private Integer probationUnitValue;
	private Date probationEndDate;
	//private Integer payGradeId;
	private Integer createdBy;
	@Column(name = "creation_date")
	private Date createdDate;
	@Column(name = "last_updated_by")
	private Integer updatedBy;
	@Column(name = "last_update_date")
	private Date lastUpdateDate;
	
	public OsiAssignments(){
		
	}
	
	@Column(name = "version")
	public Integer getVersion() {
		return version;
	}
	public void setVersion(Integer version) {
		this.version = version;
	}
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name = "assignment_id", unique = true, nullable = false)
	public Integer getAssignmentId() {
		return assignmentId;
	}
	public void setAssignmentId(Integer assignmentId) {
		this.assignmentId = assignmentId;
	}
	
	@Column(name = "assignment_type", length = 20)
	public String getAssignmentType() {
		return assignmentType;
	}
	public void setAssignmentType(String assignmentType) {
		this.assignmentType = assignmentType;
	}
	
	@Temporal(TemporalType.DATE)
	@Column(name = "effective_start_date")
	public Date getEffectiveStartDate() {
		return effectiveStartDate;
	}

	public void setEffectiveStartDate(Date effectiveStartDate) {
		this.effectiveStartDate = effectiveStartDate;
	}
	
	@Column(name = "effective_end_date")
	public String getEffectiveEndDate() {
		return effectiveEndDate;
	}

	public void setEffectiveEndDate(String effectiveEndDate) {
		this.effectiveEndDate = effectiveEndDate;
	}

	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "contract_start_date")
	public Date getContractStartDate() {
		return contractStartDate;
	}
	public void setContractStartDate(Date contractStartDate) {
		this.contractStartDate = contractStartDate;
	}
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "contract_end_date")
	public Date getContractEndDate() {
		return contractEndDate;
	}
	public void setContractEndDate(Date contractEndDate) {
		this.contractEndDate = contractEndDate;
	}
	
	@Column(name = "is_manager")
	public Integer getIsManager() {
		return isManager;
	}
	public void setIsManager(Integer isManager) {
		this.isManager = isManager;
	}
	
	@Column(name = "supervisor_id")
	public Integer getSupervisorId() {
		return supervisorId;
	}
	public void setSupervisorId(Integer supervisorId) {
		this.supervisorId = supervisorId;
	}
	
	@JoinColumn(name = "grade_id")
	public Integer getGradeId() {
		return gradeId;
	}

	public void setGradeId(Integer gradeId) {
		this.gradeId = gradeId;
	}

	@JoinColumn(name = "employee_id")
	public Integer getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Integer employeeId) {
		this.employeeId = employeeId;
	}

	
	@Column(name = "referred_by_id")
	public Integer getReferredById() {
		return referredById;
	}
	public void setReferredById(Integer referredById) {
		this.referredById = referredById;
	}
	
	@Column(name = "change_reason", length = 200)
	public String getChangeReason() {
		return changeReason;
	}
	public void setChangeReason(String changeReason) {
		this.changeReason = changeReason;
	}
	
	@Column(name = "dept_id")
	public Integer getDeptId() {
		return deptId;
	}
	public void setDeptId(Integer deptId) {
		this.deptId = deptId;
	}
	
	@JoinColumn(name = "job_id")
	public Integer getJobId() {
		return jobId;
	}

	public void setJobId(Integer jobId) {
		this.jobId = jobId;
	}
	@JoinColumn(name = "location_id")
	public Integer getLocationId() {
		return locationId;
	}

	public void setLocationId(Integer locationId) {
		this.locationId = locationId;
	}

	@Column(name = "on_probation")
	public Integer getOnProbation() {
		return onProbation;
	}
	public void setOnProbation(Integer onProbation) {
		this.onProbation = onProbation;
	}
	
	@Column(name = "probation_unit", length = 50)
	public String getProbationUnit() {
		return probationUnit;
	}
	public void setProbationUnit(String probationUnit) {
		this.probationUnit = probationUnit;
	}
	
	@Column(name = "probation_unit_value")
	public Integer getProbationUnitValue() {
		return probationUnitValue;
	}
	public void setProbationUnitValue(Integer probationUnitValue) {
		this.probationUnitValue = probationUnitValue;
	}
	
	
	
	/*@Column(name = "grade_id")
	public Integer getPayGradeId() {
		return payGradeId;
	}

	public void setPayGradeId(Integer payGradeId) {
		this.payGradeId = payGradeId;
	}*/
	
	@Column(name = "probation_end_date")
	public Date getProbationEndDate() {
		return probationEndDate;
	}

	public void setProbationEndDate(Date probationEndDate) {
		this.probationEndDate = probationEndDate;
	}

	
	@Column(name = "created_by")
	public Integer getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(Integer createdBy) {
		this.createdBy = createdBy;
	}
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "creation_date")
	public Date getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}
	
	@Column(name = "last_updated_by")
	public Integer getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "last_update_date")
	public Date getLastUpdateDate() {
		return lastUpdateDate;
	}
	public void setLastUpdateDate(Date lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	
}
