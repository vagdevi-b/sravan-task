package com.osi.activiti.exception;

/**
 * @author rdonepudi
 *
 */
public class DataAccessException extends Exception {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String errorCode;
	private String systemMessage;
	private Throwable throwable;

	public String getErrorCode() {
		return errorCode;
	}

	public void setErrorCode(String errorCode) {
		this.errorCode = errorCode;
	}

	public Throwable getThrowable() {
		return throwable;
	}

	public void setThrowable(Throwable throwable) {
		this.throwable = throwable;
	}

	public String getSystemMessage() {
		return systemMessage;
	}

	public void setSystemMessage(String systemMessage) {
		this.systemMessage = systemMessage;
	}

	public DataAccessException(String errorCode, String systemMessage) {
		super();
		this.errorCode = errorCode;
		this.systemMessage = systemMessage;
	}

	public DataAccessException(String errorCode, String systemMessage, Throwable throwable) {
		super();
		this.errorCode = errorCode;
		this.systemMessage = systemMessage;
		this.throwable = throwable;
	}
}
