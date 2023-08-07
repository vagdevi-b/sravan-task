import { ShortNumberhPipe } from "../pipes/short-number.pipe";

export const DetailsPandLdataCards = [
    {
        id: 1,
        widgets: [
            {
                id: 'PandLDetailsCustomerGrid',
                title: 'Customer',
                width: 6,
                type: 'table',
                columns: [
                    {
                        dispalyName: 'Customer',
                        key: 'customer',
                        type: 'string',
                    },
                    {
                        dispalyName: 'Cost',
                        key: 'cost'
                    },
                    {
                        dispalyName: 'Revenue',
                        key: 'revenue'
                    },
                    {
                        dispalyName: 'Margin%',
                        key: 'margin'
                    }
                ]
            },
            {
                id: 'PandLDetailsProjectGrid',
                title: 'Project',
                width: 6,
                type: 'table',
                columns: [
                    {
                        dispalyName: 'Project',
                        key: 'project',
                        type: 'string'
                    },
                    {
                        dispalyName: 'Cost',
                        key: 'cost'
                    },
                    {
                        dispalyName: 'Revenue',
                        key: 'revenue'
                    },
                    {
                        dispalyName: 'Margin%',
                        key: 'margin'
                    }
                ]
            }
        ]
    },
    {
        id: 2,
        widgets: [
            {
                id: 'PandLDetailsEmployeeGrid',
                title: 'Employee',
                width: 12,
                type: 'table',
                columns: [
                    {
                        dispalyName: 'Employee',
                        key: 'employee',
                        type: 'string'
                    },
                    {
                        dispalyName: 'Billing Hrs',
                        key: 'billinghours'
                    },
                    {
                        dispalyName: 'Non Billing Hrs',
                        key: 'nonbillinghours'
                    },
                    {
                        dispalyName: 'Cost',
                        key: 'cost'
                    },
                    {
                        dispalyName: 'Revenue',
                        key: 'revenue'
                    },
                    {
                        dispalyName: 'Margin%',
                        key: 'margin'
                    }
                ]
            }
        ]
    },
    {
        id: 3,
        widgets: [
            {
                id: 'PandLDetailsEmployeeOrganizationGrid',
                title: 'Employee Organization',
                width: 6,
                type: 'table',
                columns: [
                    {
                        dispalyName: 'Organization',
                        key: 'employeeOrg',
                        type: 'string'
                    },
                    {
                        dispalyName: 'Cost',
                        key: 'cost'
                    },
                    {
                        dispalyName: 'Revenue',
                        key: 'revenue'
                    },
                    {
                        dispalyName: 'Margin%',
                        key: 'margin'
                    }
                ]
            },
            {
                id: 'PandLDetailsEmployeeOrganizationChart',
                title: 'Employee Organization',
                width: 6,
                type: 'chart',
                name: 'Year Month',
                caluclateHeight: false,
                details: {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: [{
                            label: "Cost",
                            backgroundColor: "#99c14e",
                            borderColor: "#99c14e",
                            hoverBackgroundColor: "#99c14e",
                            hoverBorderColor: "#99c14e",
                            data: [],
                            maxBarThickness: 40,
                            categoryPercentage: 0.35,
                            barPercentage: 1.0,
                        }, {
                            label: "Revenue",
                            backgroundColor: "#ff7676",
                            borderColor: "#ff7676",
                            hoverBackgroundColor: "#ff7676",
                            hoverBorderColor: "#ff7676",
                            data: [],
                            maxBarThickness: 40,
                            categoryPercentage: 0.35,
                            barPercentage: 1.0,
                        }]
                    },
                    options: {
                        responsive: true,
                        aspectRatio: 2,
                        cornerRadius: 15,
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
                                    //min: 0,
                                    //max: this.getMaxValue(this.costData,this.revenueData),
                                    //stepSize: this.getStepSize(this.getMaxValue(this.costData,this.revenueData)),
                                    callback: function (value, index) {
                                        //// console.log(value,index, 'valueindex y label');
                                        let tick = '';
                                        tick = ShortNumberhPipe.prototype.transform(value, 0);
                                        // if (value >= 1000 && value <= 999999) {
                                        //     tick = (value / 1000) + 'K';
                                        // } else if (value >= 1000000 && value <= 9999999) {
                                        //     tick = (value / 1000000) + 'M';
                                        // } else if (value >= 0 && value <= 1000) {
                                        //     tick = value;
                                        // }
                                        return tick;
                                    }
                                },
                            }],
                            xAxes: [{
                                stacked: false,
                                gridLines: {
                                    color: "transparent"
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
        id: 4,
        widgets: [
            {
                id: 'PandLDetailsMonthlyEmployeeRevenueGrid',
                title: 'Monthly Employee Revenue',
                width: 12,
                type: 'table',
                columns: [
                    {
                        dispalyName: 'Year Month',
                        key: 'yearmonth',
                        type: 'string'
                    },
                    {
                        dispalyName: 'Project',
                        key: 'project',
                        type: 'string'
                    },
                    {
                        dispalyName: 'SOW#',
                        key: 'sow',
                        isTitleCaseNotRequired: true,
                        type: 'string'
                    },
                    {
                        dispalyName: 'Status',
                        key: 'status',
                        type: 'string'
                    },
                    {
                        dispalyName: 'PM',
                        key: 'pm',
                        type: 'string',
                        isTitleCaseNotRequired: true
                    },
                    {
                        dispalyName: 'Employee',
                        key: 'employee',
                        type: 'string'
                    },
                    {
                        dispalyName: 'Cost',
                        key: 'cost'
                    },
                    {
                        dispalyName: 'Revenue',
                        key: 'revenue'
                    },
                    {
                        dispalyName: 'Billing Expenses',
                        key: 'billableExpenses'
                    },
                    {
                        dispalyName: 'NB Expenses',
                        key: 'nonBillableExpenses',
                        isTitleCaseNotRequired: true
                    },
                    {
                        dispalyName: 'Billable Hrs',
                        key: 'billableHours'
                    },
                    {
                        dispalyName: 'NB Hrs',
                        key: 'nonBillableHours',
                        isTitleCaseNotRequired: true
                    },
                    {
                        dispalyName: 'Internal Hrs',
                        key: 'internalHours'
                    },
                    {
                        dispalyName: 'Holiday Hrs',
                        key: 'holidayHours'
                    },
                    {
                        dispalyName: 'PTO Hrs',
                        key: 'ptoHours',
                        isTitleCaseNotRequired: true
                    },
                    {
                        dispalyName: 'SP Leaves Hrs',
                        key: 'specailLeaveHours',
                        isTitleCaseNotRequired: true
                    }
                ]
            }
        ]
    }
];