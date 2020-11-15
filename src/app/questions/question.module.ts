import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { QuestionRoutingModule } from './question-routing.module';
import { QuestionListComponent } from './question-list/question-list.component';
import { QuestionComponent } from './question/question.component';
import { QuestionEntryComponent } from './question-entry/question-entry.component';
import { AnswerEntryComponent } from './answer-entry/answer-entry.component';

import { QuestionsService, GradeService, QuestionTypeService, ChapterService, QuizesService, SubjectTitleService, ImagesService } from "../services";
import { QuestionHeaderComponent } from './question-header/question-header.component';

import { environment } from "../../environments/environment";
import { AngularFireStorageModule } from "@angular/fire/storage";
import { AngularFireModule } from "@angular/fire";
import { ImagesComponent } from './images/images.component';
import { DropzoneDirective } from "./dropzone.directive";
import { UploaderComponent } from "./uploader/uploader.component";
import { UploadTaskComponent } from "./upload-task/upload-task.component";
import { UploadFilesComponent } from './upload-files/upload-files.component';
import { NgxFileDropModule } from 'ngx-file-drop';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { SearchImageModelComponent } from './search-image-model/search-image-model.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from '../auth/auth.interceptor';

@NgModule({
  declarations: [
    QuestionListComponent,
    QuestionComponent,
    QuestionEntryComponent,
    AnswerEntryComponent,
    QuestionHeaderComponent,
    ImagesComponent,
    UploadTaskComponent,
    UploaderComponent,
    DropzoneDirective,
    UploadFilesComponent,
    FileUploaderComponent,
    SearchImageModelComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgxFileDropModule,
    ReactiveFormsModule,
    QuestionRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule
  ],
  providers: [
    QuestionsService,
    GradeService,
    QuestionTypeService,
    ChapterService,
    QuizesService,
    SubjectTitleService,
    ImagesService,

  ]
})
export class QuestionModule { }
