import { Injectable } from '@angular/core';
// import {openDB, deleteDB} from 'idb';
// import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdbService {
  // private _dataChange: Subject<any> = new Subject<any>();
  // private _dbPromise;

  // constructor() {
  // }

  // deleteDatabase(dbName: string): any {
  //   deleteDB(dbName);
  // }

  // connectToIDB(target: string = 'pandl') {
  //   this._dbPromise = openDB('OSIOne', 1, {
  //     upgrade(db) {
  //       db.createObjectStore(target, { keyPath: 'id' });
  //       if (!db.objectStoreNames.contains(target)) {
  //         db.createObjectStore(target, {keyPath: 'id', autoIncrement: true});
  //       }
  //     }
  //   }
  //   );
  //   // this._dbPromise.upgrade()
  // }


  // addItems(target: string, value: any): any {
  //   this._dbPromise.then((db: any) => {
  //     const tx = db.transaction(target, 'readwrite');
  //     tx.objectStore(target).put(value);
  //     this.getAllData(target).then((items: any) => {
  //       this._dataChange.next(items);
  //     });
  //     return tx.complete;
  //   });
  // }

  // addItem(target: string, value: any, index: string): any {
  //   this._dbPromise.then((db: any) => {
  //     const tx = db.transaction(target, 'readwrite');
  //     tx.objectStore(target).put(value);
  //     this.getSpecificData(target, index).then((items: any) => {
  //       this._dataChange.next(items);
  //     });
  //     return tx.complete;
  //   });
  // }

  // deleteItems(target: string, value: any): any {
  //   this._dbPromise.then((db: any) => {
  //     const tx = db.transaction(target, 'readwrite');
  //     const store = tx.objectStore(target);
  //     store.delete(value);
  //     this.getAllData(target).then((items: any) => {
  //       this._dataChange.next(items);
  //     });
  //     return tx.complete;
  //   });
  // }

  // getSpecificData(target: string, index: string): any {
  //   return this._dbPromise.then((db: any) => {
  //     const tx = db.transaction(target, 'readonly');
  //     const store = tx.objectStore(target);
  //     return store.get(index);
  //   });
  // }

  // getAllData(target: string): any {
  //   return this._dbPromise.then((db: any) => {
  //     const tx = db.transaction(target, 'readonly');
  //     const store = tx.objectStore(target);
  //     return store.getAll();
  //   });
  // }

  // dataChanged(): Observable<any> {
  //   return this._dataChange;
  // }

}
