package com.osi.ems.domain;

import java.io.Serializable;

/**
 * 
 * The class is for managing the OsiEmployees details.
 * 
 * @author smanchala
 *
 */
public class OsiEmployees implements Serializable {

	/**
	 * The serial version uid is for identifying this class while serializing this
	 * object.
	 */
	private static final long serialVersionUID = 1L;
	
	/**
	 * The employeeId is for identifying the each object.
	 */
	private Integer employeeId;
	
	/**
	 * The employeeNumber is for taking the employee unique number.
	 */
	private String employeeNumber;
	/**
	 * The firstName is for taking the employee first name.
	 */
	private String firstName;
	/**
	 * The lastName is for taking the employee last name.
	 */
	private String lastName;
	/**
	 * The middleName is for taking the employee middle name.
	 */
	private	String middleName;
	/**
	 * The fullName is for taking the employee full name.
	 */
	private String fullName;
	/**
	 * The title is for taking the employee title name.
	 */
	private String title;
	/**
	 * The suffix is for taking the employee suffix.
	 */
	private String suffix;
	/**
	 * The prefix is for taking the employee prefix.
	 */
	private String prefix;
	/**
	 * The employeeType is for taking the employee employeeType.
	 */
	private String employeeType;
	private String applicantNumber;
	private String dateOfBirth;
	private String startDate;
	private String effectiveStartDate;
	private String effectiveEndDate;
	private String terminationDate;
	private Integer orgId;
	private String bloodType;
	private Integer backgroundCheckStatus;
	private String backgroundDateCheck;
	private String correspondenceLanguage;
	private String officeEmail;
	private String personalEmail;
	private Integer expenseCheckSendToAddressId;
	private Integer fteCapacity;
	private String holdApplicantDateUntil;
	private String mailStop;
	private String knownAs;
	private String lastMedicalTestDate;
	private String lastMedicalTestBy;
	private String nationality;
	private String maritalStatus;
	private String nationalIdentifier;
	private Integer onMilitaryService;
	private String previousLastName;
	private String rehireReason;
	private String rehireRecommendation;
	private Integer resumeExists;
	private String resumeLastUpdated;
	private Integer resumeId;
	private Integer secondPassportExists;
	private String gender;
	private Integer workScheduleId;
	private String receiptOfDeathCertDate;
	private Integer usesTobaccoFlag;
	private Integer photoId;
	private String dateOfDeath;
	private String originalDateOfHire;
	private String passportNumber;
	private String passportDateOfIssue;
	private String passportDateOfExpiry;
	private String passportIssuanceAuthority;
	private String passportPlaceOfIssue;
	private Integer mailAddressId;
	private Integer permanentAddressId;
	private Integer version;
	private String Attribute1;
	private String Attribute2;
	private String Attribute3;
	private String Attribute4;
	private String Attribute5;
	private String Attribute6;
	private String Attribute7;
	private String Attribute8;
	private String Attribute9;
	private String Attribute10;
	private String Attribute11;
	private String Attribute12;
	private String Attribute13;
	private String Attribute14;
	private String Attribute15;
	private String Attribute16;
	private String Attribute17;
	private String Attribute18;
	private String Attribute19;
	private String Attribute20;
	private String Attribute21;
	private String Attribute22;
	private String Attribute23;
	private String Attribute24;
	private String Attribute25;
	private Integer createdBy;
	private String creationDate;
	private Integer lastUpdatedBy;
	private String lastUpdateDate;
	private Integer attachmentId;
	/*private OsiContacts osiEmployeeContacts;
	
	private List<OsiAttachmentsDTO> osiEmpAttachments;
	private OsiOrganizationsDTO OsiOrganizationsDTO;
	private List<OsiEmpVisaDetailsDTO> osiEmpVisaDetails;*/
	private Integer isManager;
	private Integer supervisorId;
	private String supervisorName;
	private String supervisorMail;
	private String contactNumber;
	private String systemType;
	private String locationName;
	private String departmentName;
	private String userName;
	private String serialNumber;
	private String probEndDate;
	private String grade;
	private Integer employeeStatus;
	private String orgName;
	
