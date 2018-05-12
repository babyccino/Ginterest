import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';

import { DataService } from '../../core/services/data.service';

import { Post } from '../../core/models/post';

@Component({
	selector: 'app-add-post-form',
	templateUrl: './add-post-form.component.html',
	styleUrls: ['./add-post-form.component.css']
})
export class AddPostFormComponent {
	formdata:FormGroup;

	constructor(private dataService:DataService) { }
	ngOnInit() {
		this.formdata = new FormGroup({
			title: new FormControl(),
			body: new FormControl(),
			url: new FormControl()
		});
	}

	onSubmit(data, event:Event) {
		event.preventDefault();
		let post:Post = {
			_id: "",
			userId: "",
			twitter: {username:"", displayUrl:""},
			title: data.title,
			body: data.body,
			url: data.url
		};
		console.log(post);
		this.dataService.addPost(post).subscribe(response => console.log(response));
	}
}
