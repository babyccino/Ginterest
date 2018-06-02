import { Component, OnInit, HostListener } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

import { AddPostFormComponent } from './../add-post-form/add-post-form.component'

import { UserService } from './../../core/services/user.service'
import { User } from './../../core/models/user';
import { Post } from './../../core/models/post';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	private _isAuthenticated: boolean = true;
	private _user: User;
	private _userViewing: string = "/";

	public get isAuthenticated(): boolean	{ return this._isAuthenticated }
	public get user(): User								{ return this._user; }
	public get userViewing(): string			{ return this._userViewing; }

	constructor(
		private router: Router,
		private userService: UserService
	) { }

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this._userViewing = event.url.slice(1);
			}
		});
		this.userService.currentUser.subscribe(res => this._user = res)
		this.userService.isAuthenticated.subscribe(res => this._isAuthenticated = res)
	}

}
