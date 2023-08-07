package com.osi.activiti.rest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.osi.activiti.service.ProcessStartService;

@RequestMapping("rest")
@RestController
public class ProcessStartRestController {
	
	private final Logger LOGGER = LoggerFactory
			.getLogger(ProcessStartRestController.class);

	@Autowired
	private ProcessStartService processStartService;
	
	@RequestMapping(value = "/greetings", method = RequestMethod.GET)
	public void startProcessInstance() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startProcess();
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
	@RequestMapping(value = "/remaindIncompletePersonlaInfo", method = RequestMethod.GET)
	public void startProcessInstanceForPersonalRemainder() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startRemainderProcess("personal");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
	
	@RequestMapping(value = "/remaindIncompleteMedicalInfo", method = RequestMethod.GET)
	public void startProcessInstanceForMedicalRemainder() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startRemainderProcess("medical");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
	
	@RequestMapping(value = "/remaindIncompleteEmergencyInfo", method = RequestMethod.GET)
	public void startProcessInstanceForEmergencyRemainder() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startRemainderProcess("emergency");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
	
	@RequestMapping(value = "/remaindIncompletePassportInfo", method = RequestMethod.GET)
	public void startProcessInstanceForPassportRemainder() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startRemainderProcess("passport");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
	
	@RequestMapping(value = "/remaindIncompleteSkillsInfo", method = RequestMethod.GET)
	public void startProcessInstanceForSkillsRemainder() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startRemainderProcess("skills");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
	
	@RequestMapping(value = "/remaindIncompleteCertificationsInfo", method = RequestMethod.GET)
	public void startProcessInstanceForCertificationsRemainder() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startRemainderProcess("certifications");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
	
	@RequestMapping(value = "/remainderToHR", method = RequestMethod.GET)
	public void startProcessInstanceForHRRemainder() {
		LOGGER.info("###### Start : ProcessStartRestController");
		try {
			processStartService.startRemainderProcess("unverifiedRecords");
		} catch (Exception e) {
			e.printStackTrace();
		}
		LOGGER.info("###### End : ProcessStartRestController");
	}
}
