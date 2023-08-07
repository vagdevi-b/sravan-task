import { LoginService } from './../sidebar/login.service';
import {Component, OnInit, EventEmitter, Output, ElementRef, ChangeDetectorRef} from '@angular/core';
import { ModalOptions } from 'ngx-bootstrap';
import { clone } from 'underscore';
import * as _ from 'underscore';
import { ToastrService } from 'ngx-toastr';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

// only this many menus can be set as favourites
const MAX_FAVOURITES_COUNT = 10;

@Component({
  selector: 'app-favourite-settings',
  templateUrl: './favourite-settings.component.html',
  styleUrls: ['./favourite-settings.component.css']
})
export class FavouriteSettingsComponent implements OnInit {
  token = '';
  menuList = [];
  menuItems = [];
  favList = [];
  toolbarDirty = false;
  selectedList = [];
  @Output() readonly closeParentModal: EventEmitter<any> = new EventEmitter();
  constructor(
    public inputData: ModalOptions,
    private modal: NgbActiveModal,
    private loginService: LoginService,
    private ts: ToastrService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.menuItems = this.inputData['data'];
    this.menuItems.forEach((item, index) => {
      if ((this.favList.length > 0 && !this.menuExists(item.groupTitle)) || this.favList.length === 0) {
        this.favList.push({
          createdBy: item.createdBy,
          createdOn: item.createdOn,
          groupId: item.groupId,
          groupTitle: item.groupTitle,
        });
      }
    });

    this.favList.forEach((item) => {
      const child = [];
      this.menuItems.forEach((sitem) => {
        if (item.groupTitle === sitem.groupTitle) {
          child.push({
            id: sitem.id,
            isFavourite: sitem.isFavourite,
            userId: sitem.userId,
            itemId: sitem.itemId,
            itemTitle: sitem.itemTitle,
            itemFunctionId: sitem.itemFunctionId
          });
        }
      });
      item['children'] = child;
    });
  }

  saveFavourites(): void {
    if (this.selectedList.length > 0) {

      this.loginService.saveFavourites(this.selectedList)
        .subscribe(() => {
          this.closeParentModal.next(true);
        });

      this.modal.close();
    }
  }

  updateFavourites(menuItem: any, checkboxRef: HTMLInputElement): void {

    this.toolbarDirty = true;
    const favouritesCount = this.getSelectedCount();

    // don't allow more than 10 favourites
    if (checkboxRef.checked && favouritesCount > MAX_FAVOURITES_COUNT) {
      this.ts.warning(`Maximum ${MAX_FAVOURITES_COUNT} menu items can be set as favourites`);

      /* If we set isFavourite to false without this, the view is not getting updated
       * due to no change in ngModel between adjacent change detection cycles
       * issue: https://github.com/angular/angular/issues/9275
       * fix: https://github.com/angular/angular/issues/9275#issuecomment-226747637 */
      this.changeDetectorRef.detectChanges();

      menuItem.isFavourite = false;
    }
    /* if the menu linked to modified checkbox already exists in the selected list,
       * it means that the state of that checkbox is now restored to its value
       * in the db. So it can be removed from selected list */
    else {
      // index of modified checkbox if exists in selectedList
      const currentSubMenuIndex = this.selectedList
        .findIndex(each => each.id === menuItem.id);

      if (currentSubMenuIndex === -1) {
        this.selectedList.push(menuItem);
      }
      else {
        this.selectedList.splice(currentSubMenuIndex, 1);
      }
    }
  }

  /* Returns the total number of menus with isFavourite = true */
  getSelectedCount(): number {
    let count = 0;
    for (const menu of this.favList) {
      for (const subMenu of menu.children) {
        if (subMenu !== undefined && subMenu.isFavourite) {
          count++;
        }
      }
    }
    return count;
  }

  reset(): void {
    this.modal.close();
  }

  menuExists(item): any {
    let value = false;
    value = this.favList.some((person) => {
      return person.groupTitle === item;
    });
    return value;
  }
}
