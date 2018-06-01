import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing/app-routing.module';

import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { AddPostFormComponent } from './components/add-post-form/add-post-form.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { PostComponent } from './components/post/post.component';

import { TestComponent } from './components/test/test.component';

import { ApiService } from './core/services/api.service';
import { UserService } from './core/services/user.service';
import { PostService } from './core/services/post.service';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    AddPostFormComponent,
    FooterComponent,
    HeaderComponent,
    TestComponent,
    PostComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
  	ApiService,
    UserService,
    PostService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
