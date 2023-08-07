package com.osi.ems.domain;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.persistence.Transient;

@Entity
@Table(name = "osi_wf_activities")
public class OsiWFActivities implements Serializable{

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	private Integer activityId;
	private Integer wfsId;
	private Integer objectId;
	private String objectName;
	private String error;
	private Date startDate;
	private Date actualStartDate;
	private String processFlag;
//	private Integer orgId;
	
	private String objectType;
	
	@Override
	public String toString() {
		return "OsiWFActivities [activityId=" + activityId + ", wfsId=" + wfsId + ", objectId=" + objectId
				+ ", objectName=" + objectName + ", error=" + error + ", startDate=" + startDate + ", actualStartDate="
				+ actualStartDate + ", processFlag=" + processFlag 
//				+ ", orgId=" + orgId 
				+ "]";
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "ACTIVITY_ID", unique = true, nullable = false)
	public Integer getActivityId() {
		return activityId;
	}
	public void setActivityId(Integer activityId) {
		this.activityId = activityId;
	}
	@Column(name = "WFS_ID")
	public Integer getWfsId() {
		return wfsId;
	}
	public void setWfsId(Integer wfsId) {
		this.wfsId = wfsId;
	}
	@Column(name = "OBJECT_ID")
	public Integer getObjectId() {
		return objectId;
	}
	public void setObjectId(Integer objectId) {
		this.objectId = objectId;
	}
	@Column(name = "OBJECT_NAME")
	public String getObjectName() {
		return objectName;
	}
	public void setObjectName(String objectName) {
		this.objectName = objectName;
	}
	@Column(name = "ERROR")
	public String getError() {
		return error;
	}
	public void setError(String error) {
		this.error = error;
	}
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "START_DATE")
	public Date getStartDate() {
		return startDate;
	}
	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "ACTUAL_START_DATE")
	public Date getActualStartDate() {
		return actualStartDate;
	}
	public void setActualStartDate(Date actualStartDate) {
		this.actualStartDate = actualStartDate;
	}
	@Column(name = "PROCESS_FLAG")
	public String getProcessFlag() {
		return processFlag;
	}
	public void setProcessFlag(String processFlag) {
		this.processFlag = processFlag;
	}
	/*@Column(name = "ORG_ID")
	public Integer getOrgId() {
		return orgId;
	}
	public void setOrgId(Integer orgId) {
		this.orgId = orgId;
	}*/
	@Transient
	public String getObjectType() {
		return objectType;
	}

	public void setObjectType(String objectType) {
		this.objectType = objectType;
	}
}
