package com.osi.ems.domain;

import java.io.Serializable;

public class OsiEmpSkills implements Serializable{
	
	private static final long serialVersionUID = 1L;
	
	private String skillName;
	private String lastUpdatedDate;
	private int yearOfExperience;
	private String proficiency;
	private String verified;
	private Integer skillId;
	private String skillDisplayName;
	private String skillVersion;
	private String employeeId;
	private int monthsOfExp;	
	private String createdBy;
	private String updatedBy;
	private String verifiedBy;
	private Integer empSkillId;
	private String version;
	
	private boolean active;
	
	private String lastUpdateDate;
	public String getVersion() {
		return version;
	}
	public void setVersion(String version) {
		this.version = version;
	}
	public String getVerified() {
		return verified;
	}
	public void setVerified(String verified) {
		this.verified = verified;
	}
	public Integer getEmpSkillId() {
		return empSkillId;
	}
	public void setEmpSkillId(Integer empSkillId) {
		this.empSkillId = empSkillId;
	}
	public String getVerifiedBy() {
		return verifiedBy;
	}
	public void setVerifiedBy(String verifiedBy) {
		this.verifiedBy = verifiedBy;
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public String getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(String updatedBy) {
		this.updatedBy = updatedBy;
	}
	public String getEmployeeId() {
		return employeeId;
	}
	public void setEmployeeId(String employeeId) {
		this.employeeId = employeeId;
	}
	public String getSkillDisplayName() {
		return skillDisplayName;
	}
	public void setSkillDisplayName(String skillDisplayName) {
		this.skillDisplayName = skillDisplayName;
	}
	public Integer getSkillId() {
		return skillId;
	}
	public void setSkillId(Integer skillId) {
		this.skillId = skillId;
	}
	public String getSkillName() {
		return skillName;
	}
	public void setSkillName(String skillName) {
		this.skillName = skillName;
	}
	public String getLastUpdatedDate() {
		return lastUpdatedDate;
	}
	public void setLastUpdatedDate(String lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}
	
	public int getYearOfExperience() {
		return yearOfExperience;
	}
	public void setYearOfExperience(int yearOfExperience) {
		this.yearOfExperience = yearOfExperience;
	}
	public int getMonthsOfExp() {
		return monthsOfExp;
	}
	public void setMonthsOfExp(int monthsOfExp) {
		this.monthsOfExp = monthsOfExp;
	}
	public String getProficiency() {
		return proficiency;
	}
	public void setProficiency(String proficiency) {
		this.proficiency = proficiency;
	}
	public boolean isActive() {
		return active;
	}
	public void setActive(boolean active) {
		this.active = active;
	}
	public String getSkillVersion() {
		return skillVersion;
	}
	public void setSkillVersion(String skillVersion) {
		this.skillVersion = skillVersion;
	}
	public String getLastUpdateDate() {
		return lastUpdateDate;
	}
	public void setLastUpdateDate(String lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}
	@Override
	public String toString() {
		return "OsiEmpSkills [skillName=" + skillName + ", lastUpdatedDate=" + lastUpdatedDate + ", yearOfExperience="
				+ yearOfExperience + ", proficiency=" + proficiency + ", verified=" + verified + ", skillId=" + skillId
				+ ", skillDisplayName=" + skillDisplayName + ", skillVersion=" + skillVersion + ", employeeId="
				+ employeeId + ", monthsOfExp=" + monthsOfExp + ", createdBy=" + createdBy + ", updatedBy=" + updatedBy
				+ ", verifiedBy=" + verifiedBy + ", empSkillId=" + empSkillId + ", version=" + version + ", active="
				+ active + ", lastUpdateDate=" + lastUpdateDate + "]";
	}

	
	
	
}
