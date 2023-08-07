import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';

import * as elasticsearch from 'elasticsearch-browser';
import { HttpUtilities } from '../utilities';
import { AppConstants } from '../../shared/app-constants';
import { HttpHeaders, HttpClient } from '@angular/common/http';


@Injectable()
export class ElasticsearchService {
  private client: elasticsearch.Client
  private appData = AppConstants;

  queryFilter;
  queryMonthsFilter;
  queryDropDown;
  queryMonthLabel;
  queryPracticewise;
  queryRegionwise;
  queryProjectPie;
  queryProjectMonths;
  queryPracticeswiseProjectTypeLabels;
  queryPracticewiseProjectTypes;
  querySubPracticeswiseProjectTypeLabels;
  querySubPracticewiseProjectTypes;
  queryTableData;
  queryProjectForEmployeeData;
  queryEmployeeMonthly;
  querPnLPie;
  queryPracticeswisePnLLabel;
  queryPracticeswisePnL;
  querySubPracticeswisePnLLabel;
  querySubPracticeswisePnL;
  queryPnLProjectTableData;
  queryPnLMonthlyTrend;
  queryPnLSecondTableData;
  queryPnLMonthlySecondTrend;
  queryProjectPnLFirstTable;
  queryFirstMonthlyTrendByProject;
  queryProjectPnLSecondTable;
  querySecondMonthlyTrendByProject;
  invoicedRevenueByCustomer: any;
  queryHrsByProject: any;
  queryHrsByResource: any;
  queryAvgWeeklyBillableHrs: any;
  queryMyTeamUtilization: any;
  queryMyTeamRevenue: any;
  queryProjectsGeneratedRevenue: any;
  queryOrgProjectRevenue: any;
  queryOrgProjectRevenueTest: any;
  queryProjectRevenue: any;
  queryProjectRevenueForGrid: any;
  queryMyResourceRevenueForGrid: any;

  queryalldocs = {
    "size": 10000,
    "_source": ["prj_practice", "prj_region", "prj_sub_practice", "prj_bu", "year"]
  }


  queryYear = {
    "size": 0,
    "aggs": {
      "by_color": {
        "terms": {
          "field": "year",
          "size": 100
        },
        "aggs": {
          "total_cost": {
            "sum": {
              "field": "project_cost"
            }
          },
          "total_revenue": {
            "sum": {
              "field": "project_revenue"
            }
          }
        }
      }
    }
  };

