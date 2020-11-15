import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { QuestionListComponent } from './question-list/question-list.component';

import { QuestionEntryComponent } from './question-entry/question-entry.component';
import { ImagesComponent } from './images/images.component';
import { UploaderComponent } from './uploader/uploader.component';
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { AuthGuard } from "../auth/auth.guard";


const routes: Routes = [

  {
    path: 'question-entry',
    component: QuestionEntryComponent,
    canActivate: [AuthGuard],
    data: { roles: ["user", "admin"] }
  },
  { path: 'questions-list', component: QuestionListComponent, canActivate: [AuthGuard], data: { roles: [ "admin"] } },
  { path: 'images', component: ImagesComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] }},
  { path: 'uploader', component: UploaderComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] }},
  { path: 'upload-files', component: UploadFilesComponent, canActivate: [AuthGuard], data: { roles: ["user", "admin"] } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuestionRoutingModule { }
