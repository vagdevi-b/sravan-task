import { ShortNumberhPipe } from "../pipes/short-number.pipe";



export const PaymentPandLdataCards = [
    {
        id: 1,
        widgets: [
            {
                id: 'PaymentSummaryOrgCostRevenue',
                title: 'Cost and Revenue By Organization',
                width: 12,
                type: 'chart',
                name: 'By Project Organization',
                caluclateHeight: true,
                details: {
                    type: 'horizontalBar',
                    data: {
                        labels: [],
                        datasets: [{
                            label: "Cost",
                            backgroundColor: "rgb(58 129 243)",
                            borderColor: "rgb(58 129 243)",
                            hoverBackgroundColor: "rgb(58 129 243)",
                            hoverBorderColor: "rgb(58 129 243)",
                            data: [],
                            barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
                        }, {
                            label: "Revenue",
                            backgroundColor: "#084dbc",
                            borderColor: "#084dbc",
                            hoverBackgroundColor: "#084dbc",
                            hoverBorderColor: "#084dbc",
                            data: [],
                            barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,
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
                                    labelString: 'Cost & Revenue',
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
                                    labelString: 'Organization',
                                    fontStyle: 'bold'
                                },
                                
                                stacked: false,
                                gridLines: {
                                    color: "transparent",
                                    display: false
                                },
                               
                            }]
                        },
                        plugins: {
                            datalabels: {
                                display: false,
                                 color: 'White',
                                // anchor: 'end',
                                // align: 'end'
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
                id: 'PaymentSummaryYearMonthCostRevenue',
                title: 'By Year Month',
                width: 12,
                type: 'chart',
                name: 'By Year Month',
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

                                // barPercentage: .325,
                                // categoryPercentage: .5,
                                // borderRadius: 5,
                                // borderSkipped: false
                            },
                            {
                                type: 'bar',
                                label: "Invoiced Services",
                                backgroundColor: "#ff9c01",
                                borderColor: "#ff9c01",
                                hoverBackgroundColor: "#ff9c01",
                                hoverBorderColor: "#ff9c01",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,

                                // barPercentage: .325,
                                // categoryPercentage: .5,
                                // borderRadius: 5,
                                // borderSkipped: false
                            },
                            {
                                type: 'bar',
                                label: "Payments",
                                backgroundColor: "#99c14e",
                                borderColor: "#99c14e",
                                hoverBackgroundColor: "#99c14e",
                                hoverBorderColor: "#99c14e",
                                data: [],
                                barThickness: 14,
                                categoryPercentage: 0.25,
                                barPercentage: 1.0,

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
                                    labelString: 'Cost,Revenue,Invoiced & Payments'
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
    },
]