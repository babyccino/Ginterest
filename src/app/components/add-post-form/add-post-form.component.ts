import { Component, OnInit, Output } from '@angular/core';
import {
	FormBuilder,
	FormControl,
	FormGroup,
	Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { Observable, zip } from 'rxjs';

import { UserService } from './../../core/services/user.service';
import { PostService } from './../../core/services/post.service';
import { Post } from './../../core/models/post';

import imageURLValidator from './../../core/util/imageURLValidator';

@Component({
	selector: 'app-add-post-form',
	templateUrl: './add-post-form.component.html',
	styleUrls: ['./add-post-form.component.scss']
})
export class AddPostFormComponent {
	private regExp: RegExp = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  private signUpForm: FormGroup;

	constructor (
		private fb: FormBuilder,
		private router: Router,
		private userService: UserService,
		private postService: PostService
	) { }

	ngOnInit() {
		this.signUpForm = this.fb.group({
			title: ['', Validators.required],
			url: ['',[
				Validators.required,
				Validators.pattern(this.regExp)
			], [
				imageURLValidator
			]],
			body: ''
		});
	}

	private get title()	{ return this.signUpForm.get('title'); 	}
	private get url()		{ return this.signUpForm.get('url'); 		}
	private get body()		{ return this.signUpForm.get('body'); 	}

	private onFormSubmit(): void {
		if (this.signUpForm.valid) {
			zip(
				this.userService.isAuthenticated,
				this.userService.currentUser
			).subscribe(
				res => {
					if (!res[0]) return;

					let post:Post = this.signUpForm.value;
					post.userId = res[1]._id;
					post.twitter = res[1].twitter;
					this.postService.addPost(post).subscribe(
						res => this.signUpForm.reset()
					);
				}
			);
		}
	}
}
