import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BoardComponent } from './../components/board/board.component';
import { TestComponent } from './../components/test/test.component';

const routes: Routes = [
  {
    path: '',
    component: BoardComponent,
    pathMatch: 'full'
  }, {
  	path: ':user',
  	component: BoardComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: true })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule {
}
