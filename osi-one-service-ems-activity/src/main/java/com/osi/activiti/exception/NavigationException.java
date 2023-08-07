package com.osi.activiti.exception;

/**
 * 
 * @author smanchala
 *
 */
public class NavigationException extends Exception {

	private static final long serialVersionUID = 1L;

	public NavigationException(Throwable cause) {
		super(cause);
	}

	public NavigationException(String message) {
		super(message);
	}

	public NavigationException(String message, Throwable cause) {
		super(message, cause);
	}

}
