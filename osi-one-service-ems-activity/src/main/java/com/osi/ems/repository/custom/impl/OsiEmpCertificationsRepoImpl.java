package com.osi.ems.repository.custom.impl;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.domain.OsiEmpCertifications;
import com.osi.ems.repository.custom.IOsiEmpCertifications;

@Repository("empCertificationsRepo")
public class OsiEmpCertificationsRepoImpl implements IOsiEmpCertifications {

	private final Logger LOGGER = LoggerFactory.getLogger(getClass());
	
	@PersistenceContext
	private EntityManager entityManager;
	
	@Override
	public List<OsiEmpCertifications> getUnverifiedCertifications(Integer employeeId) throws DataAccessException {
		LOGGER.info("## -- OsiEmpCertificationsImpl:getUnverifiedCertifications -- Begin");
		List<OsiEmpCertifications> unverifiedCertList = new ArrayList<OsiEmpCertifications>();
		try {
			String getUnverifiedCerts = "select ec.emp_certification_id,c.cert_id, c.cert_name "
					+ " from osi_emp_certifications ec "
					+ " left join osi_certifications c on c.cert_id = ec.certification_id "
					+ " where ec.is_verified = 0 and ec.employee_id = ?1";
			@SuppressWarnings("unchecked")
			List<Object[]> unverifiedCerts = this.entityManager.createNativeQuery(getUnverifiedCerts)
													.setParameter(1, employeeId)
													.getResultList();			
			/*if(unverifiedCerts.size() != 0)
				unverifiedCertList = new ArrayList<OsiEmpCertifications>();*/
			for(Object[] certObj : unverifiedCerts) {
				OsiEmpCertifications certificate = new OsiEmpCertifications();
				certificate.setCertificationId(certObj[0] != null ? Integer.parseInt(certObj[0].toString()) : null);
				certificate.setEmpCertificationId(certObj[1] != null ? Integer.parseInt(certObj[1].toString()) : null);
				if(certObj[2] != null) 				
					certificate.setCertificationName(((String) certObj[2]));
				unverifiedCertList.add(certificate);
			}
				
		} catch(Exception e) {
			LOGGER.error("## -- Error occured while fetching UnverifiedCertifications");
			throw new DataAccessException("ERR_1017", "Exception in getting Unverified Certificates");
		}
		LOGGER.info("## -- OsiEmpCertificationsImpl:getUnverifiedCertifications -- End");
		return unverifiedCertList;
	}

}
