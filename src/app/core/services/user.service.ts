import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { ApiService } from './api.service'

import { User } from './../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject = new BehaviorSubject<User>({} as User);
  public currentUser = this.currentUserSubject.asObservable()
  	.pipe( distinctUntilChanged() );

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated = this.isAuthenticatedSubject.asObservable()
  	.pipe( distinctUntilChanged() );

	constructor(
		private apiService: ApiService,
		private router: Router
	) { }

	populate() {
		this.apiService.get('/user').subscribe(
			res => {
				if (res) {
					this.currentUserSubject.next(res as User);
					this.isAuthenticatedSubject.next(true);
				} else
					this.isAuthenticatedSubject.next(false);
			}
		);
	}

	getCurrentUser(): User {
		return this.currentUserSubject.value;
	}

}

