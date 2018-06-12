import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private headers: Headers = new Headers();
	private api_url: string = '/api';

	constructor(
		private http:	Http,
		private router: Router
	) {
		this.headers.append('Content-type', 'application/json');
	}

	public get(path: string): Observable<any> {
		console.log(`GET ${this.api_url}${path}`);
		return this.http.get(
				`${this.api_url}${path}`,
				{headers: this.headers}
			)
			.pipe( map( res => res.json() ) )
			.pipe( catchError( err => this.router.navigateByUrl('/404') ) );
	}

	public put(path: string, body: Object = {}): Observable<any> {
		console.log(`PUT ${this.api_url}${path}`);
		return this.http.put(
				`${this.api_url}${path}`,
				JSON.stringify(body),
				{headers: this.headers}
			)
			.pipe( map( res => res.json() ) )
			.pipe( catchError( err => this.router.navigateByUrl('/404') ) );
	}

	public post(path: string, body: Object = {}): Observable<any> {
		console.log(`POST ${this.api_url}${path}`);
		return this.http.post(
				`${this.api_url}${path}`,
				JSON.stringify(body),
				{headers: this.headers}
			)
			.pipe( map( res => res.json() ) )
			.pipe( catchError( err => this.router.navigateByUrl('/404') ) );
	}

	public delete(path: string): Observable<any> {
		console.log(`DELETE ${this.api_url}${path}`);
		return this.http.delete(
				`${this.api_url}${path}`,
				{headers: this.headers}
			)
			.pipe( map( res => res.json() ) )
			.pipe( catchError( err => this.router.navigateByUrl('/404') ) );
	}

}
