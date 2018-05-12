import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiService } from './api.service'

import { Post } from './../models/post';
import { User } from './../models/user';

@Injectable({
	providedIn: 'root'
})
export class DataService {

	constructor(
		private apiService: ApiService
	) {
		console.log('data service connected');
	}

	getUser(): Observable<User> {
		return this.apiService.get('/user').pipe(
				map(res => res.json().data)
			);
	}

	getUsers(): Observable<Array<User>> {
		return this.apiService.get('/users').pipe(
				map(res => res.json().data)
			);
	}

	getPosts(): Observable<Array<Post>> {
		console.log('getPosts');
		return this.apiService.get('/posts').pipe(
				map(res => res.json().data)
			);
	}

	addPost(post:Post): Observable<Post> {
		console.log(post);

		let _headers = new Headers();
		_headers.append('Content-type', 'application/json');
		console.log('stringified post: '+JSON.stringify(post));

		console.log('about to post... ')
		return this.apiService.post('/post', post)
			.pipe(
				map(res => res.json().data)
			);
	}

	deleteUser(user:User) {
		return this.apiService.delete('/user');
	}
}
