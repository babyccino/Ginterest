import {
	Component,
	Input,
	Output,
	EventEmitter,
	OnInit
} from '@angular/core';

import { UserService } from './../../core/services/user.service'
import { PostService } from './../../core/services/post.service'
import { Post } from './../../core/models/post';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {
	private canDelete: boolean = true;

	@Input() post: Post;
	@Input() position: number[];

	@Output() delete: EventEmitter<number[]> = new EventEmitter<number[]>();

	constructor(
		private userService: UserService,
		private postService: PostService
	) { }

	ngOnInit() {
		this.userService.currentUser.subscribe(
			res => {
				if (res._id)
					this.canDelete = this.canDelete && (this.post.userId === res._id);
			}
		);
		this.userService.isAuthenticated.subscribe(
			res => {
				this.canDelete = this.canDelete && res;
			}
		);
	}

	public deletePost(): void {
		this.postService.delete(this.post.id).subscribe(
			res => {
				this.delete.emit(this.position);
			}
		);
	}

}
