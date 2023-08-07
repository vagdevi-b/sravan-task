package com.osi.ems.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.osi.ems.domain.OsiEmailContents;

@Repository("emailContents")
public interface IOsiEmailContentsRepo extends CrudRepository<OsiEmailContents, Integer>{
	
	OsiEmailContents findByContentNameAndOrgId(String contentName, int orgId);
}
