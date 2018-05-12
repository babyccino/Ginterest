import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { ApiService } from './api.service'

import { User } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable().pipe(distinctUntilChanged());

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable().pipe(distinctUntilChanged());

	constructor(
		private apiService: ApiService
	) {
		console.log('user service connected');
	}

	populate() {
		this.apiService.get('/user').subscribe(
			response => {
				console.log('UserService, user: ', response)
				this.currentUserSubject.next(response);
				this.isAuthenticatedSubject.next(true);
				console.log('this.currentUserSubject.value: ', this.currentUserSubject.value)
			},
			err => {
				console.log('no user')
				this.currentUserSubject.next({} as User);
				this.isAuthenticatedSubject.next(false);
			}
		);
	}

	getCurrentUser(): User {
		return this.currentUserSubject.value;
	}

}

