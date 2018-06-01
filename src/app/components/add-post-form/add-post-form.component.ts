import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

import { UserService } from './../../core/services/user.service'
import { User } from './../../core/models/user';
import { Post } from './../../core/models/post';

@Component({
	selector: 'app-add-post-form',
	templateUrl: './add-post-form.component.html',
	styleUrls: ['./add-post-form.component.scss']
})
export class AddPostFormComponent {
	private regExp: string = '^(?:(?:https?|ftp):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$';
	private isAuthenticated: boolean = true;
	private user: User = {
		_id: '5afcfacdc2b2a82344772cf5',
		twitter: {
			id : "845180875704692737",
			token : "845180875704692737-9OWnm60RtkLD9rnGEprKAc5VHrP3oih",
			username : "babyccino1",
			displayName : "Gus Ryan",
			displayUrl : "https://pbs.twimg.com/profile_images/942947061225340928/z3yRZv3i_normal.jpg"
		}
	};
  private signUpForm: FormGroup;

	constructor (
		private userService: UserService,
		private fb: FormBuilder
	) { }

	ngOnInit() {
		this.signUpForm  = this.fb.group({
			title: ['', Validators.required],
			url: ['',[
				Validators.required,
				Validators.pattern(this.regExp)
			]],
			body: ''
		})
		//this.userService.currentUser.subscribe(res => this.user = res)
		//this.userService.isAuthenticated.subscribe(res => this.isAuthenticated = res)
	}

	public get title()	{ return this.signUpForm.get('title'); 	}
	public get url()		{ return this.signUpForm.get('url'); 		}
	public get body()	{ return this.signUpForm.get('body'); 	}

	public onFormSubmit(): void {
		if (this.signUpForm.valid) {
			let post:Post = this.signUpForm.value;
			post.userId = this.user._id;
			post.twitter = {
				username: this.user.twitter.username,
				displayUrl: this.user.twitter.displayUrl
			};
			console.log('posting: ', post);
		}
	}
}
