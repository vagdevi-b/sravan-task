package com.osi.ems.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.activiti.engine.impl.pvm.delegate.ActivityExecution;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiWFActivities;
import com.osi.ems.repository.IOsiWFActivitiesRepository;
import com.osi.ems.service.WfActivitiesService;

@Service("wfActivitiesService")
public class WfActivitiesServiceImpl implements WfActivitiesService {
	
	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private Environment env;
	
	@Autowired
	private IOsiWFActivitiesRepository wfsActivitiesRepo;
	
	@Override
	public OsiWFActivities findById(Integer wfActivitiId) throws BusinessException {
		OsiWFActivities wfActivity = null;
		LOGGER.info("## -- findById: Begin");
		
		try {
			wfActivity = wfsActivitiesRepo.findOne(wfActivitiId);
		} catch(IllegalArgumentException e) {
			LOGGER.info("given Activity Id is NULL");
			throw new BusinessException("ERR_1015", "Invalid WfActivity Id");
		} catch(Exception e) {
			LOGGER.info("Error Occured while getting the WfActivities Info");
			throw new BusinessException("ERR_1016", "Exception in getting WfActivites Information");
		}
		LOGGER.info("## -- findById: End");
		return wfActivity;
	}

	@Override
	@Transactional(propagation=Propagation.REQUIRES_NEW)
	public void saveWfRecord(OsiWFActivities wfActivity) throws BusinessException {
		LOGGER.info("## -- saveWfRecord: Begin");
		try {
			wfsActivitiesRepo.save(wfActivity);
		} catch(Exception e) {
			LOGGER.info("Error Occured while saving the WfActivities Info");
			throw new BusinessException("ERR_1014", "Exception in saving WfActivites Information");
		}
		LOGGER.info("## -- saveWfRecord: End");		
	}
	
	@Transactional
	@Override
	public void rollBackWfRecordFlag(ActivityExecution execution) throws BusinessException {
		LOGGER.info("## -- rollBackWfRecordFlag: Begin");
		OsiWFActivities wfRecord = (OsiWFActivities) execution.getVariable("wfRecord");
		if(!wfRecord.equals(null)) {
			String processFlag = env.getProperty("ems.wf.activities.flag.initial.process");
			if(!processFlag.isEmpty()) {
				wfRecord.setProcessFlag(processFlag);
				wfsActivitiesRepo.save(wfRecord);
			} else {
				throw new BusinessException("ERR_1011", "No property found : ems.wf.activities.flag.after.process");
			}
		}
		LOGGER.info("## -- rollBackWfRecordFlag: End");
	}

	@Override
	public List<OsiWFActivities> findByProcessFlagAndObjectName(String processFlag, String objectName)
			throws BusinessException {
		List<OsiWFActivities> wfActivities = new ArrayList<>();
		LOGGER.info("## -- findByProcessFlagAndObjectName: Begin");
			try {
				wfActivities = wfsActivitiesRepo.findByProcessFlagAndObjectName(processFlag, objectName);
			} catch(Exception e) {
				LOGGER.info("Error Occurred while executing findByProcessFlagAndObjectName : "+e.getMessage());
				throw new BusinessException("ERR_1024", "Error Occurred while executing findByProcessFlagAndObjectName");
			}
			LOGGER.info("## -- findByProcessFlagAndObjectName: End");
		return wfActivities;
	}

}
