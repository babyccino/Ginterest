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
import { distinctUntilChanged, skip } from 'rxjs/operators';

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
		.pipe( distinctUntilChanged() )
		.pipe( skip(1) );

	private get columnCount(): number { return this.columnCountSubject.value; }
	private set columnCount(value: number) { this.columnCountSubject.next(value); }

	private posts: Post[] = [];
	private userViewing: string = "";
	private lastPostDate: Date;
	private atEnd: boolean = false;
	private columns: Post[][] = [];
	private columnHeights: number[];
	private loading: boolean = false;

	constructor (
		private route: ActivatedRoute,
		private postService: PostService
	) { }

	ngOnInit() {
		this.columns = Array.from({length: 4}, () => []);
		this.columnHeights = Array(4).fill(0);

		this.setColumnCount();

		this.columnCountObservable.subscribe(
			res => { if (res > 1) this.reOrganiseColumns(res) }
		);

		this.route.data.subscribe(
			data => {
				this.loading = true;
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
								this.atEnd = true, this.loading = false;
							else
								this.addPosts(res);
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
		if (this.columnCount < 2) {
			this.loading = false;
			return;
		}

		this.columns = Array.from({length: columnCount}, () => []);
		this.columnHeights = Array(columnCount).fill(0);
		this.addToColumns(this.posts.slice(), columnCount);
	}

	private addToColumnsPromise = (post: Post, columnCount: number = this.columnCount,
			addDirection:AddDirection = AddDirection.push): Promise<any> => {
		let img = new Image();
		return new Promise( (res, rej) => {
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
						res();
						break;
					}
			}
			img.onerror = () => rej();
			
			img.src = post.url;
		});
	}

	private addToColumns(posts: Post | Post[], columnCount: number = this.columnCount,
			addDirection:AddDirection = AddDirection.push): void {
		if (this.columnCount < 2) {
			this.loading = false;
			return;
		}
		
		if (posts instanceof Array) {
			/*
				Here the input posts are split into an array (the same size as the column count)
				called batch and the remainder. All posts in batch are added to the board.
				When all posts are finished being added the remainder will be operated on.
				This is done so the posts are at least close to being in chronological order.
			*/
			let batch = posts.splice(0, columnCount);
			let that = this;
			Promise.all( batch.map(
				post => this.addToColumnsPromise(post, columnCount, addDirection)
			))
				.then( res => {
					if (posts.length > 0)
						this.addToColumns(posts, columnCount, addDirection);
					else
						this.loading = false;
				})
				.catch( err => console.log("addToColumnsPromise failed") );
		} else {
			this.addToColumnsPromise(posts, columnCount, addDirection)
				.then( res => this.loading = false );
		}
	}

	private addPosts(posts: Post[] | Post, columnCount: number = this.columnCount,
		addDirection:AddDirection = AddDirection.push): void {
		if (posts instanceof Array) {
			if (addDirection === AddDirection.push)
				this.lastPostDate = new Date(posts[posts.length - 1].createdAt);

			if (this.columnCount > 1)
				this.addToColumns(posts, this.columnCount, addDirection);
			else
				this.loading = false;

			if (addDirection == AddDirection.push)
				this.posts = this.posts.concat(posts);
			else
				this.posts = posts.concat(this.posts);
		} else {
			if (addDirection === AddDirection.push)
				this.lastPostDate = new Date(posts.createdAt);

			if (this.columnCount > 1)
				this.addToColumns(posts, this.columnCount, addDirection);
			else
				this.loading = false;

			if (addDirection == AddDirection.push)
				this.posts.push(posts);
			else
				this.posts.unshift(posts);
		}
	}

	private deletePost(position: number[]): void {
		this.columns[position[0]].splice(position[1], 1);
	}

}
