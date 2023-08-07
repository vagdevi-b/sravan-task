package com.osi.ems.service.impl;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiConfigParameters;
import com.osi.ems.repository.IOsiConfigParameters;
import com.osi.ems.service.IConfigParamsService;

@Service("configParamService")
public class ConfigParamsServiceImpl implements IConfigParamsService {
	
	@Autowired
	private IOsiConfigParameters configParamRepo;

	@Override
	public List<OsiConfigParameters> findByOrgId(Integer orgId) throws BusinessException {
		List<OsiConfigParameters> configParams = null;
		try {
			configParams = configParamRepo.findByOrgId(orgId);
		} catch(Exception e) {
			throw new BusinessException("ERR_1019", "Error Occurred while executing the Get Config mails from DB");
		}
		return configParams;
	}

}
