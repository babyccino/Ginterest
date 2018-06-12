import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostResolverService } from './../core/services/post-resolver.service';

import { BoardComponent } from './../components/board/board.component';
import { TestComponent } from './../components/test/test.component';
import { ErrorPageComponent } from './../components/error-page/error-page.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
    resolve: {
      posts: PostResolverService
    },
    data: {
      state: 'home'
    },
    runGuardsAndResolvers: 'always'
  }, {
  	path: 'user/:user',
  	component: BoardComponent,
    resolve: {
      posts: PostResolverService
    },
    data: {
      state: 'user'
    },
    runGuardsAndResolvers: 'always'
  }, {
    path: '400',
    component: ErrorPageComponent,
    data: {
      status: '400'
    }
  }, {
    path: '404',
    component: ErrorPageComponent,
    data: {
      status: '404'
    }
  }, {
    path: '**',
    redirectTo: '/404'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {onSameUrlNavigation: 'reload'})],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
