package com.osi.ems.repository.custom.impl;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import com.osi.activiti.exception.DataAccessException;
import com.osi.ems.repository.custom.IActivitiHistoryCleanup;

@Transactional
@Repository
public class ActivitiHistoryCleanupImpl implements IActivitiHistoryCleanup {
	
	Logger LOGGER = LoggerFactory.getLogger(getClass());
	@Autowired
	private EntityManager entityManager;
	
	@Override
	public void cleanupHistory() throws DataAccessException {
		LOGGER.info(" ## Clean Up the history : Begin ");
		String cleanupByteArray = "DELETE FROM ACT_GE_BYTEARRAY WHERE id_ IN (SELECT bytearray_id_ FROM act_hi_varinst WHERE bytearray_id_ IS NOT NULL)";
		String cleanupActInst = "DELETE FROM ACT_HI_ACTINST WHERE proc_inst_id_ IN (SELECT proc_inst_id_ FROM act_hi_procinst WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL);";
		String cleanupAttachment = "DELETE FROM ACT_HI_ATTACHMENT WHERE proc_inst_id_ IN (SELECT proc_inst_id_ FROM act_hi_procinst WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL);";
		String cleanupComment = "DELETE FROM ACT_HI_COMMENT WHERE proc_inst_id_ IN (SELECT proc_inst_id_ FROM act_hi_procinst WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL);";
		String cleanupDetail = "DELETE FROM ACT_HI_DETAIL WHERE proc_inst_id_ IN (SELECT proc_inst_id_ FROM act_hi_procinst WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL);";
		String cleanupIdLink = "DELETE FROM ACT_HI_IDENTITYLINK WHERE proc_inst_id_ IN (SELECT proc_inst_id_ FROM act_hi_procinst WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL);";
		String cleanupTaskInst = "DELETE FROM ACT_HI_TASKINST WHERE proc_inst_id_ IN (SELECT proc_inst_id_ FROM act_hi_procinst WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL);";
		String cleanupVarInst = "DELETE FROM ACT_HI_VARINST WHERE proc_inst_id_ IN (SELECT proc_inst_id_ FROM act_hi_procinst WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL);";
		String cleanupProcInst = "DELETE FROM ACT_HI_PROCINST WHERE end_act_id_ IS NOT NULL or delete_reason_ IS NOT NULL;";
		try {
			entityManager.createNativeQuery(cleanupByteArray).executeUpdate();
			entityManager.createNativeQuery(cleanupActInst).executeUpdate();
			entityManager.createNativeQuery(cleanupAttachment).executeUpdate();
			entityManager.createNativeQuery(cleanupComment).executeUpdate();
			entityManager.createNativeQuery(cleanupDetail).executeUpdate();
			entityManager.createNativeQuery(cleanupIdLink).executeUpdate();
			entityManager.createNativeQuery(cleanupTaskInst).executeUpdate();
			entityManager.createNativeQuery(cleanupVarInst).executeUpdate();
			entityManager.createNativeQuery(cleanupProcInst).executeUpdate();
		} catch(Exception e) {
			throw new DataAccessException("ERR_1025", "Unable to delete the History "+e.getMessage());
		}
		LOGGER.info(" ## Clean Up the history : End ");
	}

}
