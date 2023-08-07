package com.osi.ems.domain;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "osi_work_flows")
public class OsiWorkFlows implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private Integer wfsId;
	private String activityName;
	private Integer startOrStop;
	private String cornExpression;
	private String activityType;
	private Integer frequency;
	private Integer noOfTimes;
	private Integer sleepInterval;
	private Integer orgId;
	@Override
	public String toString() {
		return "OsiWorkFlows [wfsId=" + wfsId + ", activityName=" + activityName + ", startOrStop=" + startOrStop
				+ ", cornExpression=" + cornExpression + ", activityType=" + activityType + ", frequency=" + frequency
				+ ", noOfTimes=" + noOfTimes + ", sleepInterval=" + sleepInterval + ", orgId=" + orgId + "]";
	}
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "WFS_ID", unique = true, nullable = false)
	public Integer getWfsId() {
		return wfsId;
	}
	public void setWfsId(Integer wfsId) {
		this.wfsId = wfsId;
	}
	@Column(name = "ACTIVITY_NAME")
	public String getActivityName() {
		return activityName;
	}
	public void setActivityName(String activityName) {
		this.activityName = activityName;
	}
	@Column(name = "START_OR_STOP")
	public Integer getStartOrStop() {
		return startOrStop;
	}
	public void setStartOrStop(Integer startOrStop) {
		this.startOrStop = startOrStop;
	}
	@Column(name = "CRON_EXPRESSION")
	public String getCornExpression() {
		return cornExpression;
	}
	public void setCornExpression(String cornExpression) {
		this.cornExpression = cornExpression;
	}
	@Column(name = "ACTIVITY_TYPE")
	public String getActivityType() {
		return activityType;
	}
	public void setActivityType(String activityType) {
		this.activityType = activityType;
	}
	@Column(name = "FREQUENCY")
	public Integer getFrequency() {
		return frequency;
	}
	public void setFrequency(Integer frequency) {
		this.frequency = frequency;
	}
	@Column(name = "NO_OF_TIMES")
	public Integer getNoOfTimes() {
		return noOfTimes;
	}
	public void setNoOfTimes(Integer noOfTimes) {
		this.noOfTimes = noOfTimes;
	}
	@Column(name = "SLEEP_INTERVAL")
	public Integer getSleepInterval() {
		return sleepInterval;
	}
	public void setSleepInterval(Integer sleepInterval) {
		this.sleepInterval = sleepInterval;
	}
	@Column(name = "ORG_ID")
	public Integer getOrgId() {
		return orgId;
	}
	public void setOrgId(Integer orgId) {
		this.orgId = orgId;
	}

}
