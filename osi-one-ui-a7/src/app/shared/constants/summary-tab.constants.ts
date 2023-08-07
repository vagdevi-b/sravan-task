import { ShortNumberhPipe } from "../pipes/short-number.pipe";

export const SummaryPandLDataCards = [
    {
        id: 1,
        widgets: [
            {
                id: 'PandLSummaryYearMonth',
                title: 'By Month',
                width: 12,
                type: 'chart',
                name: 'By Month',
                caluclateHeight: false,
                details: {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                type: 'line',
                                label: "Margin %",
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
                                type: 'bar',
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
                                // barPercentage: .325,
                                // categoryPercentage: .5,
                                // borderWidth: 5,
                                // borderSkipped: false
                            }, {
                                type: 'bar',
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
                                // barPercentage: .325,
                                // categoryPercentage: .5,
                                // borderRadius: 5,
                                // borderSkipped: false
                            }
                        ]
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
                id: 'PandLSummaryProjectOrganization',
                title: 'By Project Organization',
                width: 6,
                type: 'chart',
                name: 'By Project Organization',
                caluclateHeight: false,
                details: {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: [{
                            label: "Cost",
                            backgroundColor: "#ff9c01",
                            borderColor: "#ff9c01",
                            hoverBackgroundColor: "#ff9c01",
                            hoverBorderColor: "#ff9c01",
                            data: [],
                            maxBarThickness: 40,
                            categoryPercentage: 0.35,
                            barPercentage: 1.0,
                            borderRadius: 5
                        }, {
                            label: "Revenue",
                            backgroundColor: "#084dbc",
                            borderColor: "#084dbc",
                            hoverBackgroundColor: "#084dbc",
                            hoverBorderColor: "#084dbc",
                            data: [],
                            maxBarThickness: 40,
                            categoryPercentage: 0.35,
                            barPercentage: 1.0,
                            borderRadius: 5
                        }]
                    },
                    options: {
                        responsive: true,
                        aspectRatio: 2,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
                                }
                            }
                        },
                        cornerRadius: 15,
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
                                    //max: this.getMaxValue(this.costData,this.revenueData),
                                    //stepSize: this.getStepSize(this.getMaxValue(this.costData,this.revenueData)),
                                    callback: function (value, index) {
                                        let tick = '';
                                        tick = ShortNumberhPipe.prototype.transform(value, 0);
                                        return tick;
                                    }
                                },
                            }],
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
            },
            {
                id: 'PandLSummaryEmployeeOrganization',
                title: 'By Employee Organization',
                width: 6,
                type: 'chart',
                name: 'By Employee Organization',
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
                            barPercentage: 1.0
                        }, {
                            label: "Revenue",
                            backgroundColor: "#ff7676",
                            borderColor: "#ff7676",
                            hoverBackgroundColor: "#ff7676",
                            hoverBorderColor: "#ff7676",
                            data: [],
                            maxBarThickness: 40,
                            categoryPercentage: 0.35,
                            barPercentage: 1.0
                        }]
                    },
                    options: {
                        responsive: true,
                        aspectRatio: 2,
                        tooltips: {
                            callbacks: {
                                label: function (tooltipItem, data) {
                                    return data.datasets[tooltipItem.datasetIndex].label + ': ' + tooltipItem.yLabel.toLocaleString();
                                }
                            }
                        },
                        cornerRadius: 15,
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
                                    //max: this.getMaxValue(this.costData,this.revenueData),
                                    //stepSize: this.getStepSize(this.getMaxValue(this.costData,this.revenueData)),
                                    callback: function (value, index) {
                                        let tick = '';
                                        tick = ShortNumberhPipe.prototype.transform(value, 0);
                                        return tick;
                                    }
                                },
                            }],
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
                id: 'PandLSummaryEmployeePractise',
                title: 'By Employee Practice',
                width: 12,
                type: 'chart',
                name: 'By Employee Practice',
                caluclateHeight: false,
                details: {
                    type: 'bar',
                    data: {
                        labels: [],
                        datasets: [
                            {
                                type: 'bar',
                                label: "Cost",
                                backgroundColor: "rgb(8 77 188)",
                                borderColor: "rgb(8 77 188)",
                                hoverBackgroundColor: "rgb(8 77 188)",
                                hoverBorderColor: "rgb(8 77 188)",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                                // barPercentage: .325,
                                // categoryPercentage: .5,
                                // borderWidth: 5,
                                // borderSkipped: false
                            }, {
                                type: 'bar',
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
                                // barPercentage: .325,
                                // categoryPercentage: .5,
                                // borderRadius: 5,
                                // borderSkipped: false
                            }
                        ]
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
    }
];