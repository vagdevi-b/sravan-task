package com.osi.activiti.exception;

public class NoTransitionFoundException extends NavigationException {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	public NoTransitionFoundException(String message) {
		super(message);
	}

	public NoTransitionFoundException(String message, Throwable cause) {
		super(message, cause);
	}

}
