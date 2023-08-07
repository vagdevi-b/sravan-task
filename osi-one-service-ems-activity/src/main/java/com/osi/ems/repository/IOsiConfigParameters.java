package com.osi.ems.repository;

import java.util.List;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.osi.ems.domain.OsiConfigParameters;

@Repository("configParamRepo")
public interface IOsiConfigParameters extends CrudRepository<OsiConfigParameters, Integer> {

	List<OsiConfigParameters> findByOrgId(Integer orgId);
}
