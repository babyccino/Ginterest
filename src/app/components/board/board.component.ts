import {
	Component,
	OnInit,
	HostListener
} from '@angular/core';
import {
	trigger,
	state,
	style,
	animate,
	transition
} from '@angular/animations';
import { ActivatedRoute } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

import { PostComponent } from './../post/post.component';

import { PostService } from './../../core/services/post.service'
import { Post } from './../../core/models/post';

enum AddDirection {
	push = 0,
	unshift
}

@Component({
	selector: 'app-board',
	templateUrl: './board.component.html',
	styleUrls: ['./board.component.scss'],
	animations: [
	  trigger('shrinkOut', [
	    state('in', style({height: '*'})),
	    transition('* => void', [
	      animate(250, style({opacity: 0, height: 0}))
	    ]),
	    transition('void => *', [
	    	style({opacity: 0, height: '0'}),
	      animate(250, style({opacity: 1, height: '*'}))
	    ])
	  ])
	]
})
export class BoardComponent implements OnInit {
	private columnCountSubject = new BehaviorSubject<number>(0);
	public columnCountObservable = this.columnCountSubject.asObservable()
		.pipe( distinctUntilChanged() );

	private get columnCount(): number { return this.columnCountSubject.value; }
	private set columnCount(value: number) { this.columnCountSubject.next(value); }

	private posts: Post[] = [];
	private userViewing: string = "";
	private lastPostDate: Date;
	private loading: boolean = false;
	private atEnd: boolean = false;
	private columns: Post[][] = [];
	private columnHeights: number[];

	constructor (
		private route: ActivatedRoute,
		private postService: PostService
	) { }

	ngOnInit() {
		this.setColumnCount();

		this.columnCountObservable.subscribe(
			res => this.reOrganiseColumns()
		);

		this.route.data.subscribe(
			data => {
				this.posts = data.posts;
				this.lastPostDate = this.posts[this.posts.length - 1].createdAt;
				this.reOrganiseColumns();
			}
		);

		this.route.params.subscribe(
			res => this.userViewing = res.user
		);

		this.postService.newPost.subscribe(
			res => {
				this.addPosts(res, undefined, AddDirection.unshift);
			}
		);

	}

	@HostListener('window:resize', [])
	onResize() {
		this.setColumnCount();
	}

	@HostListener("window:scroll", [])
	onScroll(): void {
		if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 400) {
			if (!this.loading && !this.atEnd) {
				this.loading = true;
				this.postService.get(this.lastPostDate, this.userViewing)
					.subscribe(
						res => {
							if (res.length < 12)
								this.atEnd = true;
							else
								this.addPosts(res);
							
							this.loading = false;
						}
					);
			}
		}
	}

	private setColumnCount(): void {
		if (window.innerWidth > 800)
			this.columnCount = 4;
		else if (window.innerWidth > 450)
			this.columnCount = 2;
		else
			this.columnCount = 1;
	}

	private reOrganiseColumns(columnCount:number = this.columnCount): void {
		this.columns = Array.from({length: columnCount}, () => []);
		this.columnHeights = Array(columnCount).fill(0);
		this.addToColumns(this.posts, columnCount);
	}

	private addToColumns(posts: Post[] | Post, columnCount: number = this.columnCount,
		addDirection:AddDirection = AddDirection.push): void {
		if (!(posts instanceof Array)) posts = [posts];

		if (columnCount > 1)
			for (let post of posts) {
				let img = new Image();
				img.onload = () => {
					let ratio = img.naturalHeight/img.naturalWidth;
					let min = Math.min(...this.columnHeights);
					for (let i = 0; i < columnCount; ++i)
						if (this.columnHeights[i] === min) {
							if (addDirection == AddDirection.push)
								this.columns[i].push(post);
							else
								this.columns[i].unshift(post);

							this.columnHeights[i] += ratio;
							break;
						}
				}
				
				img.src = post.url;
			}
		else
			if (addDirection == AddDirection.push)
				this.columns[0] = this.columns[0].concat(posts);
			else
				this.columns[0] = posts.concat(this.columns[0]);
	}

	private addPosts(posts: Post[] | Post, columnCount: number = this.columnCount,
		addDirection:AddDirection = AddDirection.push): void {
		if (!(posts instanceof Array)) posts = [posts];

		if (addDirection === AddDirection.push)
			this.lastPostDate = new Date(posts[posts.length - 1].createdAt);

		this.addToColumns(posts, this.columnCount, addDirection);

		if (addDirection == AddDirection.push)
			this.posts = this.posts.concat(posts);
		else
			this.posts = posts.concat(this.posts);
	}

	private deletePost(position: number[]): void {
		this.columns[position[0]].splice(position[1], 1);
	}

}
