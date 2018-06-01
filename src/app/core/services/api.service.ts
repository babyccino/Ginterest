import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions } from '@angular/http';

import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable({
	providedIn: 'root'
})
export class ApiService {
	private headers: Headers = new Headers();
	private api_url: string = '/api';

	constructor(private http:Http) {
		this.headers.append('Content-type', 'application/json');
	}

	public get(path: string): Observable<any> {
		console.log(`GET ${this.api_url}${path}`);
		return this.http.get(`${this.api_url}${path}`)
			.pipe(
				map(res => res.json())
			).pipe(
				catchError(err => {throw err})
			);
	}

	public put(path: string, body: Object = {}): Observable<any> {
		return this.http.put(
				`${this.api_url}${path}`,
				JSON.stringify(body),
				{headers: this.headers}
			).pipe(
				map(res => res.json())
			).pipe(
				catchError(err => {throw err})
			);
	}

	public post(path: string, body: Object = {}): Observable<any> {
		return this.http.post(
				`${this.api_url}${path}`,
				JSON.stringify(body),
				{headers: this.headers}
			).pipe(
				map(res => res.json())
			).pipe(
				catchError(err => {throw err})
			);
	}

	public delete(path: string): Observable<any> {
		return this.http.delete(
				`${this.api_url}${path}`
			).pipe(
				map(res => res.json())
			).pipe(
				catchError(err => {throw err})
			);
	}

}
