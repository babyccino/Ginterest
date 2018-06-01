import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { map, distinctUntilChanged } from 'rxjs/operators';

import { PostComponent } from './../post/post.component';

import { PostService } from './../../core/services/post.service'
import { Post } from './../../core/models/post';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
	private posts:Post[] = [];
	private columnCount:number = 4;
	private profile:boolean = false;
	private user:string;
	private sub;

	constructor (
		private route: ActivatedRoute,
		private postService: PostService
	) { }

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.setColumnCount();
	}

	ngOnInit() {
		this.setColumnCount()
		this.route.paramMap
			.pipe(distinctUntilChanged())
			.subscribe(params => {
				console.log('user: ', params.get('user'));
				this.user = params.get('user');
				if (!this.user) {
					if (this.sub) this.sub.unsubscribe();
					this.sub = this.postService.posts.subscribe(res => this.posts = res);
				} else {
					if (this.sub) this.sub.unsubscribe();
					this.sub = this.postService.fromUser(this.user)
						.subscribe(
							res => this.posts = res,
							err => this.userNotFound()
						);
				}
		});
	}

	private setColumnCount(): void {
	  if (window.innerWidth > 800)
	  	this.columnCount = 4;
	  else if (window.innerWidth > 450)
	  	this.columnCount = 2;
	  else
	  	this.columnCount = 1;
	}

	private userNotFound(): void {

	}

}
