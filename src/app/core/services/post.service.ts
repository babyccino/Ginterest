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

	constructor(
		private apiService: ApiService
	) {
		console.log('post service connected');
	}

	populate() {
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

	addPost(post: Post) {
		this.apiService.post('/post', post).subscribe(
			response => {
				let arr = this.postsSubject.value;
				arr.push(post);
				this.postsSubject.next(arr);
			},
			err => {
				console.log('Error adding post: ', err);
			}
		);
	}

	getPosts(): Post[] {
		return this.postsSubject.value;
	}
	
}
