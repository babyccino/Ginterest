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
	private _headerVisible: boolean = true;
	private _isAuthenticated: boolean = true;
	private _user: User;
	private _userViewing: string = "/";

  public signUpForm: FormGroup;

	public get title()	{ return this.signUpForm.get('title'); 	}
	public get url()		{ return this.signUpForm.get('url'); 		}
	public get body()		{ return this.signUpForm.get('body'); 	}

	public get isAuthenticated()	{ return this._isAuthenticated }
	public get headerVisible()		{ return this._headerVisible; }
	public get twitterUrl()				{ return `https://twitter.com/${this._user.twitter.username}`; }
	public get user()							{ return this._user; }
	public get userViewing()			{ return this._userViewing; }

	constructor(
		private router: Router,
		private fb: FormBuilder,
		private userService: UserService
	) { }

	@HostListener('window:resize', ['$event'])
	onResize(event) {
	  console.log('hey');
	}

	/*
	@HostListener('window:scroll', ['$event']) scrollListener() {
		console.log(this._scrollCount);

		if (this._headerVisible)
			if (this._scrollCount++ > 30) {
				this.toggleHeader();
				this._scrollCount = 0;
			};
	}
	*/

	ngOnInit() {
		this.signUpForm  = this.fb.group({
			title: ['', Validators.required],
			url: ['',[
				Validators.required,
				Validators.pattern('^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$')
			]],
			body: ''
		});
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this._userViewing = event.url.slice(1);
			}
		});
		this.userService.currentUser.subscribe(res => this._user = res)
		this.userService.isAuthenticated.subscribe(res => this._isAuthenticated = res)
	}

	public onFormSubmit(): void {
		if (this.signUpForm.valid) {
			let post:Post = this.signUpForm.value;
			console.log(post);
		}
	}

	public toggleHeader(): void {
		this._headerVisible = !this._headerVisible;
	}
}
