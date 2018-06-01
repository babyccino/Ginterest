import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { distinctUntilChanged } from 'rxjs/operators';

import { PostComponent } from './../post/post.component';

import { PostService } from './../../core/services/post.service'
import { Post } from './../../core/models/post';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
	private _posts:Post[] = [];
	private _columnCount:number = 4;
	private _user:string;
	private _sub;

	public get posts()				{ return this._posts; }
	public get columnCount()	{ return this._columnCount; }
	public get user()					{ return this._user; }
	public get sub()					{ return this._sub; }

	constructor (
		private _route: ActivatedRoute,
		private _postService: PostService
	) { }

	@HostListener('window:resize', ['$event'])
	onResize(event) {
		this.setColumnCount();
	}

	ngOnInit() {
		this.setColumnCount()
		this._route.paramMap
			.pipe(distinctUntilChanged())
			.subscribe(params => {
				this._user = params.get('user');
				if (!this._user) {
					if (this._sub) this._sub.unsubscribe();
					this._sub = this._postService.posts.subscribe(res => this._posts = res);
				} else {
					if (this._sub) this._sub.unsubscribe();
					this._sub = this._postService.fromUser(this._user)
						.subscribe(
							res => this._posts = res,
							err => this.userNotFound()
						);
				}
		});
	}

	private setColumnCount(): void {
	  if (window.innerWidth > 800)
	  	this._columnCount = 4;
	  else if (window.innerWidth > 450)
	  	this._columnCount = 2;
	  else
	  	this._columnCount = 1;
	}

	private userNotFound(): void {

	}

}
