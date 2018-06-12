import {
	Component,
	OnInit,
	HostListener
} from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

import { AddPostFormComponent } from './../add-post-form/add-post-form.component'

import { UserService } from './../../core/services/user.service'
import { User } from './../../core/models/user';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	private isAuthenticated: boolean = false;
	private userViewing: string;
	private user: User;

	private get username(): string { return this.user ? this.user.twitter.username : null; }
	private get displayUrl(): string { return this.user ? this.user.twitter.displayUrl : null; }
	private get canPost(): boolean {
		return this.username == this.userViewing || this.userViewing == '';
	}

	constructor(
		private router: Router,
		private userService: UserService
	) { }

	ngOnInit() {
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.userViewing = event.url.slice(6);
			}
		});
		this.userService.currentUser.subscribe( res => this.user = res._id ? res : null );
		this.userService.isAuthenticated.subscribe( res => this.isAuthenticated = res );
	}

}
