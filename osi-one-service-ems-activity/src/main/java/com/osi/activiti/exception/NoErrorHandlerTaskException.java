package com.osi.activiti.exception;

public class NoErrorHandlerTaskException extends NavigationException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public NoErrorHandlerTaskException(String message){
		super(message);
	}
	public NoErrorHandlerTaskException(String message, Throwable cause) {
		super(message, cause);
		// TODO Auto-generated constructor stub
	}

}
