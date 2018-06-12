import {
	ActivatedRouteSnapshot,
	Resolve,
	Router,
	RouterStateSnapshot
} from '@angular/router';
import { Injectable } from '@angular/core';

import { Observable } from 'rxjs';
import { Post } from './../models/post';
import { PostService } from './post.service'

@Injectable()
export class PostResolverService implements Resolve<Post[]> {
	constructor(
		private postService: PostService
	) { }

	resolve(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<any> {
		let user: string = route.params['user'];
		return this.postService.get(undefined, user);
	}
}