	private Double totalExp;
	
	private String jobName;
		
	private Integer isProxyEnabled;//is_proxy_enabled
	private Integer isProxyRestricted;//is_proxy_restricted
	
	@Override
	public String toString() {
		return "OsiEmployees [employeeId=" + employeeId + ", employeeNumber=" + employeeNumber + ", firstName="
				+ firstName + ", lastName=" + lastName + ", middleName=" + middleName + ", fullName=" + fullName
				+ ", title=" + title + ", suffix=" + suffix + ", prefix=" + prefix + ", employeeType=" + employeeType
				+ ", applicantNumber=" + applicantNumber + ", dateOfBirth=" + dateOfBirth + ", startDate=" + startDate
				+ ", terminationDate=" + terminationDate + ", effectiveStartDate=" + effectiveStartDate + ", effectiveEndDate=" + effectiveEndDate + ", orgId="
				+ orgId + ", bloodType=" + bloodType + ", backgroundCheckStatus=" + backgroundCheckStatus
				+ ", backgroundDateCheck=" + backgroundDateCheck + ", correspondenceLanguage=" + correspondenceLanguage
				+ ", officeEmail=" + officeEmail + ", personalEmail=" + personalEmail + ", expenseCheckSendToAddressId="
				+ expenseCheckSendToAddressId + ", fteCapacity=" + fteCapacity + ", holdApplicantDateUntil="
				+ holdApplicantDateUntil + ", mailStop=" + mailStop + ", knownAs=" + knownAs + ", lastMedicalTestDate="
				+ lastMedicalTestDate + ", lastMedicalTestBy=" + lastMedicalTestBy + ", nationality=" + nationality
				+ ", maritalStatus=" + maritalStatus + ", nationalIdentifier=" + nationalIdentifier
				+ ", onMilitaryService=" + onMilitaryService + ", previousLastName=" + previousLastName
				+ ", rehireReason=" + rehireReason + ", rehireRecommendation=" + rehireRecommendation
				+ ", resumeExists=" + resumeExists + ", resumeLastUpdated=" + resumeLastUpdated + ", resumeId="
				+ resumeId + ", secondPassportExists=" + secondPassportExists + ", gender=" + gender
				+ ", workScheduleId=" + workScheduleId + ", receiptOfDeathCertDate=" + receiptOfDeathCertDate
				+ ", usesTobaccoFlag=" + usesTobaccoFlag + ", photoId=" + photoId + ", dateOfDeath=" + dateOfDeath
				+ ", originalDateOfHire=" + originalDateOfHire + ", passportNumber=" + passportNumber
				+ ", passportDateOfIssue=" + passportDateOfIssue + ", passportDateOfExpiry=" + passportDateOfExpiry
				+ ", passportIssuanceAuthority=" + passportIssuanceAuthority + ", passportPlaceOfIssue="
				+ passportPlaceOfIssue + ", mailAddressId=" + mailAddressId + ", permanentAddressId="
				+ permanentAddressId + ", version=" + version + ", Attribute1=" + Attribute1 + ", Attribute2="
				+ Attribute2 + ", Attribute3=" + Attribute3 + ", Attribute4=" + Attribute4 + ", Attribute5="
				+ Attribute5 + ", Attribute6=" + Attribute6 + ", Attribute7=" + Attribute7 + ", Attribute8="
				+ Attribute8 + ", Attribute9=" + Attribute9 + ", Attribute10=" + Attribute10 + ", Attribute11="
				+ Attribute11 + ", Attribute12=" + Attribute12 + ", Attribute13=" + Attribute13 + ", Attribute14="
				+ Attribute14 + ", Attribute15=" + Attribute15 + ", Attribute16=" + Attribute16 + ", Attribute17="
				+ Attribute17 + ", Attribute18=" + Attribute18 + ", Attribute19=" + Attribute19 + ", Attribute20="
				+ Attribute20 + ", Attribute21=" + Attribute21 + ", Attribute22=" + Attribute22 + ", Attribute23="
				+ Attribute23 + ", Attribute24=" + Attribute24 + ", Attribute25=" + Attribute25 + ", createdBy="
				+ createdBy + ", creationDate=" + creationDate + ", lastUpdatedBy=" + lastUpdatedBy
				+ ", lastUpdateDate=" + lastUpdateDate + ", attachmentId=" + attachmentId  
				+ ", jobName=" + jobName +"]";
	}
	
