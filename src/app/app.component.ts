import { Component, OnInit } from '@angular/core';
import {
	transition,
	trigger,
	query,
	style,
	animate,
	group,
	animateChild, state
} from '@angular/animations';
import { UserService } from './core/services/user.service';
import { PostService } from './core/services/post.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
	animations: [
		trigger('routerAnimation', [
			transition('* <=> *', [
    		query(':enter, :leave',
    			style({ position: 'fixed', width:'100%' }),
    			{ optional: true }
    		),
    		group([
		      query(':enter', [
		        style({ transform: 'translateX(100%)' }),
		        animate('0.5s ease-in-out',
		        	style({ transform: 'translateX(0%)' })
		        )
		      ], { optional: true }),
		      query(':leave', [
		        style({ transform: 'translateX(0%)' }),
		        animate('0.5s ease-in-out',
		        	style({ transform: 'translateX(-100%)' })
		        )
      		], { optional: true }),
    		])
			])
		])
	]
})
export class AppComponent implements OnInit {
	title = 'app';

	constructor(
		private userService: UserService,
		private postService: PostService
	) {}

	ngOnInit() {
		this.userService.populate();
	}

	getPage(outlet) {
		return outlet.activatedRouteData.state;
	}

}
