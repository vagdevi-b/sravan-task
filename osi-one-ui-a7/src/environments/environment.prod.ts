export const variables = {
  tsmApiIP: 'https://osione.osidigital.com',
  emsApiIP: 'https://osione.osidigital.com',
  resignationApiIP: 'https://osione.osidigital.com',
  recruitmentApiIP: 'https://osione.osidigital.com',
  exmsApiIP: 'https://osione.osidigital.com',
  reportsDownloadApiIP: 'https://osione.osidigital.com',
  reportIP: 'https://osione.osidigital.com',
  elasticSearchIP: 'https://osione.osidigital.com',
  uiIP: 'https://osione.osidigital.com',
  cookieIP: 'https://osione.osidigital.com',
  expenseAttachmentIP: 'https://osione.osidigital.com',
  dashboardIP: 'https://osione.osidigital.com',
  wrsPdfIP: 'https://osione.osidigital.com',

  tsmApiPort: '',
  emsApiPort: '',
  resignationApiPort: '',
  recruitmentApiPort: '',
  exmsApiPort: '',
  reportsDownloadApiPort: '',
  reportPort: '',
  elasticSearchPort: ':9200',
  uiPort: '',
  expenseAttachmentPort: '',
  dashboardPort: '',
  wrsPdfPort: '',


  tsmApiContextPath: '/tsm-api',
  emsApiContextPath: '/ems-api',
  resignationApiContextPath: '/resignation',
  exmsContextPath: '/exms-api',
  reportsDownloadApiContextPath: '/OSIONE-DATA',
  reportContextPath: '/reports',
  expenseAttachmentContextPath: '/OSIONE-DATA/',
  dashboardPath: '/OSIONE-DATA/DASHBOARD_IMAGES/',
  wrsPdfPath: '/OSIONE-DATA/WSR/'


}

export const environment = {
  production: true,
  tsmBaseUrl: `${variables.tsmApiIP}${variables.tsmApiPort}${variables.tsmApiContextPath}`,
  emsBaseUrl: `${variables.emsApiIP}${variables.emsApiPort}${variables.emsApiContextPath}`,
  resignationBaseUrl: `${variables.resignationApiIP}${variables.resignationApiPort}${variables.resignationApiContextPath}`,
  recruitmentBaseUrl: `${variables.recruitmentApiIP}${variables.recruitmentApiPort}`,
  exmsBaseUrl: `${variables.exmsApiIP}${variables.exmsApiPort}${variables.exmsContextPath}`,
  reportsDownloadBaseUrl: `${variables.reportsDownloadApiIP}${variables.reportsDownloadApiPort}${variables.reportsDownloadApiContextPath}`,
  reportUrl: `${variables.reportIP}${variables.reportPort}${variables.reportContextPath}`,
  elasticSearchUrl: `${variables.elasticSearchIP}${variables.elasticSearchPort}`,
  uiUrl: `${variables.uiIP}${variables.uiPort}`,
  cookieUrl: `${variables.cookieIP}`,
  expenseAttachmentUrl: `${variables.expenseAttachmentIP}${variables.expenseAttachmentPort}${variables.expenseAttachmentContextPath}`,
  dashBoardImages: `${variables.dashboardIP}${variables.dashboardPort}${variables.dashboardPath}`,
  wrsPdfUrl: `${variables.wrsPdfIP}${variables.wrsPdfPort}${variables.wrsPdfPath}`

};
