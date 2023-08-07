package com.osi.ems.domain;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "osi_config_parameters")
public class OsiConfigParameters implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private Integer configId;
	private String configName;
	private String configValue;
	private Integer orgId;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "CONFIG_ID", unique = true, nullable = false)
	public Integer getConfigId() {
		return configId;
	}
	public void setConfigId(Integer configId) {
		this.configId = configId;
	}
	@Column(name = "CONFIG_NAME")
	public String getConfigName() {
		return configName;
	}
	public void setConfigName(String configName) {
		this.configName = configName;
	}
	@Column(name = "CONFIG_VALUE")
	public String getConfigValue() {
		return configValue;
	}
	public void setConfigValue(String configValue) {
		this.configValue = configValue;
	}
	@Column(name = "ORG_ID")
	public Integer getOrgId() {
		return orgId;
	}
	public void setOrgId(Integer orgId) {
		this.orgId = orgId;
	}
	
	@Override
	public String toString() {
		return "OsiConfigParameters [configId=" + configId + ", configName=" + configName + ", configValue="
				+ configValue + ", orgId=" + orgId + "]";
	}

}
