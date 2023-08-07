import { Component, OnInit } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Observable } from "rxjs/Observable";
import { Http, Response } from "@angular/http";
import { HttpUtilities } from "../../shared/utilities";
import { AppConstants } from "../../shared/app-constants";
import { ApproveLeaveService } from "../../shared/services/approveleave.service";

@Component({
  selector: "app-approve-leave",

  templateUrl: "./approve-leave.component.html",
  styleUrls: ["./approve-leave.component.css"]
})
export class ApproveLeaveComponent implements OnInit {
  totalLeaveReq: number = 0;
  errorMessage: string;
  private appData = AppConstants;
  crntpage = 1;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private approveLeaveService: ApproveLeaveService
  ) {}
  leaves: any[];
  p: any;
  responseData;
  showAlert;
  alertText;

  ngOnInit() {
    this.getApprovedLeaves();
    history.pushState(null, null, location.href);
    window.onpopstate = function(event) {
    history.go(1);
    };
    this.responseData = this.route.snapshot.params;
    console.log(this.responseData);
    if (this.responseData) {
      this.showAlert = this.responseData.p1;
      this.alertText = this.responseData.p2;
      let ref = this;
      setTimeout(function() {
        ref.showAlert = false;
      }, 5000);
    }
  }

  getApprovedLeaves() {
    this.approveLeaveService.getAppliedLeaves().subscribe(resp => {
      this.leaves = resp.reverse();
      this.totalLeaveReq = this.leaves.length;
      console.log("Applied leaves=========>");
      console.log(this.leaves);
    });
  }

  getEmployeeLeaveDetailsAtApprovalTime(leaveId) {
    this.approveLeaveService
      .getEmployeeLeaveDetailsAtApprovalTime(leaveId)
      .subscribe(requestService => {},
      error => (this.errorMessage = <any>error));
  }

  openLeave(leave) {
    this.getEmployeeLeaveDetailsAtApprovalTime(leave.leaveId);
    this.router.navigate(
      ["/leaves/approve-leave/appliedleaves/" + leave.leaveId],
      { relativeTo: this.route }
    );
  }

  private handleError(error: Response) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    console.error("error========" + error);
    return Observable.throw(
      error.json().error || "Failed in web api(Server error) "
    );
  }
}
