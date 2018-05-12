import { Component, OnInit } from '@angular/core';
import { UserService } from './core/services/user.service'
import { PostService } from './core/services/post.service'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  constructor(
  	private userService: UserService,
  	private postService: PostService
  ) {}

  ngOnInit() {
  	this.userService.populate();
  	this.postService.populate();
  }

}
