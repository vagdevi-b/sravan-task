export const variables = {
    tsmApiIP: 'http://192.168.32.63',
    emsApiIP: 'http://192.168.32.63',
    resignationApiIP: 'http://192.168.32.63',
    recruitmentApiIP: 'http://192.168.32.63',
    exmsApiIP: 'http://192.168.32.63',
    reportsDownloadApiIP: 'http://192.168.32.63',
    reportIP: 'http://192.168.32.63',
    elasticSearchIP: 'http://192.168.32.63',
    uiIP: 'http://192.168.32.63',
    cookieIP: 'http://192.168.32.63',
    expenseAttachmentIP: 'http://192.168.32.63',
    dashboardIP: 'http://192.168.32.63',
    wrsPdfIP: 'http://192.168.32.63',

    tsmApiPort: ':8080',
    emsApiPort: ':8080',
    resignationApiPort: ':8080',
    recruitmentApiPort: ':8080',
    exmsApiPort: ':8080',
    reportsDownloadApiPort: ':8080',
    reportPort: ':8080',
    elasticSearchPort: ':9200',
    uiPort: ':8080',
    expenseAttachmentPort: ':8080',
    dashboardPort: ':8080',
    wrsPdfPort: ':8080',

    tsmApiContextPath: '/tsm-api',
    emsApiContextPath: '/ems-api',
    resignationApiContextPath: '/resignation',
    exmsContextPath: '/exms-api',
    reportsDownloadApiContextPath: '/EMS-DATA',
    reportContextPath: '/reports',
    expenseAttachmentContextPath: '/EMS-DATA/',
    dashboardPath: '/EMS-DATA/DASHBOARD_IMAGES/',
    wrsPdfPath: '/EMS-DATA/WSR/'


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