	public OsiEmployees() {
		
	}

	public OsiEmployees(Integer employeeId, String employeeNumber, String firstName, String lastName, String middleName,
			String fullName, String title, String suffix, String prefix, String employeeType, String applicantNumber,
			String dateOfBirth, String startDate, String terminationDate, String effectiveStartDate, String effectiveEndDate, Integer orgId,
			String bloodType, Integer backgroundCheckStatus, String backgroundDateCheck, String correspondenceLanguage,
			String officeEmail, String personalEmail, Integer expenseCheckSendToAddressId, Integer fteCapacity,
			String holdApplicantDateUntil, String mailStop, String knownAs, String lastMedicalTestDate,
			String lastMedicalTestBy, String nationality, String maritalStatus, String nationalIdentifier,
			Integer onMilitaryService, String previousLastName, String rehireReason, String rehireRecommendation,
			Integer resumeExists, String resumeLastUpdated, Integer resumeId, Integer secondPassportExists,
			String gender, Integer workScheduleId, String receiptOfDeathCertDate, Integer usesTobaccoFlag,
			Integer photoId, String dateOfDeath, String originalDateOfHire, String passportNumber,
			String passportDateOfIssue, String passportDateOfExpiry, String passportIssuanceAuthority,
			String passportPlaceOfIssue, Integer mailAddressId, Integer permanentAddressId, Integer version,
			String attribute1, String attribute2, String attribute3, String attribute4, String attribute5,
			String attribute6, String attribute7, String attribute8, String attribute9, String attribute10,
			String attribute11, String attribute12, String attribute13, String attribute14, String attribute15,
			String attribute16, String attribute17, String attribute18, String attribute19, String attribute20,
			String attribute21, String attribute22, String attribute23, String attribute24, String attribute25,
			Integer createdBy, String creationDate, Integer lastUpdatedBy, String lastUpdateDate,
			Integer attachmentId, String jobName /*,OsiContacts osiEmployeeContacts*/) {
		super();
		this.employeeId = employeeId;
		this.employeeNumber = employeeNumber;
		this.firstName = firstName;
		this.lastName = lastName;
		this.middleName = middleName;
		this.fullName = fullName;
		this.title = title;
		this.suffix = suffix;
		this.prefix = prefix;
		this.employeeType = employeeType;
		this.applicantNumber = applicantNumber;
		this.dateOfBirth = dateOfBirth;
		this.startDate = startDate;
		this.terminationDate=terminationDate;
		this.effectiveStartDate = effectiveStartDate;
		this.effectiveEndDate = effectiveEndDate;
		this.orgId = orgId;
		this.bloodType = bloodType;
		this.backgroundCheckStatus = backgroundCheckStatus;
		this.backgroundDateCheck = backgroundDateCheck;
		this.correspondenceLanguage = correspondenceLanguage;
		this.officeEmail = officeEmail;
		this.personalEmail = personalEmail;
		this.expenseCheckSendToAddressId = expenseCheckSendToAddressId;
		this.fteCapacity = fteCapacity;
		this.holdApplicantDateUntil = holdApplicantDateUntil;
		this.mailStop = mailStop;
		this.knownAs = knownAs;
		this.lastMedicalTestDate = lastMedicalTestDate;
		this.lastMedicalTestBy = lastMedicalTestBy;
		this.nationality = nationality;
		this.maritalStatus = maritalStatus;
		this.nationalIdentifier = nationalIdentifier;
		this.onMilitaryService = onMilitaryService;
		this.previousLastName = previousLastName;
		this.rehireReason = rehireReason;
		this.rehireRecommendation = rehireRecommendation;
		this.resumeExists = resumeExists;
		this.resumeLastUpdated = resumeLastUpdated;
		this.resumeId = resumeId;
		this.secondPassportExists = secondPassportExists;
		this.gender = gender;
		this.workScheduleId = workScheduleId;
		this.receiptOfDeathCertDate = receiptOfDeathCertDate;
		this.usesTobaccoFlag = usesTobaccoFlag;
		this.photoId = photoId;
		this.dateOfDeath = dateOfDeath;
		this.originalDateOfHire = originalDateOfHire;
		this.passportNumber = passportNumber;
		this.passportDateOfIssue = passportDateOfIssue;
		this.passportDateOfExpiry = passportDateOfExpiry;
		this.passportIssuanceAuthority = passportIssuanceAuthority;
		this.passportPlaceOfIssue = passportPlaceOfIssue;
		this.mailAddressId = mailAddressId;
		this.permanentAddressId = permanentAddressId;
		this.version = version;
		Attribute1 = attribute1;
		Attribute2 = attribute2;
		Attribute3 = attribute3;
		Attribute4 = attribute4;
		Attribute5 = attribute5;
		Attribute6 = attribute6;
		Attribute7 = attribute7;
		Attribute8 = attribute8;
		Attribute9 = attribute9;
		Attribute10 = attribute10;
		Attribute11 = attribute11;
		Attribute12 = attribute12;
		Attribute13 = attribute13;
		Attribute14 = attribute14;
		Attribute15 = attribute15;
		Attribute16 = attribute16;
		Attribute17 = attribute17;
		Attribute18 = attribute18;
		Attribute19 = attribute19;
		Attribute20 = attribute20;
		Attribute21 = attribute21;
		Attribute22 = attribute22;
		Attribute23 = attribute23;
		Attribute24 = attribute24;
		Attribute25 = attribute25;
		this.createdBy = createdBy;
		this.creationDate = creationDate;
		this.lastUpdatedBy = lastUpdatedBy;
		this.lastUpdateDate = lastUpdateDate;
		this.attachmentId = attachmentId;
		this.jobName = jobName;
		//this.osiEmployeeContacts = osiEmployeeContacts;
	}

