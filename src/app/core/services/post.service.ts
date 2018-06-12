import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { map, distinctUntilChanged, skip } from 'rxjs/operators';

import { ApiService } from './api.service'

import { Post } from './../models/post';

@Injectable({
	providedIn: 'root'
})
export class PostService {
	private newPostSubject = new BehaviorSubject<Post>({} as Post);
	public newPost = this.newPostSubject.asObservable()
		.pipe( distinctUntilChanged() )
		.pipe( skip(1) );

	constructor (
		private router: Router,
		private apiService: ApiService
	) { }

	public get(before?: string | Date, user?: string): Observable<Post[]> {
		if (before && before instanceof Date)
			before = before.toISOString();

		let url = '/posts?limit=12';

		if (user)
			url += `&username=${user}`;

		if (before)
			url += `&before=${before}`;

		return this.apiService.get(url);
	}

	public addPost(post: Post): Observable<Post> {
		return this.apiService.post('/posts', post)
			.pipe(map(
				res => {
					this.newPostSubject.next(res);

					return res;
				}
			));
	}

	public delete(id: string): Observable<boolean> {
		return this.apiService.delete(`/posts?id=${id}`)
			.pipe(map(
				res => {
					if (!res)
						this.router.navigateByUrl('/**');

					return res;
				}
			));
	}

}
