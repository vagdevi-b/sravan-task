package com.osi.activiti.exception;

/**
 * @author smanchala
 *
 */
public class BusinessException extends Exception {

	private static final long serialVersionUID = 1L;
	
	private String errorCode;
	private String systemMessage;
	
	public BusinessException(Throwable cause) {
		super(cause);
	}
	
	public String getErrorCode() {
		return errorCode;
	}
	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}
	public String getSystemMessage() {
		return systemMessage;
	}
	public void setSystemMessage(String systemMessage) {
		this.systemMessage = systemMessage;
	}
	public BusinessException(String errorCode, String systemMessage) {
		super();
		this.errorCode = errorCode;
		this.systemMessage = systemMessage;
	}

}