  filter(practice, region, business_unit, sub_practice, from_year, to_year) {
    this.queryFilter = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                { "wildcard": { "prj_practice.keyword": practice } },
                { "wildcard": { "prj_region.keyword": region } },
                { "wildcard": { "prj_sub_practice.keyword": sub_practice } },
                { "wildcard": { "prj_bu.keyword": business_unit } },
                {
                  "range": {
                    "year": {
                      "gte": from_year,
                      "lte": to_year
                    }
                  }
                }]
            }
          },
          "aggs": {
            "by_color": {
              "terms": {
                "field": "year",
                "size": 100
              },
              "aggs": {
                "total_cost": {
                  "sum": {
                    "field": "project_cost"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                },
                "sales_bucket_sort": {
                  "bucket_sort": {
                    "sort": [
                      { "total_revenue": { "order": "desc" } }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  monthsFilter(practice, region, business_unit, sub_practice, select_year) {
    this.queryMonthsFilter = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                { "wildcard": { "prj_practice.keyword": practice } },
                { "wildcard": { "prj_region.keyword": region } },
                { "wildcard": { "prj_sub_practice.keyword": sub_practice } },
                { "wildcard": { "prj_bu.keyword": business_unit } },
                { "term": { "year": select_year } }
              ]
            }
          },
          "aggs": {
            "by_color": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total_cost": {
                  "sum": {
                    "field": "project_cost"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  monthLabel(practice, region, business_unit, sub_practice, select_year) {
    this.queryMonthLabel = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                { "wildcard": { "prj_practice.keyword": practice } },
                { "wildcard": { "prj_region.keyword": region } },
                { "wildcard": { "prj_sub_practice.keyword": sub_practice } },
                { "wildcard": { "prj_bu.keyword": business_unit } },
                { "term": { "year": select_year } }
              ]
            }
          },
          "aggs": {
            "by_color": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total_cost": {
                  "sum": {
                    "field": "project_cost"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  practiceFilter(from_year, to_year) {
    this.queryPracticewise = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "range": {
              "year": {
                "gte": from_year,
                "lte": to_year
              }
            }
          },
          "aggs": {
            "by_color": {
              "terms": {
                "field": "prj_practice",
                "size": 100
              },
              "aggs": {
                "total_cost": {
                  "sum": {
                    "field": "project_cost"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                },
                "sales_bucket_sort": {
                  "bucket_sort": {
                    "sort": [
                      { "total_revenue": { "order": "desc" } }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  regionFilter(from_year, to_year) {
    this.queryRegionwise = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "range": {
              "year": {
                "gte": from_year,
                "lte": to_year
              }
            }
          },
          "aggs": {
            "by_color": {
              "terms": {
                "field": "prj_region",
                "size": 100
              },
              "aggs": {
                "total_cost": {
                  "sum": {
                    "field": "project_cost"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                },
                "sales_bucket_sort": {
                  "bucket_sort": {
                    "sort": [
                      { "total_revenue": { "order": "desc" } }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  // -------------------------------------------  DROPDOWN DATA  -------------------------------------------

  getDropdown() {
    return this.queryDropDown = {
      "size": 0,
      "aggs": {
        "by_year": {
          "terms": {
            "field": "year",
            "size": 10000
          }
        },
        "by_month": {
          "terms": {
            "field": "month"
            , "size": 10000
          }
        }
      }
    }
  }

  // -----------------------------------------   PROJECT TYPE PIE CHART    -----------------------------------

  filterProjectPie(year, org, project, practice, bu, subPractice, month, emp) {

    this.queryProjectPie = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_total_hours": {
              "sum": {
                "field": "employee_hours"
              }
            },
            "by_billable": {
              "sum": {
                "field": "billable_hours"
              }
            },
            "by_nonBillable": {
              "sum": {
                "field": "non_billable_hours"
              }
            },
            "by_internal": {
              "sum": {
                "field": "internal_hours"
              }
            },
            "by_PTO": {
              "sum": {
                "field": "pto_hours"
              }
            },
            "by_holiday": {
              "sum": {
                "field": "holiday_hours"
              }
            },
            "by_specialLeaves": {
              "sum": {
                "field": "special_leave_hours"
              }
            }
          }
        }
      }
    }
  }

  // -------------------------------------  PROJECT TYPE MONTHLY BAR CHART    -------------------------------

  projectMonthsLabel(year, org, project, practice, bu, subPractice) {
    this.queryProjectMonths = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_projectmonth": {
              "terms": {
                "field": "month",
                "size": 50
              }
            }
          }
        }
      }
    }
  }

  // -------------------------------------------- PROJECT TYPES(PRACTICEWISE) ----------------------------------

  filterPracticewiseProjectTypeLabel(year, org, project, practice, bu, subPractice, month, emp) {
    this.queryPracticeswiseProjectTypeLabels =
    {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_projectpractice": {
              "terms": {
                "field": "emp_practice.keyword",
                "size": 50
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "employee_hours"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getPracticeswiseProjectType(year, org, project, practice, bu, subPractice, month, emp) {
    this.queryPracticewiseProjectTypes = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_billable": {
              "terms": {
                "field": "emp_practice.keyword",
                "size": 50
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "billable_hours"
                  }
                }
              }
            },
            "by_nonBillable": {
              "terms": {
                "field": "emp_practice.keyword"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "non_billable_hours"
                  }
                }
              }
            },
            "by_internal": {
              "terms": {
                "field": "emp_practice.keyword",
                "size": 100
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "internal_hours"
                  }
                }
              }
            },
            "by_PTO": {
              "terms": {
                "field": "emp_practice.keyword",
                "size": 50
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "pto_hours"
                  }
                }
              }
            },
            "by_holiday": {
              "terms": {
                "field": "emp_practice.keyword"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "holiday_hours"
                  }
                }
              }
            },
            "by_specialLeaves": {
              "terms": {
                "field": "emp_practice.keyword",
                "size": 100
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "special_leave_hours"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // -------------------------------------------- PROJECT TYPES(SUB-PRACTICESWISE) -----------------------------
  filterSubPracticewiseProjectTypeLabel(year, org, project, practice, bu, subPractice, month, emp) {
    this.querySubPracticeswiseProjectTypeLabels = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_projectpractice": {
              "terms": {
                "field": "emp_sub_practice.keyword",
                "size": 50
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "employee_hours"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getSubPracticeswiseProjectType(year, org, project, practice, bu, subPractice, month, emp) {

    this.querySubPracticewiseProjectTypes = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_billable": {
              "terms": {
                "field": "emp_sub_practice.keyword",
                "size": 50
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "billable_hours"
                  }
                }
              }
            },
            "by_nonBillable": {
              "terms": {
                "field": "emp_sub_practice.keyword"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "non_billable_hours"
                  }
                }
              }
            },
            "by_internal": {
              "terms": {
                "field": "emp_sub_practice.keyword",
                "size": 100
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "internal_hours"
                  }
                }
              }
            },
            "by_PTO": {
              "terms": {
                "field": "emp_sub_practice.keyword",
                "size": 50
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "pto_hours"
                  }
                }
              }
            },
            "by_holiday": {
              "terms": {
                "field": "emp_sub_practice.keyword"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "holiday_hours"
                  }
                }
              }
            },
            "by_specialLeaves": {
              "terms": {
                "field": "emp_sub_practice.keyword",
                "size": 100
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "special_leave_hours"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  //  ------------------------------------- TABLE DATA --------------------------------------------------
  getEmployeeTableData(year, org, project, practice, bu, subPractice, month, emp) {
    this.queryTableData = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_employee": {
              "terms": {
                "field": "employee.keyword",
                "size": 10000
              },
              "aggs": {
                "by_department": {
                  "terms": {
                    "field": "emp_department.keyword"
                  },
                  "aggs": {
                    "by_employeehours": {
                      "sum": {
                        "field": "employee_hours"
                      }
                    },
                    // "by_employeeBU": {
                    //   "terms": {
                    //   "field": "emp_bu.keyword"
                    //   }
                    // },
                    // "by_practices": {
                    //   "terms": {
                    //   "field": "emp_practice.keyword"
                    //   }
                    // },
                    // "by_sub_practices": {
                    //   "terms": {
                    //   "field": "emp_sub_practice.keyword"
                    //   }
                    // },
                    "by_billable": {
                      "sum": {
                        "field": "billable_hours"
                      }
                    },
                    "by_nonBillable": {
                      "sum": {
                        "field": "non_billable_hours"
                      }
                    },
                    "by_intenal": {
                      "sum": {
                        "field": "internal_hours"
                      }
                    },
                    "by_pto": {
                      "sum": {
                        "field": "pto_hours"
                      }
                    },
                    "by_holiday": {
                      "sum": {
                        "field": "holiday_hours"
                      }
                    },
                    "by_specialLeaves": {
                      "sum": {
                        "field": "special_leave_hours"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ------------------------------------------------- 2nd(PROJECT) TABLE DATA -----------------------------------------------

  getProjectForEmployeeData(year, org, project, practice, bu, subPractice, month, emp, name, dept) {
    this.queryProjectForEmployeeData = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                },
                {
                  "term": {
                    "employee.keyword": name
                  }
                },
                // {
                //   "term": {
                //     "emp_department.keyword": dept
                //   }
                // }
              ]
            }
          },
          "aggs": {
            "by_project": {
              "terms": {
                "field": "project.keyword",
                "size": 10000
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "employee_hours"
                  }
                },
                "by_employeeBU": {
                  "terms": {
                    "field": "prj_bu.keyword"
                  }
                },
                "by_practices": {
                  "terms": {
                    "field": "prj_practice.keyword"
                  }
                },
                "by_sub_practices": {
                  "terms": {
                    "field": "prj_sub_practice.keyword"
                  }
                },
                "by_department": {
                  "terms": {
                    "field": "prj_department.keyword"
                  }
                },
                "by_billable": {
                  "sum": {
                    "field": "billable_hours"
                  }
                },
                "by_nonBillable": {
                  "sum": {
                    "field": "non_billable_hours"
                  }
                },
                "by_internal": {
                  "sum": {
                    "field": "internal_hours"
                  }
                },
                "by_pto": {
                  "sum": {
                    "field": "pto_hours"
                  }
                },
                "by_holiday": {
                  "sum": {
                    "field": "holiday_hours"
                  }
                },
                "by_specialLeave": {
                  "sum": {
                    "field": "special_leave_hours"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ------------------------------------------------- EMPLOYEE MONTHLY ------------------------------------------------------

  getByEmployee(name, dept, year, org, project, practice, bu, subPractice, emp) {

    this.queryEmployeeMonthly = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                // {
                //   "term": {
                //     "emp_department.keyword": dept
                //   }
                // },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "term": {
                    "employee.keyword": name
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_total_hours": {
              "terms": {
                "field": "month",
                "size": 50
              },
              "aggs": {
                "by_monthlyTotal": {
                  "sum": {
                    "field": "employee_hours"
                  }
                }
              }
            },
            // {
            //   "sum": {
            //     "field": "employee_hours"
            //   }
            // },
            "by_billableMonthly": {
              "terms": {
                "field": "month"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "billable_hours"
                  }
                }
              }
            },
            "by_nonbillableMonthly": {
              "terms": {
                "field": "month"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "non_billable_hours"
                  }
                }
              }
            },
            "by_internalMonthly": {
              "terms": {
                "field": "month"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "internal_hours"
                  }
                }
              }
            },
            "by_ptoMonthly": {
              "terms": {
                "field": "month"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "pto_hours"
                  }
                }
              }
            },
            "by_holidayMonthly": {
              "terms": {
                "field": "month"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "holiday_hours"
                  }
                }
              }
            },
            "by_specialLeavesMonthly": {
              "terms": {
                "field": "month"
              },
              "aggs": {
                "by_employeehours": {
                  "sum": {
                    "field": "special_leave_hours"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ------------------------------------------ PnL PIE CHART ---------------------------------------------

  filterPnLPie(year, org, practice, bu, subPractice, month, emp) {
    this.querPnLPie = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_selection": {
              "terms": {
                "field": "employee.keyword",
                "size": 10000
              },
              "aggs": {
                "by_monthAvgCost": {
                  "terms": {
                    "field": "month",
                    "size": 100
                  },
                  "aggs": {
                    "total": {
                      "avg": {
                        "field": "employee_monthly_cost"
                      }
                    }
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ---------------------------------------  PnL CHART(PRACTICESWISE)  -------------------------------------

  filterPracticeswisePnLLabel(year, org, practice, bu, subPractice, month, emp) {
    this.queryPracticeswisePnLLabel = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_practicewise": {
              "terms": {
                "field": "emp_practice.keyword",
                "size": 100
              }
            }
          }
        }
      }
    }
  }

  filterPracticeswisePnL(year, org, practice, bu, subPractice, month, emp) {
    this.queryPracticeswisePnL = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_practicewiseCost": {
              "terms": {
                "field": "emp_practice.keyword",
                "size": 100
              }, "aggs": {
                "by_selection": {
                  "terms": {
                    "field": "employee.keyword",
                    "size": 10000
                  },
                  "aggs": {
                    "total": {
                      "terms": {
                        "field": "month",
                        "size": 100
                      },
                      "aggs": {
                        "total": {
                          "avg": {
                            "field": "employee_monthly_cost"
                          }
                        }
                      }
                    }
                  }
                },
                "by_practicewiseRevenue": {
                  "terms": {
                    "field": "emp_practice.keyword",
                    "size": 100
                  },
                  "aggs": {
                    "total": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // --------------------------------------------  PnL CHART(SUB-PRACTICESWISE)  --------------------------------------

  filterSubPracticeswisePnLLabel(year, org, practice, bu, subPractice, month, emp) {
    this.querySubPracticeswisePnLLabel = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_SubPracticewise": {
              "terms": {
                "field": "emp_sub_practice.keyword",
                "size": 100
              }
            }
          }
        }
      }
    }
  }

  filterSubPracticeswisePnL(year, org, practice, bu, subPractice, month, emp) {
    this.querySubPracticeswisePnL = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_subPracticewiseCost": {
              "terms": {
                "field": "emp_sub_practice.keyword",
                "size": 100
              },
              "aggs": {
                "by_selection": {
                  "terms": {
                    "field": "employee.keyword",
                    "size": 10000
                  },
                  "aggs": {
                    "total": {
                      "terms": {
                        "field": "month",
                        "size": 100
                      },
                      "aggs": {
                        "total": {
                          "avg": {
                            "field": "employee_monthly_cost"
                          }
                        }
                      }
                    }
                  }
                },
                "by_subPracticewiseRevenue": {
                  "terms": {
                    "field": "emp_sub_practice.keyword",
                    "size": 100
                  },
                  "aggs": {
                    "total": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ---------------------------------------- PnL TABLE DATA ----------------------------------------------

  filterPnLProjectTableData(year, org, practice, bu, subPractice, month, emp) {
    this.queryPnLProjectTableData = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_selection": {
              "terms": {
                "field": "employee.keyword",
                "size": 10000
              },
              "aggs": {
                "by_department": {
                  "terms": {
                    "field": "emp_department.keyword"
                  },
                  "aggs": {
                    "by_practices": {
                      "terms": {
                        "field": "emp_practice.keyword"
                      }
                    },
                    "by_sub_practices": {
                      "terms": {
                        "field": "emp_sub_practice.keyword"
                      }
                    },
                    "by_employeeBU": {
                      "terms": {
                        "field": "emp_bu.keyword"
                      }
                    },
                    "by_monthAvgCost": {
                      "terms": {
                        "field": "month",
                        "size": 100
                      },
                      "aggs": {
                        "total": {
                          "avg": {
                            "field": "employee_monthly_cost"
                          }
                        }
                      }
                    },
                    "total_hours": {
                      "sum": {
                        "field": "employee_hours"
                      }
                    },
                    "region": {
                      "terms": {
                        "field": "emp_region.keyword"
                      }
                    },
                    "total_revenue": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ------------------------------------------------ PnL MONTHLY TREND ---------------------------------

  filterPnLMonthlyTrend(year, org, practice, bu, subPractice, emp, name, dept) {
    this.queryPnLMonthlyTrend = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": subPractice
                  }
                },
                // {
                //   "term": {
                //     "emp_department.keyword": dept
                //   }
                // },
                {
                  "term": {
                    "employee.keyword": name
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_monthCost": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "avg": {
                    "field": "employee_monthly_cost"
                  }
                }
              }
            },
            "by_monthRevenue": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // -------------------------------------------  PnL 2nd TABLE DATA ------------------------------------------------

  filterPnLSecondTableData(year, month, emp, name, department) {
    this.queryPnLSecondTableData = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": emp
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                },
                {
                  "term": {
                    "employee.keyword": name
                  }
                },
                // {
                //   "term": {
                //     "emp_department.keyword": department
                //   }
                // }
              ]
            }
          },
          "aggs": {
            "by_selection": {
              "terms": {
                "field": "project.keyword",
                "size": 10000
              },
              "aggs": {
                "by_practices": {
                  "terms": {
                    "field": "prj_practice.keyword"
                  }
                },
                "by_sub_practices": {
                  "terms": {
                    "field": "prj_sub_practice.keyword"
                  }
                },
                "by_employeeBU": {
                  "terms": {
                    "field": "prj_bu.keyword"
                  }
                },
                "by_department": {
                  "terms": {
                    "field": "prj_department.keyword"
                  }
                },
                "total_cost": {
                  "sum": {
                    "field": "project_cost"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }

  }

  // ------------------------------------------------ PnL SECOND MONTHLY TREND ---------------------------------

  filterPnLMonthlySecondTrend(year, prj_name, emp_name) {
    this.queryPnLMonthlySecondTrend = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "term": {
                    "project.keyword": prj_name
                  }
                },
                {
                  "term": {
                    "employee.keyword": emp_name
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_monthCost": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "sum": {
                    "field": "project_cost"
                  }
                }
              }
            },
            "by_monthRevenue": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ----------------------------------------- PM DASHBOARD 1st TABLE ---------------------------------------

  getProjectPnlFirstTable(year, org, practice, bu, subPractice, month, project) {

    this.queryProjectPnLFirstTable = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "prj_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "prj_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "prj_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "prj_sub_practice.keyword": subPractice
                  }
                },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_selection": {
              "terms": {
                "field": "project.keyword",
                "size": 10000
              },
              "aggs": {
                "by_practices": {
                  "terms": {
                    "field": "prj_practice.keyword"
                  }
                },
                "by_sub_practices": {
                  "terms": {
                    "field": "prj_sub_practice.keyword"
                  }
                },
                "by_employeeBU": {
                  "terms": {
                    "field": "prj_bu.keyword"
                  }
                },
                "by_department": {
                  "terms": {
                    "field": "prj_department.keyword"
                  }
                },
                "region": {
                  "terms": {
                    "field": "prj_region.keyword"
                  }
                },
                "by_monthAvgCost": {
                  "terms": {
                    "field": "month",
                    "size": 100
                  },
                  "aggs": {
                    "total": {
                      "sum": {
                        "field": "project_cost"
                      }
                    }
                  }
                },
                "total_hours": {
                  "sum": {
                    "field": "employee_hours"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }

  }

  // ------------------------------------------------- PM-DASHBOARD 1st MONTHLY TREND -----------------------------------------------

  getFirstMonthlyTrendByProject(year, org, practice, bu, subPractice, project, name) {
    this.queryFirstMonthlyTrendByProject = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "prj_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "prj_bu.keyword": bu
                  }
                },
                {
                  "terms": {
                    "prj_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "prj_sub_practice.keyword": subPractice
                  }
                },
                {
                  "term": {
                    "project.keyword": name
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_monthCost": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "sum": {
                    "field": "project_cost"
                  }
                }
              }
            },
            "by_monthRevenue": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // --------------------------------------------- PM-DASHBOARD 2nd TABLE ----------------------------------------------------------

  getProjectPnLSecondTable(year, month, project, name) {
    this.queryProjectPnLSecondTable = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                // {
                //   "terms": {
                //     "project.keyword": project
                //   }
                // },
                {
                  "regexp": {
                    "yearmonth.keyword": month
                  }
                },
                {
                  "term": {
                    "project.keyword": name
                  }
                }
              ],
              "must_not": [
                {
                  "term": {
                    "employee.keyword": "Non Billable Expenses"
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_selection": {
              "terms": {
                "field": "employee.keyword",
                "size": 10000
              },
              "aggs": {
                "by_practices": {
                  "terms": {
                    "field": "emp_practice.keyword"
                  }
                },
                "by_sub_practices": {
                  "terms": {
                    "field": "emp_sub_practice.keyword"
                  }
                },
                "by_employeeBU": {
                  "terms": {
                    "field": "emp_bu.keyword"
                  }
                },
                "by_department": {
                  "terms": {
                    "field": "emp_department.keyword"
                  }
                },
                "total_cost": {
                  "sum": {
                    "field": "project_cost"
                  }
                },
                "total_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // --------------------------------------------- PM-DASHBOARD 2nd MONTHLY TREND --------------------------------------------------

  getSecondMonthlyTrendByProject(year, project, emp_name, prj_name) {
    this.querySecondMonthlyTrendByProject = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "term": {
                    "employee.keyword": emp_name
                  }
                },
                {
                  "term": {
                    "project.keyword": prj_name
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_monthCost": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "sum": {
                    "field": "project_cost"
                  }
                }
              }
            },
            "by_monthRevenue": {
              "terms": {
                "field": "month",
                "size": 100
              },
              "aggs": {
                "total": {
                  "sum": {
                    "field": "project_revenue"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getInvoincedRevenueByCustomer(rectype: any, org: any, min: any, max: any, employee: any) {
    this.invoicedRevenueByCustomer = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "rec_type.keyword": rectype
                  }
                },
                {
                  "terms": {
                    "prj_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "employee.keyword": employee
                  }
                },
                // {
                //   "range": {
                //     "yearmonth": {
                //       "gte": min,
                //       "lte": max
                //     }
                //   }
                // }
              ]
            }
          },
          "aggs": {
            "by_customer": {
              "terms": {
                "field": "customer.keyword",
                "size": 1000
              },
              "aggs": {
                "by_revenue": {
                  "sum": {
                    "field": "project_revenue"
                  }
                },
                "by_org": {
                  "terms": {
                    "field": "prj_organization.keyword"
                  }
                },
                "by_yearMonth": {
                  "terms": {
                    "field": "yearmonth.keyword",
                    "size": 100
                  },
                  "aggs": {
                    "revenue": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getHoursByProjectData(org: any, region: any, practice: any, subPractice: any, client: any, project: any, spendDate: any, isBillable: any, empStatus: any) {
    this.queryHrsByProject = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "terms": {
                    "prj_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "prj_region.keyword": region
                  }
                },
                {
                  "terms": {
                    "prj_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "prj_sub_practice.keyword": subPractice
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "customer.keyword": client
                  }
                },
                {
                  "wildcard": {
                    "task_type.keyword": isBillable
                  }
                },
                {
                  "wildcard": {
                    "employee_status.keyword": empStatus
                  }
                },
                {
                  "range": {
                    "week_end_date": {
                      "gte": "now-" + spendDate + "w/w",
                      "lte": "now"
                    }
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_project": {
              "terms": {
                "field": "project.keyword",
                "size": 1000
              },
              "aggs": {
                "by_employee": {
                  "terms": {
                    "field": "employee.keyword",
                    "size": 1000
                  },
                  "aggs": {
                    "by_week": {
                      "date_histogram": {
                        "field": "week_end_date",
                        "format": "MMM-dd",
                        "interval": "week"
                      },
                      "aggs": {
                        "by_total_hours": {
                          "sum": {
                            "field": "hours"
                          }
                        }
                      }
                    },
                    "by_total_hours": {
                      "sum": {
                        "field": "hours"
                      }
                    },
                    "by_empStatus": {
                      "terms": {
                        "field": "employee_status.keyword"
                      }
                    }
                  }
                },
                "by_org": {
                  "terms": {
                    "field": "prj_organization.keyword"
                  }
                },
                "by_xferOrg": {
                  "terms": {
                    "field": "prj_region.keyword"
                  }
                },
                "by_practice": {
                  "terms": {
                    "field": "prj_practice.keyword"
                  }
                },
                "by_sub_pract": {
                  "terms": {
                    "field": "prj_sub_practice.keyword"
                  }
                },
                "by_taskType": {
                  "terms": {
                    "field": "task_type.keyword"
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  getHoursByResourceData(empOrg, empXferOrg, empPract, empSubPract, employeeName, isInternal, spendDate, isBillable, empStatus) {
    this.queryHrsByResource = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "terms": {
                    "emp_organization.keyword": empOrg
                  }
                },
                {
                  "terms": {
                    "emp_xfer_entity.keyword": empXferOrg
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": empPract
                  }
                },
                {
                  "terms": {
                    "emp_sub_practice.keyword": empSubPract
                  }
                },
                {
                  "terms": {
                    "employee.keyword": employeeName
                  }
                },
                {
                  "wildcard": {
                    "task_type.keyword": isBillable
                  }
                },
                {
                  "wildcard": {
                    "employee_status.keyword": empStatus
                  }
                },
                {
                  "range": {
                    "week_end_date": {
                      "gte": "now-" + spendDate + "w/w",
                      "lte": "now"
                    }
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_employee": {
              "terms": {
                "field": "employee.keyword",
                "size": 1000
              },
              "aggs": {
                "by_project": {
                  "terms": {
                    "field": "project.keyword",
                    "size": 1000
                  },
                  "aggs": {
                    "by_week": {
                      "date_histogram": {
                        "field": "week_end_date",
                        "format": "MMM-dd",
                        "interval": "week"
                      },
                      "aggs": {
                        "by_total_hours": {
                          "sum": {
                            "field": "hours"
                          }
                        }
                      }
                    },
                    "by_total_hours": {
                      "sum": {
                        "field": "hours"
                      }
                    }
                  }
                },
                "by_org": {
                  "terms": {
                    "field": "emp_organization.keyword"
                  }
                },
                "by_xferOrg": {
                  "terms": {
                    "field": "emp_xfer_entity.keyword"
                  }
                },
                "by_practice": {
                  "terms": {
                    "field": "emp_practice.keyword"
                  }
                },
                "by_sub_pract": {
                  "terms": {
                    "field": "emp_sub_practice.keyword"
                  }
                },
                "by_taskType": {
                  "terms": {
                    "field": "task_type.keyword"
                  }
                },
                "by_empStaus": {
                  "terms": {
                    "field": "employee_status.keyword"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getAvgWeeklyBillableHrs(taskType: any, org: any, practice: any, week: any, employee: any, empType: any) {
    this.queryAvgWeeklyBillableHrs = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "task_type.keyword": taskType
                  }
                },
                {
                  "terms": {
                    "employee.keyword": employee
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "emp_practice.keyword": practice
                  }
                },
                {
                  "terms": {
                    "employee_type.keyword": empType
                  }
                },
                {
                  "range": {
                    "week_end_date": {
                      "gte": "now-" + week + "w/w",
                      "lte": "now"
                    }
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_employee": {
              "terms": {
                "field": "employee.keyword",
                "size": 1000
              },
              "aggs": {
                "by_week": {
                  "date_histogram": {
                    "field": "week_end_date",
                    "format": "MMM_dd",
                    "interval": "week"
                  },
                  "aggs": {
                    "by_hours_sum": {
                      "sum": {
                        "field": "hours"
                      }
                    },
                    "by_hours_avg": {
                      "avg": {
                        "field": "hours"
                      }
                    }
                  }
                },
                "by_org": {
                  "terms": {
                    "field": "emp_organization.keyword"
                  }
                },
                "by_practice": {
                  "terms": {
                    "field": "emp_practice.keyword"
                  }
                },
                "by_empType": {
                  "terms": {
                    "field": "employee_type.keyword"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getMyTeamRevenueData(employee: any, project: any, org: any, min: any, max: any, client: any) {
    this.queryMyTeamRevenue = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "terms": {
                    "employee.keyword": employee
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "prj_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "customer.keyword": client
                  }
                },
                {
                  "range": {
                    "year": {
                      "gte": min,
                      "lte": max
                    }
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_year": {
              "terms": {
                "field": "year",
                "size": 10000
              },
              "aggs": {
                "by_month": {
                  "terms": {
                    "field": "month",
                    "size": 10000
                  },
                  "aggs": {
                    "by_revenue": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getMyTeamUtilizationData(org: any, employee: any, project: any, year: any, client: any) {
    this.queryMyTeamUtilization = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "term": {
                    "year": year
                  }
                },
                {
                  "terms": {
                    "employee.keyword": employee
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "emp_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "customer.keyword": client
                  }
                },
                // {
                //   "terms": {
                //     "emp_practice.keyword": pract
                //   }
                // },
                // {
                //   "terms": {
                //     "emp_sub_practice.keyword": subPrac
                //   }
                // }
              ]
            }
          },
          "aggs": {
            "by_month": {
              "terms": {
                "field": "month",
                "size": 10000
              },
              "aggs": {
                "by_billable": {
                  "sum": {
                    "field": "billable_hours"
                  }
                },
                "by_nonBillable": {
                  "sum": {
                    "field": "non_billable_hours"
                  }
                },
                "by_internal": {
                  "sum": {
                    "field": "internal_hours"
                  }
                },
                "by_PTO": {
                  "sum": {
                    "field": "pto_hours"
                  }
                },
                "by_holiday": {
                  "sum": {
                    "field": "holiday_hours"
                  }
                },
                "by_specialLeaves": {
                  "sum": {
                    "field": "special_leave_hours"
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  // ----------------------------------------------------------------------------------------------------------------------------------------

  getProjectsGeneratedRevenue(year: any, org: any, project: any, employee: any, customer: any) {
    this.queryProjectsGeneratedRevenue = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                // {
                //   "term": {
                //     "year": year
                //   }
                // },
                {
                  "terms": {
                    "employee.keyword": employee
                  }
                },
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "terms": {
                    "prj_organization.keyword": org
                  }
                },
                {
                  "terms": {
                    "customer.keyword": customer
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_project": {
              "terms": {
                "field": "project.keyword",
                "size": 10000
              },
              "aggs": {
                "by_month": {
                  "terms": {
                    "field": "month",
                    "size": 100
                  },
                  "aggs": {
                    "total_revenue": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getMyOrgProjectRevenue(project: any, minYear: any, maxyear: any) {
    this.queryOrgProjectRevenue = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": [
                {
                  "terms": {
                    "project.keyword": project
                  }
                },
                {
                  "range": {
                    "year": {
                      "gte": minYear,
                      "lte": maxyear
                    }
                  }
                }
              ]
            }
          },
          "aggs": {
            "by_year": {
              "terms": {
                "field": "year",
                "size": 10000
              },
              "aggs": {
                "by_month": {
                  "terms": {
                    "field": "month",
                    "size": 10000
                  },
                  "aggs": {
                    "by_revenue": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    },
                    "by_cost": {
                      "sum": {
                        "field": "project_cost"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getMyResourceRevenueForGrid(org: any, pract: any, subPract: any, employee: any, project: any, minYear: any, maxYear: any) {
    this.queryMyResourceRevenueForGrid = {
      "size": 10000,
      "query": {
        "bool": {
          "must": [
            {
              "terms": {
                "prj_organization.keyword": org
              }
            },
            {
              "terms": {
                "prj_practice.keyword": pract
              }
            },
            {
              "terms": {
                "prj_sub_practice.keyword": subPract
              }
            },
            {
              "terms": {
                "employee.keyword": employee
              }
            },
            {
              "terms": {
                "project.keyword": project
              }
            },
            {
              "range": {
                "year": {
                  "gte": minYear,
                  "lte": maxYear
                }
              }
            }
          ]
        }
      }
    }
  }

  getProjectRevenueForGrid(org: any, region: any, pract: any, subPract: any, client: any, project: any, minYear: any, maxYear: any) {
    this.queryProjectRevenueForGrid = {
      "size": 10000,
      "query": {
        "bool": {
          "must": [
            {
              "terms": {
                "prj_organization.keyword": org
              }
            },
            {
              "terms": {
                "prj_region.keyword": region
              }
            },
            // {
            //   "terms": {
            //     "prj_practice.keyword": pract
            //   }
            // },
            // {
            //   "terms": {
            //     "prj_sub_practice.keyword": subPract
            //   }
            // },
            {
              "terms": {
                "customer.keyword": client
              }
            },
            {
              "terms": {
                "project.keyword": project
              }
            },
            {
              "range": {
                "year": {
                  "gte": minYear,
                  "lte": maxYear
                }
              }
            }
          ]
        }
      }
    }
  }

  getProjectRevenue(org: any, region: any, pract: any, subPract: any, client: any, project: any, minYear: any, maxYear: any) {
    let mustArr: any = [];
    let rangeTerm: any;
    let orgTerm: any;
    let prjTerm: any;
    let clientTerm: any;
    let regionTerm: any;
    let practTerm: any;
    let subPractTerm: any;
    if (org.length > 0 && minYear && maxYear) {
      rangeTerm = {
        "range": {
          "year": {
            "gte": minYear,
            "lte": maxYear
          }
        }
      }
      mustArr.push(rangeTerm);
    }
    else {
      rangeTerm = {
        "range": {
          "year": {
            "gte": 0,
            "lte": 0
          }
        }
      }
      mustArr.push(rangeTerm);
    }
    if (org.length > 0) {
      orgTerm = {
        "terms": {
          "prj_organization.keyword": org
        }
      }
      mustArr.push(orgTerm);
    }
    if (client.length > 0) {
      clientTerm = {
        "terms": {
          "customer.keyword": client
        }
      }
      mustArr.push(clientTerm);
    }
    if (project.length > 0) {
      prjTerm = {
        "terms": {
          "project.keyword": project
        }
      }
      mustArr.push(prjTerm);
    }
    if (region.length > 0) {
      regionTerm = {
        "terms": {
          "prj_region.keyword": region
        }
      }
      mustArr.push(regionTerm);
    }
    if (pract.length > 0) {
      practTerm = {
        "terms": {
          "prj_practice.keyword": pract
        }
      }
      mustArr.push(practTerm);
    }
    if (subPract.length > 0) {
      subPractTerm = {
        "terms": {
          "prj_sub_practice.keyword": subPract
        }
      }
      mustArr.push(subPractTerm);
    }
    this.queryProjectRevenue = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": mustArr
            }
          },
          "aggs": {
            "by_year": {
              "terms": {
                "field": "year",
                "size": 10000
              },
              "aggs": {
                "by_month": {
                  "terms": {
                    "field": "month",
                    "size": 10000
                  },
                  "aggs": {
                    "by_revenue": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    },
                    "by_cost": {
                      "sum": {
                        "field": "project_cost"
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }

  getMyOrgProjectRevenueTest(employee: any, org: any, project: any, pract: any, subPract: any, minYear: any, maxyear: any) {
    let mustArr: any = [];
    let empTerm: any;
    let rangeTerm: any;
    let orgTerm: any;
    let prjTerm: any;
    // let clientTerm: any;
    let practTerm: any;
    let subPractTerm: any;
    if (employee.length > 0) {
      empTerm = {
        "terms": {
          "employee.keyword": employee
        }
      }
      mustArr.push(empTerm);
    }
    if (minYear && maxyear && employee.length > 0) {
      rangeTerm = {
        "range": {
          "year": {
            "gte": minYear,
            "lte": maxyear
          }
        }
      }
      mustArr.push(rangeTerm);
    }
    else if (minYear && maxyear && org.length > 0) {
      rangeTerm = {
        "range": {
          "year": {
            "gte": minYear,
            "lte": maxyear
          }
        }
      }
      mustArr.push(rangeTerm);
    }
    else {
      rangeTerm = {
        "range": {
          "year": {
            "gte": 0,
            "lte": 0
          }
        }
      }
      mustArr.push(rangeTerm);
    }
    if (org.length > 0) {
      orgTerm = {
        "terms": {
          "emp_organization.keyword": org
        }
      }
      mustArr.push(orgTerm);
    }
    // if (client.length > 0) {
    //   clientTerm = {
    //     "terms": {
    //       "customer.keyword": client
    //     }
    //   }
    //   mustArr.push(clientTerm);
    // }
    if (project.length > 0) {
      prjTerm = {
        "terms": {
          "project.keyword": project
        }
      }
      mustArr.push(prjTerm);
    }
    if (pract.length > 0) {
      practTerm = {
        "terms": {
          "emp_practice.keyword": pract
        }
      }
      mustArr.push(practTerm);
    }
    if (subPract.length > 0) {
      subPractTerm = {
        "terms": {
          "emp_sub_practice.keyword": subPract
        }
      }
      mustArr.push(subPractTerm);
    }

    this.queryOrgProjectRevenueTest = {
      "size": 0,
      "aggs": {
        "filtered": {
          "filter": {
            "bool": {
              "must": mustArr
            }
          },
          "aggs": {
            "by_year": {
              "terms": {
                "field": "year",
                "size": 10000
              },
              "aggs": {
                "by_month": {
                  "terms": {
                    "field": "month",
                    "size": 10000
                  },
                  "aggs": {
                    "by_revenue": {
                      "sum": {
                        "field": "project_revenue"
                      }
                    },
                    "by_revenue_avg": {
                      "avg": {
                        "field": "project_revenue"
                      }
                    },
                    "by_employee": {
                      "terms": {
                        "field": "employee.keyword",
                        "size": 10000
                      },
                      "aggs": {
                        "by_cost": {
                          "avg": {
                            "field": "employee_monthly_cost"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }


  constructor(private httpUtilities: HttpUtilities, private http: HttpClient) {
    if (!this.client) {
      this.connect();
    }
  }

  private connect() {
    // this.client = new elasticsearch.Client({
    // host: this.appData.elasticSearchURL,
    // log: 'trace'
    // });
  }
  // private connect() {
  //   this.client = new elasticsearch.Client({
  //     host: 'http://localhost:9200',
  //     // log: 'trace'
  //   });
  // }

  getInvRevByCust(_index): any {
    return this.client.search({
      index: _index,
      body: this.invoicedRevenueByCustomer,
      filterPath: ['hits.hits._source']
    });
  }

  getAllDocuments(_index): any {
    return this.client.search({
      index: _index,
      body: this.queryalldocs,
      filterPath: ['hits.hits._source']
    });
  }

  getYear(_index): any {
    return this.client.search({
      index: _index,
      body: this.queryYear,
      filterPath: ['aggregations.by_color.buckets']
    });
  }

  getFiltered(_index): any {
    return this.client.search({
      index: _index,
      body: this.queryFilter
    });
  }

  getMonthsFilter(_index): any {
    return this.client.search({
      index: _index,
      body: this.queryMonthsFilter
    });
  }

  getMonthLabel(_index): any {
    return this.client.search({
      index: _index,
      body: this.queryMonthLabel
    });
  }

  getPracticewise(_index): any {
    return this.client.search({
      index: _index,
      body: this.queryPracticewise
    });
  }

  getRegionWise(_index): any {
    return this.client.search({
      index: _index,
      body: this.queryRegionwise
    });
  }

  // ----------------------------------------  ELASTICSEARCH SERVICE  -------------------------------------------

  getFromService(queryFlag): Observable<any> {

    let query;
    switch (queryFlag) {

      case 0: query = this.getDropdown();
        break;
      case 1: query = this.queryProjectPie;
        break;
      case 2: query = this.querySubPracticewiseProjectTypes;
        break;
      case 3: query = this.querySubPracticeswiseProjectTypeLabels;
        break;
      case 4: query = this.queryTableData;
        break;
      case 5: query = this.queryEmployeeMonthly;
        break;
      case 6: query = this.queryProjectMonths;
        break;
      case 7: query = this.queryPracticewiseProjectTypes;
        break;
      case 8: query = this.queryPracticeswiseProjectTypeLabels;
        break;
      case 9: query = this.querPnLPie;
        break;
      case 10: query = this.queryPracticeswisePnL;
        break;
      case 11: query = this.queryPracticeswisePnLLabel;
        break;
      case 12: query = this.querySubPracticeswisePnL;
        break;
      case 13: query = this.querySubPracticeswisePnLLabel;
        break;
      case 14: query = this.queryPnLProjectTableData;
        break;
      case 15: query = this.queryPnLMonthlyTrend;
        break;
      case 16: query = this.queryPnLSecondTableData;
        break;
      case 17: query = this.queryPnLMonthlySecondTrend;
        break;
      case 18: query = this.queryProjectForEmployeeData;
        break;
      case 19: query = this.queryProjectPnLFirstTable;
        break;
      case 20: query = this.queryFirstMonthlyTrendByProject;
        break;
      case 21: query = this.queryProjectPnLSecondTable;
        break;
      case 22: query = this.querySecondMonthlyTrendByProject;
        break;
    }
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getInvRevenueByCust(): Observable<any> {
    //   let headers = new HttpHeaders();

    // headers = headers.set("auth_token", localStorage.getItem('token'))
    //       .set("index", "osi_rev_rec_index")
    //       .set(AppConstants.contentType, AppConstants.JSONContentType);
    //   let query = this.invoicedRevenueByCustomer;
    //   return this.http.post(this.appData.appUrl + 'elastic/getEmpTimesheetHistory', query, {headers:headers,reportProgress: true, observe: 'events'})
    //     .map((response: any) => response)
    //     .catch(this.handleError);

    let query = this.invoicedRevenueByCustomer;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getHrsByProjectData(): Observable<any> {
    let query = this.queryHrsByProject;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_timesheet_details_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getHrsByResourceData(): Observable<any> {
    let query = this.queryHrsByResource;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_timesheet_details_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getAvgWeeklybillhrs(): Observable<any> {
    let query = this.queryAvgWeeklyBillableHrs;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_timesheet_details_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getMyTeamUtilization(): Observable<any> {
    let query = this.queryMyTeamUtilization;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getMyTeamRevenue(): Observable<any> {
    let query = this.queryMyTeamRevenue;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getProjectsRevenue(): Observable<any> {
    let query = this.queryProjectsGeneratedRevenue;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getOrgProjectRevenue(): Observable<any> {
    let query = this.queryOrgProjectRevenue;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getOrgProjectRevenueTest(): Observable<any> {
    let query = this.queryOrgProjectRevenueTest;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getProjectRevenueData(): Observable<any> {
    let query = this.queryProjectRevenue;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getProjectRevenueDataForGrid(): Observable<any> {
    let query = this.queryProjectRevenueForGrid;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  getMyResourceRevenueDataForGrid(): Observable<any> {
    let query = this.queryMyResourceRevenueForGrid;
    return this.httpUtilities.post(this.appData.appUrl + 'osi_rev_rec_index' + '/getEmpTimesheetHistory', query)
      .map((response: any) => response)
      .catch(this.handleError);
  }

  private handleError(error: Response) {
    console.error("error========", error);
    return Observable.throw(error || 'Failed in web api(Server error) ');
  }

}

