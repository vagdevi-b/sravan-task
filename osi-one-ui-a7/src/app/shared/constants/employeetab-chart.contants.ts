import { ShortNumberhPipe } from "../pipes/short-number.pipe";



export const EmployeePandLdataCards = [
    {
        id: 1,
        widgets: [
            {
                id: 'yearMonthId',
                title: 'Cost & Revenue By Month',
                width: 12,
                type: 'chart',
                name: 'Year Month',
                caluclateHeight: false,
                details: {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                type: 'line',
                                label: "Margin",
                                backgroundColor: "	#FFFFFF",
                                borderColor: "#f55814",
                                hoverBackgroundColor: "#f55814",
                                hoverBorderColor: "#f55814",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                lineTension: 0,
                                yAxisID: 'y-axis-2',
                            },

                            {
                                label: "Cost",
                                backgroundColor: "rgb(8 77 188)",
                                borderColor: "rgb(8 77 188)",
                                hoverBackgroundColor: "rgb(8 77 188)",
                                hoverBorderColor: "rgb(8 77 188)",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                yAxisID: 'y-axis-1',
                            }, {
                                label: "Revenue",
                                backgroundColor: "rgb(58 129 243)",
                                borderColor: "rgb(58 129 243)",
                                hoverBackgroundColor: "rgb(58 129 243)",
                                hoverBorderColor: "rgb(58 129 243)",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                yAxisID: 'y-axis-1',
                            }]
                    },
                    options: {
                        responsive: true,
                        // maintainAspectRatio: false,
                        aspectRatio: 4,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                                boxWidth: 5,
                                usePointStyle: true
                            }
                        },
                        scales: {
                            yAxes: [{
                                id: 'y-axis-1',
                                position: 'left',
                                gridLines: {
                                    display: false
                                },
                                scaleLabel: {

                                    display: true,

                                    labelString: 'Cost & Revenue'

                                },
                                stacked: false,
                                ticks: {
                                    beginAtZero: true,
                                    //stepSize: 2000,
                                    callback: function (value, index) {
                                        let tick = '';
                                        tick = ShortNumberhPipe.prototype.transform(value, 0);
                                        return tick;
                                    }
                                },
                            },
                            {
                                id: 'y-axis-2',
                                position: 'right',
                                gridLines: {
                                    display: false
                                },
                                stacked: false,
                                scaleLabel: {

                                    display: true,

                                    labelString: 'Margin %'

                                },
                                ticks: {
                                    beginAtZero: true,
                                    //stepSize: 2000,

                                },
                            }
                            ],
                            xAxes: [{
                                stacked: false,
                                gridLines: {
                                    color: "transparent",
                                    display: false
                                }
                            }]
                        },
                        plugins: {
                            datalabels: {
                                display: false
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        id: 2,
        widgets: [
            {
                id: 'hoursBreakdownChartId',
                title: 'Hours BreakDown',
                width: 12,
                type: 'chart',
                name: 'Hours BreakDown',
                details: {
                    type: 'bar',
                    data: {
            
                        labels: [],
                        datasets: [
                            {
                                type: 'line',
                                label: "Utilization",
                                backgroundColor: "	#FFFFFF",
                                borderColor: "#f55814",
                                hoverBackgroundColor: "#f55814",
                                hoverBorderColor: "#f55814",
                                //data: this.marginData,
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                lineTension: 0,
                                yAxisID: 'y-axis-2',
                                // barPercentage: .325,
                                // categoryPercentage: .5,
                                // borderWidth: 5,
                                // borderSkipped: false
                            },
            
                            {
                                label: "Billable",
                                backgroundColor: "rgb(8 77 188)",
                                borderColor: "rgb(8 77 188)",
                                hoverBackgroundColor: "rgb(8 77 188)",
                                hoverBorderColor: "rgb(8 77 188)",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                yAxisID: 'y-axis-1',
                            }, {
                                label: "Non Billable",
                                backgroundColor: "rgb(58 129 243)",
                                borderColor: "rgb(58 129 243)",
                                hoverBackgroundColor: "rgb(58 129 243)",
                                hoverBorderColor: "rgb(58 129 243)",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                yAxisID: 'y-axis-1',
                            }, {
                                label: "Internal",
                                backgroundColor: "#ff9c01",
                                borderColor: "#ff9c01",
                                hoverBackgroundColor: "#ff9c01",
                                hoverBorderColor: "#ff9c01",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                yAxisID: 'y-axis-1',
                            },
                            {
                                label: "PTO",
                                backgroundColor: "#084dbc",
                                borderColor: "#084dbc",
                                hoverBackgroundColor: "#084dbc",
                                hoverBorderColor: "#084dbc",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                yAxisID: 'y-axis-1',
                            }]
                    },
                    options: {
                        responsive: true,
                        aspectRatio: 4,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                                boxWidth: 5,
                                usePointStyle: true
                            }
                        },
                        scales: {
                            yAxes: [{
                                id: 'y-axis-1',
                                position: 'left',
                                gridLines: {
                                    display: false
                                },
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Hours'
                                },
                                stacked: false,
                                ticks: {
                                    beginAtZero: true,
                                    //stepSize: 2000,
                                    callback: function (value, index) {
                                        let tick = '';
                                        tick = ShortNumberhPipe.prototype.transform(value, 0);
                                        return tick;
                                    }
                                },
                            },
                            {
                                id: 'y-axis-2',
                                position: 'right',
                                gridLines: {
                                    display: false
                                },
                                stacked: false,
                                scaleLabel: {
            
                                    display: true,
            
                                    labelString: 'Utilization %'
            
                                },
                                ticks: {
                                    beginAtZero: true,
                                    //stepSize: 2000,
            
                                },
                            }
                            ],
                            xAxes: [{
                                stacked: false,
                                gridLines: {
                                    color: "transparent",
                                    display: false
                                }
                            }]
                        },
                        plugins: {
                            datalabels: {
                                display: false
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        id: 3,
        widgets: [
            {
                id: 'PandLEmployeeUtilizationByLevels',
                title: 'Utilization By Levels',
                width: 12,
                type: 'table',
                columns: [
                    {
                        dispalyName: 'Year Month',
                        key: 'Year Month',
                        type: 'string'
                    },
                    {
                        dispalyName: 'Associate Consultant',
                        key: 'ASSOCIATE CONSULTANT',
                    },
                    {
                        dispalyName: 'Staff Consultant',
                        key: 'STAFF CONSULTANT',
                    },
                    {
                        dispalyName: 'Senior Consultant',
                        key: 'SENIOR CONSULTANT',
                    },
                    {
                        dispalyName: 'Principal Consultant',
                        key: 'PRINCIPAL CONSULTANT',
                    },
                    {
                        dispalyName: 'Practice Manager',
                        key: 'PRACTICE MANAGER',
                    },
                    {
                        dispalyName: 'Practice Director',
                        key: 'PRACTICE DIRECTOR',
                    },
                    {
                        dispalyName: 'VP',
                        key: 'VP',
                        isTitleCaseNotRequired: true,
                    },
                    {
                        dispalyName: 'Senior VP',
                        key: 'SENIOR VP',
                        isTitleCaseNotRequired: true,
                    },
                    {
                        dispalyName: 'President',
                        key: 'PRESIDENT',
                    },
                    {
                        dispalyName: 'CEO',
                        key: 'CEO',
                        isTitleCaseNotRequired: true,
                    }
                ]
            }
        ]
    },
    {
        id: 4,
        widgets: [
            {
                id: 'employeeUtilChartId',
                title: 'Employee Utilization',
                width: 12,
                type: 'chart',
                name: 'Employee Utilization',
                caluclateHeight: true,
                details: {
                    type: 'horizontalBar',
                    plugins: [],
                    data: {
                        labels: [],
                        datasets: [{
                            label: "Utilization",
                            backgroundColor: "#03a9f4",
                            borderColor: "#03a9f4",
                            hoverBackgroundColor: "#03a9f4",
                            hoverBorderColor: "#03a9f4",
                            data: [],
                            barThickness: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                                boxWidth: 5,
                                usePointStyle: true
                            }
                        },
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Utilization',
                                    fontStyle: 'bold'
                                },
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    beginAtZero: true,
                                    min: 0,
                                    max: 100,
                                },
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Employee',
                                    fontStyle: 'bold'
                                },
                                stacked: true,
                                gridLines: {
                                    color: "transparent",
                                    display: false
                                },
                                ticks: {
                                    beginAtZero: true,
                                },
                            }]
                        },
                        plugins: {
                            datalabels: {
                                display: true,
                                formatter: function (value, context) {
                                    return value + '%';
                                },
                                color: 'Black',
                                anchor: 'start',
                                align: 'end'
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        id: 5,
        widgets: [
            {
                id: 'hoursBreakdownByProjectId',
                title: 'Hours Breakdown By Project',
                width: 12,
                type: 'chart',
                name: 'Hours Breakdown By Project',
                caluclateHeight: true,
                details: {
                    type: 'horizontalBar',
                    data: {
            
                        labels: [],
                        datasets: [{
                            label: "Billable",
                            backgroundColor: "#03a9f4",
                            borderColor: "#03a9f4",
                            hoverBackgroundColor: "#03a9f4",
                            hoverBorderColor: "#03a9f4",
                            data: [],
                            barThickness: 10
                        },
                        {
                            label: "NonBillable",
                            backgroundColor: "#99c14e",
                            borderColor: "#99c14e",
                            hoverBackgroundColor: "#99c14e",
                            hoverBorderColor: "#99c14e",
                            data: [],
                            barThickness: 10
                        },
                        {
                            label: "Internal",
                            backgroundColor: "#ff7676",
                            borderColor: "#ff7676",
                            hoverBackgroundColor: "#ff7676",
                            hoverBorderColor: "#ff7676",
                            data: [],
                            barThickness: 10
                        },
                        {
                            label: "Holiday",
                            backgroundColor: "#ff9c01",
                            borderColor: "#ff9c01",
                            hoverBackgroundColor: "#ff9c01",
                            hoverBorderColor: "#ff9c01",
                            data: [],
                            barThickness: 10
                        },
                        {
                            label: "PTO",
                            backgroundColor: "#084dbc",
                            borderColor: "#084dbc",
                            hoverBackgroundColor: "#084dbc",
                            hoverBorderColor: "#084dbc",
                            data: [],
                            barThickness: 10
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                                boxWidth: 5,
                                usePointStyle: true
                            }
                        },
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Billable,NonBillable,Internal,PTO,Holiday',
                                    fontStyle: 'bold'
                                },
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    beginAtZero: true,
                                    callback: function (value, index) {
                                        let tick = '';
                                        tick = ShortNumberhPipe.prototype.transform(value, 0);
                                        return tick;
                                    }
                                },
                                stacked: true
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Project',
                                    fontStyle: 'bold'
                                },
                                stacked: true,
                                gridLines: {
                                    color: "transparent",
                                    display: false
                                },
                                ticks: {
                                    beginAtZero: true
                                 }
                            }]
                        },
                        plugins: {
                            datalabels: {
                                display: false
                            }
                        }
                    }
                }
            }
        ]
    },
    {
        id: 6,
        widgets: [
            {
                id: 'revenuBreakdownByEmployeeId',
                title: 'Revenue BreakDown By Employee',
                width: 12,
                type: 'chart',
                name: 'Revenue BreakDown By Employee',
                caluclateHeight: true,
                details: {
                    type: 'horizontalBar',
                    plugins: [],
                    data: {
                        labels: [],
                        datasets: [{
                            label: "Revenue",
                            backgroundColor: "#03a9f4",
                            borderColor: "#03a9f4",
                            hoverBackgroundColor: "#03a9f4",
                            hoverBorderColor: "#03a9f4",
                            data: [],
                            barThickness: 15
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.xLabel.toLocaleString();
                                }
                            }
                        },
                        legend: {
                            display: true,
                            position: 'top',
                            align: 'end',
                            labels: {
                                boxWidth: 5,
                                usePointStyle: true
                            }
                        },
                        scales: {
                            xAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Revenue',
                                    fontStyle: 'bold'
                                },
                                gridLines: {
                                    display: false
                                },
                                ticks: {
                                    beginAtZero: true,
                                    //stepSize: 2000,
                                    callback: function (value, index) {
                                        let tick = '';
                                        tick = ShortNumberhPipe.prototype.transform(value, 0);
                                        return tick;
                                    }
                                },
                            }],
                            yAxes: [{
                                scaleLabel: {
                                    display: true,
                                    labelString: 'Employee',
                                    fontStyle: 'bold'
                                },
                                stacked: true,
                                gridLines: {
                                    color: "transparent",
                                    display: false
                                }
                            }]
                        },
                        plugins: {
                            datalabels: {
                                display: true,
                                color: 'Black',
                                anchor: 'end',
                                align: 'end'
                            }
                        }
                    }
                }
            }
        ]
    }
];