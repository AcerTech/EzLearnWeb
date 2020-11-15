import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminLinksComponent } from './admin-links/admin-links.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [

  { path: "", pathMatch: "full", redirectTo: "/question-entry" },
  { path: "admin-links", pathMatch: "full", component: AdminLinksComponent, data: { roles: ["admin"] } },

  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
