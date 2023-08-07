package com.osi.ems.domain;

import java.io.Serializable;

public class ConfigMails implements Serializable {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public String hrMail;
	public String itMail;
	public String pmoMail;
	public String financeMail;
	public String adminMail;
	public String serviceURL;
	public String[] dlLists;
	
	public String getHrMail() {
		return hrMail;
	}
	public void setHrMail(String hrMail) {
		this.hrMail = hrMail;
	}
	public String getItMail() {
		return itMail;
	}
	public void setItMail(String itMail) {
		this.itMail = itMail;
	}
	public String getPmoMail() {
		return pmoMail;
	}
	public void setPmoMail(String pmoMail) {
		this.pmoMail = pmoMail;
	}
	public String getFinanceMail() {
		return financeMail;
	}
	public void setFinanceMail(String financeMail) {
		this.financeMail = financeMail;
	}
	public String getAdminMail() {
		return adminMail;
	}
	public void setAdminMail(String adminMail) {
		this.adminMail = adminMail;
	}
	public String getServiceURL() {
		return serviceURL;
	}
	public void setServiceURL(String serviceURL) {
		this.serviceURL = serviceURL;
	}
	public String[] getDlLists() {
		return dlLists;
	}
	public void setDlLists(String[] dlLists) {
		this.dlLists = dlLists;
	}
}
