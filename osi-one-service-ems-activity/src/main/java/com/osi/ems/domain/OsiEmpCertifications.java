package com.osi.ems.domain;

import java.io.Serializable;

import javax.persistence.Column;

public class OsiEmpCertifications implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private Integer empCertificationId;
	private Integer certificationId;
	private String certificationName;
	private String certificationCode;
	private String certificationAddInfo;
	private String issuedBy;
	private boolean active;
	private Integer createdBy;
	private String createdDate;
	private String lastUpdatedDate;
	private Integer updatedBy;
	private String yearOfPass;
	private Integer attachmentId;
	private String verified;
	
	//private List<OsiAttachmentsDTO> osiEmpAttachments;
	
	public Integer getEmpCertificationId() {
		return empCertificationId;
	}
	public void setEmpCertificationId(Integer empCertificationId) {
		this.empCertificationId = empCertificationId;
	}
	
	public Integer getCertificationId() {
		return certificationId;
	}
	public void setCertificationId(Integer certificationId) {
		this.certificationId = certificationId;
	}
	public String getCertificationName() {
		return certificationName;
	}
	public void setCertificationName(String certificationName) {
		this.certificationName = certificationName;
	}
	public String getCertificationCode() {
		return certificationCode;
	}
	public void setCertificationCode(String certificationCode) {
		this.certificationCode = certificationCode;
	}
	public String getCertificationAddInfo() {
		return certificationAddInfo;
	}
	public void setCertificationAddInfo(String certificationAddInfo) {
		this.certificationAddInfo = certificationAddInfo;
	}
	public String getIssuedBy() {
		return issuedBy;
	}
	public void setIssuedBy(String issuedBy) {
		this.issuedBy = issuedBy;
	}
	public boolean isActive() {
		return active;
	}
	public void setActive(boolean active) {
		this.active = active;
	}
	public Integer getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(Integer createdBy) {
		this.createdBy = createdBy;
	}
	public String getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(String createdDate) {
		this.createdDate = createdDate;
	}
	public String getLastUpdatedDate() {
		return lastUpdatedDate;
	}
	public void setLastUpdatedDate(String lastUpdatedDate) {
		this.lastUpdatedDate = lastUpdatedDate;
	}
	public Integer getUpdatedBy() {
		return updatedBy;
	}
	public void setUpdatedBy(Integer updatedBy) {
		this.updatedBy = updatedBy;
	}
	public String getYearOfPass() {
		return yearOfPass;
	}
	public void setYearOfPass(String yearOfPass) {
		this.yearOfPass = yearOfPass;
	}
	public Integer getAttachmentId() {
		return attachmentId;
	}
	public void setAttachmentId(Integer attachmentId) {
		this.attachmentId = attachmentId;
	}
	public String getVerified() {
		return verified;
	}
	public void setVerified(String verified) {
		this.verified = verified;
	}
	
	@Override
	public String toString() {
		return "OsiEmpCertifications [certificationId=" + certificationId + ", certificationName=" + certificationName
				+ ", certificationCode=" + certificationCode + ", certificationAddInfo=" + certificationAddInfo
				+ ", issuedBy=" + issuedBy + ", active=" + active + ", createdBy=" + createdBy + ", createdDate="
				+ createdDate + ", lastUpdatedDate=" + lastUpdatedDate + ", updatedBy=" + updatedBy + ", yearOfPass="
				+ yearOfPass + ", attachmentId=" + attachmentId + ", verified=" + verified + ", empCertificationId="
				+ empCertificationId + "]";
	}

}
