import { Component, OnInit } from '@angular/core';

import { UserService } from './../../core/services/user.service'
import { User } from './../../core/models/user';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
	isAuthenticated: boolean = false;
	user: User = {} as User;

	constructor(private userService: UserService) { }

	ngOnInit() {
		this.userService.currentUser.subscribe(res => this.user = res)
		this.userService.isAuthenticated.subscribe(res => this.isAuthenticated = res)
	}

}
