package com.osi.ems.service;

import java.util.List;

import com.osi.activiti.exception.BusinessException;
import com.osi.ems.domain.OsiConfigParameters;

public interface IConfigParamsService {

	List<OsiConfigParameters> findByOrgId(Integer orgId) throws BusinessException;
}
