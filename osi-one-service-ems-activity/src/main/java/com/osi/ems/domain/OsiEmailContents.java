package com.osi.ems.domain;

import static javax.persistence.GenerationType.IDENTITY;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="osi_email_contents")
public class OsiEmailContents implements Serializable {
	
	private static final long serialVersionUID = 1L;
	
	private Integer contentId;
	private String contentName;
	private String contentSubject;
	private String contentBody;
	private Integer orgId;
	
	@Id
	@GeneratedValue(strategy = IDENTITY)
	@Column(name = "CONTENT_ID", unique = true, nullable = false)
	public Integer getContentId() {
		return contentId;
	}
	public void setContentId(Integer contentId) {
		this.contentId = contentId;
	}
	@Column(name = "CONTENT_NAME")
	public String getContentName() {
		return contentName;
	}
	public void setContentName(String contentName) {
		this.contentName = contentName;
	}
	@Column(name = "CONTENT_SUBJECT")
	public String getContentSubject() {
		return contentSubject;
	}
	public void setContentSubject(String contentSubject) {
		this.contentSubject = contentSubject;
	}
	@Column(name = "CONTENT_BODY")
	public String getContentBody() {
		return contentBody;
	}
	public void setContentBody(String contentBody) {
		this.contentBody = contentBody;
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
		return "OsiEmailContents [contentId=" + contentId + ", contentName=" + contentName + ", contentSubject="
				+ contentSubject + ", contentBody=" + contentBody + ", orgId=" + orgId + "]";
	}

}
