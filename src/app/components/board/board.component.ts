import { Component, OnInit } from '@angular/core';

import { PostService } from './../../core/services/post.service'
import { Post } from './../../core/models/post';

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit {
	posts:Post[] = [];

	constructor(
		private postService: PostService
	) {}

	ngOnInit() {
		this.postService.posts.subscribe(res => this.posts = res);
	}

}