	public Integer getEmployeeId() {
		return employeeId;
	}

	public void setEmployeeId(Integer employeeId) {
		this.employeeId = employeeId;
	}

	public String getEmployeeNumber() {
		return employeeNumber;
	}

	public void setEmployeeNumber(String employeeNumber) {
		this.employeeNumber = employeeNumber;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getMiddleName() {
		return middleName;
	}

	public void setMiddleName(String middleName) {
		this.middleName = middleName;
	}

	public String getFullName() {
		return fullName;
	}

	public void setFullName(String fullName) {
		this.fullName = fullName;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getSuffix() {
		return suffix;
	}

	public void setSuffix(String suffix) {
		this.suffix = suffix;
	}

	public String getPrefix() {
		return prefix;
	}

	public void setPrefix(String prefix) {
		this.prefix = prefix;
	}

	public String getEmployeeType() {
		return employeeType;
	}

	public void setEmployeeType(String employeeType) {
		this.employeeType = employeeType;
	}

	public String getApplicantNumber() {
		return applicantNumber;
	}

	public void setApplicantNumber(String applicantNumber) {
		this.applicantNumber = applicantNumber;
	}

	public String getDateOfBirth() {
		return dateOfBirth;
	}

	public void setDateOfBirth(String dateOfBirth) {
		this.dateOfBirth = dateOfBirth;
	}

	public String getStartDate() {
		return startDate;
	}

	public void setStartDate(String startDate) {
		this.startDate = startDate;
	}

	public String getEffectiveStartDate() {
		return effectiveStartDate;
	}

	public void setEffectiveStartDate(String effectiveStartDate) {
		this.effectiveStartDate = effectiveStartDate;
	}

	public String getEffectiveEndDate() {
		return effectiveEndDate;
	}

	public void setEffectiveEndDate(String effectiveEndDate) {
		this.effectiveEndDate = effectiveEndDate;
	}

	public Integer getOrgId() {
		return orgId;
	}

	public void setOrgId(Integer orgId) {
		this.orgId = orgId;
	}

	public String getBloodType() {
		return bloodType;
	}

	public void setBloodType(String bloodType) {
		this.bloodType = bloodType;
	}

	public Integer getBackgroundCheckStatus() {
		return backgroundCheckStatus;
	}

	public void setBackgroundCheckStatus(Integer backgroundCheckStatus) {
		this.backgroundCheckStatus = backgroundCheckStatus;
	}

	public String getBackgroundDateCheck() {
		return backgroundDateCheck;
	}

	public void setBackgroundDateCheck(String backgroundDateCheck) {
		this.backgroundDateCheck = backgroundDateCheck;
	}

	public String getCorrespondenceLanguage() {
		return correspondenceLanguage;
	}

	public void setCorrespondenceLanguage(String correspondenceLanguage) {
		this.correspondenceLanguage = correspondenceLanguage;
	}

	public String getOfficeEmail() {
		return officeEmail;
	}

	public void setOfficeEmail(String officeEmail) {
		this.officeEmail = officeEmail;
	}

	public String getPersonalEmail() {
		return personalEmail;
	}

	public void setPersonalEmail(String personalEmail) {
		this.personalEmail = personalEmail;
	}

	public Integer getExpenseCheckSendToAddressId() {
		return expenseCheckSendToAddressId;
	}

	public void setExpenseCheckSendToAddressId(Integer expenseCheckSendToAddressId) {
		this.expenseCheckSendToAddressId = expenseCheckSendToAddressId;
	}

	public Integer getFteCapacity() {
		return fteCapacity;
	}

	public void setFteCapacity(Integer fteCapacity) {
		this.fteCapacity = fteCapacity;
	}

	public String getHoldApplicantDateUntil() {
		return holdApplicantDateUntil;
	}

	public void setHoldApplicantDateUntil(String holdApplicantDateUntil) {
		this.holdApplicantDateUntil = holdApplicantDateUntil;
	}

	public String getMailStop() {
		return mailStop;
	}

	public void setMailStop(String mailStop) {
		this.mailStop = mailStop;
	}

	public String getKnownAs() {
		return knownAs;
	}

	public void setKnownAs(String knownAs) {
		this.knownAs = knownAs;
	}

	public String getLastMedicalTestDate() {
		return lastMedicalTestDate;
	}

	public void setLastMedicalTestDate(String lastMedicalTestDate) {
		this.lastMedicalTestDate = lastMedicalTestDate;
	}

	public String getLastMedicalTestBy() {
		return lastMedicalTestBy;
	}

	public void setLastMedicalTestBy(String lastMedicalTestBy) {
		this.lastMedicalTestBy = lastMedicalTestBy;
	}

	public String getNationality() {
		return nationality;
	}

	public void setNationality(String nationality) {
		this.nationality = nationality;
	}

	public String getMaritalStatus() {
		return maritalStatus;
	}

	public void setMaritalStatus(String maritalStatus) {
		this.maritalStatus = maritalStatus;
	}

	public String getNationalIdentifier() {
		return nationalIdentifier;
	}

	public void setNationalIdentifier(String nationalIdentifier) {
		this.nationalIdentifier = nationalIdentifier;
	}

	public Integer getOnMilitaryService() {
		return onMilitaryService;
	}

	public void setOnMilitaryService(Integer onMilitaryService) {
		this.onMilitaryService = onMilitaryService;
	}

	public String getPreviousLastName() {
		return previousLastName;
	}

	public void setPreviousLastName(String previousLastName) {
		this.previousLastName = previousLastName;
	}

	public String getRehireReason() {
		return rehireReason;
	}

	public void setRehireReason(String rehireReason) {
		this.rehireReason = rehireReason;
	}

	public String getRehireRecommendation() {
		return rehireRecommendation;
	}

	public void setRehireRecommendation(String rehireRecommendation) {
		this.rehireRecommendation = rehireRecommendation;
	}

	public Integer getResumeExists() {
		return resumeExists;
	}

	public void setResumeExists(Integer resumeExists) {
		this.resumeExists = resumeExists;
	}

	public String getResumeLastUpdated() {
		return resumeLastUpdated;
	}

	public void setResumeLastUpdated(String resumeLastUpdated) {
		this.resumeLastUpdated = resumeLastUpdated;
	}

	public Integer getResumeId() {
		return resumeId;
	}

	public void setResumeId(Integer resumeId) {
		this.resumeId = resumeId;
	}

	public Integer getSecondPassportExists() {
		return secondPassportExists;
	}

	public void setSecondPassportExists(Integer secondPassportExists) {
		this.secondPassportExists = secondPassportExists;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public Integer getWorkScheduleId() {
		return workScheduleId;
	}

	public void setWorkScheduleId(Integer workScheduleId) {
		this.workScheduleId = workScheduleId;
	}

	public String getReceiptOfDeathCertDate() {
		return receiptOfDeathCertDate;
	}

	public void setReceiptOfDeathCertDate(String receiptOfDeathCertDate) {
		this.receiptOfDeathCertDate = receiptOfDeathCertDate;
	}

	public Integer getUsesTobaccoFlag() {
		return usesTobaccoFlag;
	}

	public void setUsesTobaccoFlag(Integer usesTobaccoFlag) {
		this.usesTobaccoFlag = usesTobaccoFlag;
	}

	public Integer getPhotoId() {
		return photoId;
	}

	public void setPhotoId(Integer photoId) {
		this.photoId = photoId;
	}

	public String getDateOfDeath() {
		return dateOfDeath;
	}

	public void setDateOfDeath(String dateOfDeath) {
		this.dateOfDeath = dateOfDeath;
	}

	public String getOriginalDateOfHire() {
		return originalDateOfHire;
	}

	public void setOriginalDateOfHire(String originalDateOfHire) {
		this.originalDateOfHire = originalDateOfHire;
	}

	public String getPassportNumber() {
		return passportNumber;
	}

	public void setPassportNumber(String passportNumber) {
		this.passportNumber = passportNumber;
	}

	public String getPassportDateOfIssue() {
		return passportDateOfIssue;
	}

	public void setPassportDateOfIssue(String passportDateOfIssue) {
		this.passportDateOfIssue = passportDateOfIssue;
	}

	public String getPassportDateOfExpiry() {
		return passportDateOfExpiry;
	}

	public void setPassportDateOfExpiry(String passportDateOfExpiry) {
		this.passportDateOfExpiry = passportDateOfExpiry;
	}

	public String getPassportIssuanceAuthority() {
		return passportIssuanceAuthority;
	}

	public void setPassportIssuanceAuthority(String passportIssuanceAuthority) {
		this.passportIssuanceAuthority = passportIssuanceAuthority;
	}

	public String getPassportPlaceOfIssue() {
		return passportPlaceOfIssue;
	}

	public void setPassportPlaceOfIssue(String passportPlaceOfIssue) {
		this.passportPlaceOfIssue = passportPlaceOfIssue;
	}

	public Integer getMailAddressId() {
		return mailAddressId;
	}

	public void setMailAddressId(Integer mailAddressId) {
		this.mailAddressId = mailAddressId;
	}

	public Integer getPermanentAddressId() {
		return permanentAddressId;
	}

	public void setPermanentAddressId(Integer permanentAddressId) {
		this.permanentAddressId = permanentAddressId;
	}

	public Integer getVersion() {
		return version;
	}

	public void setVersion(Integer version) {
		this.version = version;
	}

	public String getAttribute1() {
		return Attribute1;
	}

	public void setAttribute1(String attribute1) {
		Attribute1 = attribute1;
	}

	public String getAttribute2() {
		return Attribute2;
	}

	public void setAttribute2(String attribute2) {
		Attribute2 = attribute2;
	}

	public String getAttribute3() {
		return Attribute3;
	}

	public void setAttribute3(String attribute3) {
		Attribute3 = attribute3;
	}

	public String getAttribute4() {
		return Attribute4;
	}

	public void setAttribute4(String attribute4) {
		Attribute4 = attribute4;
	}

	public String getAttribute5() {
		return Attribute5;
	}

	public void setAttribute5(String attribute5) {
		Attribute5 = attribute5;
	}

	public String getAttribute6() {
		return Attribute6;
	}

	public void setAttribute6(String attribute6) {
		Attribute6 = attribute6;
	}

	public String getAttribute7() {
		return Attribute7;
	}

	public void setAttribute7(String attribute7) {
		Attribute7 = attribute7;
	}

	public String getAttribute8() {
		return Attribute8;
	}

	public void setAttribute8(String attribute8) {
		Attribute8 = attribute8;
	}

	public String getAttribute9() {
		return Attribute9;
	}

	public void setAttribute9(String attribute9) {
		Attribute9 = attribute9;
	}

	public String getAttribute10() {
		return Attribute10;
	}

	public void setAttribute10(String attribute10) {
		Attribute10 = attribute10;
	}

	public String getAttribute11() {
		return Attribute11;
	}

	public void setAttribute11(String attribute11) {
		Attribute11 = attribute11;
	}

	public String getAttribute12() {
		return Attribute12;
	}

	public void setAttribute12(String attribute12) {
		Attribute12 = attribute12;
	}

	public String getAttribute13() {
		return Attribute13;
	}

	public void setAttribute13(String attribute13) {
		Attribute13 = attribute13;
	}

	public String getAttribute14() {
		return Attribute14;
	}

	public void setAttribute14(String attribute14) {
		Attribute14 = attribute14;
	}

	public String getAttribute15() {
		return Attribute15;
	}

	public void setAttribute15(String attribute15) {
		Attribute15 = attribute15;
	}

	public String getAttribute16() {
		return Attribute16;
	}

	public void setAttribute16(String attribute16) {
		Attribute16 = attribute16;
	}

	public String getAttribute17() {
		return Attribute17;
	}

	public void setAttribute17(String attribute17) {
		Attribute17 = attribute17;
	}

	public String getAttribute18() {
		return Attribute18;
	}

	public void setAttribute18(String attribute18) {
		Attribute18 = attribute18;
	}

	public String getAttribute19() {
		return Attribute19;
	}

	public void setAttribute19(String attribute19) {
		Attribute19 = attribute19;
	}

	public String getAttribute20() {
		return Attribute20;
	}

	public void setAttribute20(String attribute20) {
		Attribute20 = attribute20;
	}

	public String getAttribute21() {
		return Attribute21;
	}

	public void setAttribute21(String attribute21) {
		Attribute21 = attribute21;
	}

	public String getAttribute22() {
		return Attribute22;
	}

	public void setAttribute22(String attribute22) {
		Attribute22 = attribute22;
	}

	public String getAttribute23() {
		return Attribute23;
	}

	public void setAttribute23(String attribute23) {
		Attribute23 = attribute23;
	}

	public String getAttribute24() {
		return Attribute24;
	}

	public void setAttribute24(String attribute24) {
		Attribute24 = attribute24;
	}

	public String getAttribute25() {
		return Attribute25;
	}

	public void setAttribute25(String attribute25) {
		Attribute25 = attribute25;
	}

	public Integer getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(Integer createdBy) {
		this.createdBy = createdBy;
	}

	public String getCreationDate() {
		return creationDate;
	}

	public void setCreationDate(String creationDate) {
		this.creationDate = creationDate;
	}

	public Integer getLastUpdatedBy() {
		return lastUpdatedBy;
	}

	public void setLastUpdatedBy(Integer lastUpdatedBy) {
		this.lastUpdatedBy = lastUpdatedBy;
	}

	public String getLastUpdateDate() {
		return lastUpdateDate;
	}

	public void setLastUpdateDate(String lastUpdateDate) {
		this.lastUpdateDate = lastUpdateDate;
	}

	public Integer getAttachmentId() {
		return attachmentId;
	}

	public void setAttachmentId(Integer attachmentId) {
		this.attachmentId = attachmentId;
	}

	/*public OsiContacts getOsiEmployeeContacts() {
		return osiEmployeeContacts;
	}

	public void setOsiEmployeeContacts(OsiContacts osiEmployeeContacts) {
		this.osiEmployeeContacts = osiEmployeeContacts;
	}

	public List<OsiAttachmentsDTO> getOsiEmpAttachments() {
		return osiEmpAttachments;
	}

	public void setOsiEmpAttachments(List<OsiAttachmentsDTO> osiEmpAttachments) {
		this.osiEmpAttachments = osiEmpAttachments;
	}

	public OsiOrganizationsDTO getOsiOrganizationsDTO() {
		return OsiOrganizationsDTO;
	}

	public void setOsiOrganizationsDTO(OsiOrganizationsDTO osiOrganizationsDTO) {
		OsiOrganizationsDTO = osiOrganizationsDTO;
	}

	public List<OsiEmpVisaDetailsDTO> getOsiEmpVisaDetails() {
		return osiEmpVisaDetails;
	}

	public void setOsiEmpVisaDetails(List<OsiEmpVisaDetailsDTO> osiEmpVisaDetails) {
		this.osiEmpVisaDetails = osiEmpVisaDetails;
	}*/

	public Integer getIsManager() {
		return isManager;
	}

	public void setIsManager(Integer isManager) {
		this.isManager = isManager;
	}

	public String getTerminationDate() {
		return terminationDate;
	}

	public void setTerminationDate(String terminationDate) {
		this.terminationDate = terminationDate;
	}

	public Integer getSupervisorId() {
		return supervisorId;
	}

	public void setSupervisorId(Integer supervisorId) {
		this.supervisorId = supervisorId;
	}

	public String getSupervisorName() {
		return supervisorName;
	}

	public void setSupervisorName(String supervisor) {
		this.supervisorName = supervisor;
	}

	public String getSupervisorMail() {
		return supervisorMail;
	}

	public void setSupervisorMail(String supervisorMail) {
		this.supervisorMail = supervisorMail;
	}

	public String getContactNumber() {
		return contactNumber;
	}

	public void setContactNumber(String contactNumber) {
		this.contactNumber = contactNumber;
	}

	public String getSystemType() {
		return systemType;
	}

	public void setSystemType(String systemType) {
		this.systemType = systemType;
	}

	public String getLocationName() {
		return locationName;
	}

	public void setLocationName(String locationName) {
		this.locationName = locationName;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getSerialNumber() {
		return serialNumber;
	}

	public void setSerialNumber(String serialNumber) {
		this.serialNumber = serialNumber;
	}

	public String getProbEndDate() {
		return probEndDate;
	}

	public void setProbEndDate(String probEndDate) {
		this.probEndDate = probEndDate;
	}

	public String getGrade() {
		return grade;
	}

	public void setGrade(String grade) {
		this.grade = grade;
	}

	public Integer getEmployeeStatus() {
		return employeeStatus;
	}

	public void setEmployeeStatus(Integer employeeStatus) {
		this.employeeStatus = employeeStatus;
	}

	public Double getTotalExp() {
		return totalExp;
	}

	public void setTotalExp(Double totalExp) {
		this.totalExp = totalExp;
	}

	public String getJobName() {
		return jobName;
	}

	public void setJobName(String jobName) {
		this.jobName = jobName;
	}

	public String getOrgName() {
		return orgName;
	}

	public void setOrgName(String orgName) {
		this.orgName = orgName;
	}

	public Integer getIsProxyEnabled() {
		return isProxyEnabled;
	}

	public void setIsProxyEnabled(Integer isProxyEnabled) {
		this.isProxyEnabled = isProxyEnabled;
	}

	public Integer getIsProxyRestricted() {
		return isProxyRestricted;
	}

	public void setIsProxyRestricted(Integer isProxyRestricted) {
		this.isProxyRestricted = isProxyRestricted;
	}
	
}
