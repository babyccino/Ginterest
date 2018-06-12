import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { RouterModule} from '@angular/router';
import { HttpModule } from '@angular/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { PostResolverService } from './core/services/post-resolver.service';
import { ErrorPageComponent } from './components/error-page/error-page.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    AddPostFormComponent,
    FooterComponent,
    HeaderComponent,
    TestComponent,
    PostComponent,
    ErrorPageComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    HttpModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
  	ApiService,
    UserService,
    PostService,
    PostResolverService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
