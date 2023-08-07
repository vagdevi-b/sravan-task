export const variables = {
    tsmApiIP: 'https://osioneuat.osidigital.com',
    emsApiIP: 'https://osioneuat.osidigital.com',
    resignationApiIP: 'https://osioneuat.osidigital.com',
    recruitmentApiIP: 'https://osioneuat.osidigital.com',
    exmsApiIP: 'https://osioneuat.osidigital.com',
    reportsDownloadApiIP: 'https://osioneuat.osidigital.com',
    reportIP: 'https://osioneuat.osidigital.com',
    elasticSearchIP: 'https://osioneuat.osidigital.com',
    uiIP: 'https://osioneuat.osidigital.com',
    cookieIP: 'https://osioneuat.osidigital.com',
    expenseAttachmentIP: 'https://osioneuat.osidigital.com',
    dashboardIP: 'https://osioneuat.osidigital.com',
    wrsPdfIP: 'https://osioneuat.osidigital.com',

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
    production: false,
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
