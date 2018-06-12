import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-error-page',
  templateUrl: './error-page.component.html',
  styleUrls: ['./error-page.component.scss']
})
export class ErrorPageComponent implements OnInit {
	public status: string = "";
	public message: string = "";

  constructor(
  	private route: ActivatedRoute
  ) { }

  ngOnInit() {
		this.route.data.subscribe(
			data => {
				this.status = data.status;
				if (this.status === '400')
					this.message = "Bad request";
				if (this.status === '404')
					this.message = "Resource not found";
				if (this.status === '500')
					this.message = "Server error";
			},
			err => {
				console.log(err);
			}
		);
  }

}
