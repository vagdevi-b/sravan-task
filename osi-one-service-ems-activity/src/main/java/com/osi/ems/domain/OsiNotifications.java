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

@Entity
@Table(name = "osi_activity_notifications")
public class OsiNotifications implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	
	private Integer notificationId;
	private Integer orgId;
	private Integer notificationEmpId;
	private Date notificationDate;
	@Column(name = "object_id")
	private String notificationObjectId;
	@Column(name = "object_type")
	private String notificationObject;
	private String notificationUrl;
	private String notificationStatus;	
	private Date notificationActionDate;
	private String notificationAction;
	private String dlList;
	private Integer noOfTimesAsOfNow;
	private String comments;
	
	@Override
	public String toString() {
		return "OsiNotifications [notificationId=" + notificationId + ", orgId=" + orgId + ", notificationEmpId="
				+ notificationEmpId + ", notificationDate=" + notificationDate + ", notificationObjectId="
				+ notificationObjectId + ", notificationObject=" + notificationObject + ", notificationUrl="
				+ notificationUrl + ", notificationStatus=" + notificationStatus + ", notificationActionDate="
				+ notificationActionDate + ", notificationAction=" + notificationAction + ", dlList=" + dlList
				+ ", noOfTimesAsOfNow=" + noOfTimesAsOfNow + ", comments=" + comments + "]";
	}
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "NOTIFICATION_ID", unique = true, nullable = false)
	public Integer getNotificationId() {
		return notificationId;
	}
	public void setNotificationId(Integer notificationId) {
		this.notificationId = notificationId;
	}
	@Column(name = "ORG_ID")
	public Integer getOrgId() {
		return orgId;
	}
	public void setOrgId(Integer orgId) {
		this.orgId = orgId;
	}
	@Column(name = "NOTIFICATION_EMP_ID")
	public Integer getNotificationEmpId() {
		return notificationEmpId;
	}
	public void setNotificationEmpId(Integer notificationEmpId) {
		this.notificationEmpId = notificationEmpId;
	}
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "NOTIFICATION_DATE")
	public Date getNotificationDate() {
		return notificationDate;
	}
	public void setNotificationDate(Date notificationDate) {
		this.notificationDate = notificationDate;
	}
	@Column(name = "OBJECT_ID")
	public String getNotificationObjectId() {
		return notificationObjectId;
	}
	public void setNotificationObjectId(String notificationObjectId) {
		this.notificationObjectId = notificationObjectId;
	}
	@Column(name = "OBJECT_TYPE")
	public String getNotificationObject() {
		return notificationObject;
	}
	public void setNotificationObject(String notificationObject) {
		this.notificationObject = notificationObject;
	}
	@Column(name = "NOTIFICATION_URL")
	public String getNotificationUrl() {
		return notificationUrl;
	}
	public void setNotificationUrl(String notificationUrl) {
		this.notificationUrl = notificationUrl;
	}
	@Column(name = "NOTIFICATION_STATUS")
	public String getNotificationStatus() {
		return notificationStatus;
	}
	public void setNotificationStatus(String notificationStatus) {
		this.notificationStatus = notificationStatus;
	}
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name = "NOTIFICATION_ACTION_DATE")
	public Date getNotificationActionDate() {
		return notificationActionDate;
	}
	public void setNotificationActionDate(Date notificationActionDate) {
		this.notificationActionDate = notificationActionDate;
	}
	@Column(name = "NOTIFICATION_ACTION")
	public String getNotificationAction() {
		return notificationAction;
	}
	public void setNotificationAction(String notificationAction) {
		this.notificationAction = notificationAction;
	}
	@Column(name = "DL_LIST")
	public String getDlList() {
		return dlList;
	}
	public void setDlList(String dlList) {
		this.dlList = dlList;
	}
	@Column(name = "NO_OF_TIMES_AS_OF_NOW")
	public Integer getNoOfTimesAsOfNow() {
		return noOfTimesAsOfNow;
	}
	public void setNoOfTimesAsOfNow(Integer noOfTimesAsOfNow) {
		this.noOfTimesAsOfNow = noOfTimesAsOfNow;
	}
	@Column(name = "COMMENTS")
	public String getComments() {
		return comments;
	}
	public void setComments(String comments) {
		this.comments = comments;
	}
}
