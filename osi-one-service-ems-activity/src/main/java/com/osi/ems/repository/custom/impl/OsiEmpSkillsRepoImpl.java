package com.osi.ems.repository.custom.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmpSkills;
import com.osi.ems.repository.custom.IOsiEmpSkills;

@Repository("empSkillsRepo")
public class OsiEmpSkillsRepoImpl implements IOsiEmpSkills {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@PersistenceContext
	private EntityManager entityManager;
	
	@Override
	public List<OsiEmpSkills> getUnverifiedSkills(Integer employeeId) throws DataAccessException {
		LOGGER.info("## -- OsiEmpSkillsRepoImpl : getUnverifiedSkills -- Begin");
		List<OsiEmpSkills> unverifiedSkillsList = new ArrayList<OsiEmpSkills>();
		try {
			String getUnverifiedSkills = "select es.emp_skill_id,s.skill_id, s.skill_name "
					+ "from osi_emp_skills es "
					+ "left join osi_skils s on s.skill_id = es.skill_id "
					+ "where es.is_verified = 0 and es.employee_id = ?1";
			@SuppressWarnings("unchecked")
			List<Object[]> unverifiedSkills = this.entityManager.createNativeQuery(getUnverifiedSkills)
													.setParameter(1, employeeId)
													.getResultList();			
			/*if(unverifiedCerts.size() != 0)
				unverifiedCertList = new ArrayList<OsiEmpCertifications>();*/
			for(Object[] skillObj : unverifiedSkills) {
				OsiEmpSkills certificate = new OsiEmpSkills();
				certificate.setEmpSkillId(skillObj[0] != null ? Integer.parseInt(skillObj[0].toString()) : null);
				certificate.setSkillId(skillObj[1] != null ? Integer.parseInt(skillObj[1].toString()) : null);
				if(skillObj[2] != null) 				
					certificate.setSkillName(((String) skillObj[2]));
				unverifiedSkillsList.add(certificate);
			}
				
		} catch(Exception e) {
			LOGGER.error("## -- Error occured while fetching UnverifiedCertifications");
			throw new DataAccessException("ERR_1005", "Exception in getting Unverified Certificates");
		}
		LOGGER.info("## -- OsiEmpSkillsRepoImpl : getUnverifiedSkills -- End");
		return unverifiedSkillsList;
	}

}
