import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url = environment.urlApi;

  constructor(private _http: HttpClient) {
  }

  getAllUser() {
    return this._http.get(this.url).pipe(
      map(resp => {
        return resp;
      }),
      catchError(err => {
        //console.log(err);
        this.messageApi('ERROR', err.message, 'error');
        return throwError(err);
      })
    );
  }
  addUser(persona: any){

    return this._http.post(this.url,persona).pipe(
      map(resp=> {
        return resp;
      }),
      catchError(err =>{
        this.messageApi('ERROR', err.message, 'error');
        return throwError(err);
      })
    )
  }
  updateUser(persona: any,id: number){

    return this._http.patch(this.url+id,persona).pipe(
      map(resp=> {
        return resp;
      }),
      catchError(err =>{
        this.messageApi('ERROR', err.message, 'error');
        return throwError(err);
      })
    )
  }
  deleteUser(ide: number){
    return this._http.delete(this.url+ide).pipe(
      map(res => {
        return res;
      }),
      catchError(err => {
        this.messageApi('ERROR', err.message, 'error');
        return throwError(err);
      })
    );
  }

  confirmDelete(message: string, callback: any){
    Swal.fire({
      icon: 'question',
      title:  'ADVERTENCIA',
      html: message,
      showCancelButton: true,
      focusConfirm: false,
      reverseButtons: true,
      confirmButtonText:
        '<span class="ion-padding-horizontal"></span> Si <span class="ion-padding-horizontal"></span> ',
      confirmButtonAriaLabel: 'Si',
      cancelButtonText:
        '<span class="ion-padding-horizontal"></span>  No <span class="ion-padding-horizontal"></span> ',
      cancelButtonAriaLabel: 'No',
      heightAuto: false,
    }).then((result) => {
      if (result.isConfirmed) {
        callback();
      }
    });
  }

  messageApi(title: string, message: string, type: 'warning' | 'success' | 'error' | 'info' | 'question') {
    Swal.fire({
      icon: type,
      title,
      html: message,
      confirmButtonText: 'Aceptar'
    })
  }
}
