import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged } from 'rxjs/operators';

import { ApiService } from './api.service'

import { Post } from './../models/post';

@Injectable({
	providedIn: 'root'
})
export class PostService {
	private postsSubject = new BehaviorSubject<Post[]>([] as Post[]);
	public posts = this.postsSubject.asObservable().pipe(distinctUntilChanged());

	constructor (
		private apiService: ApiService
	) { }

	public populate(): void {
		this.apiService.get('/posts').subscribe(
			response => {
				console.log('retrieved posts');
				this.postsSubject.next(response);
			},
			err => {
				console.log('error retrieving posts, err: ', err);
			}
		);
	}

	public fromUser(user: string): Observable<Post[]> {
		return this.apiService.get(`/posts/by?username=${user}`);
	}

	public addPost(post: Post): void {
		this.apiService.post('/post/new', post).subscribe(
			response => {
				console.log('response: ', response);
				// add post to posts without querying server again
				let arr = this.postsSubject.value;
				arr.unshift(post);
				this.postsSubject.next(arr);
				console.log('this.postsSubject.value: ', this.postsSubject.value);
			},
			err => {
				console.log('Error adding post: ', err);
			}
		);
	}

	public getPosts(): Post[] {
		return this.postsSubject.value;
	}
	
}
