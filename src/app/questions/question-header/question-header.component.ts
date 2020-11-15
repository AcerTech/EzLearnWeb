import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Question, Quiz, Grade, Subject, Chapter } from 'src/app/models/interfaces';
import { QuestionsService, GradeService } from '../../services';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-question-header',
  templateUrl: './question-header.component.html',
  styleUrls: ['./question-header.component.css']
})
export class QuestionHeaderComponent implements OnInit, OnDestroy {
  questions: Question[] = []
  grades: Grade[] = []
  subjects: Subject[] = []
  quizes: Quiz[] = []
  chapters: Chapter[] = []
  errorMsg: any;
  selectedQuiz: any = {}

  @Output() notifyHeaderChange: EventEmitter<string> = new EventEmitter<string>();

  headerForm = new FormGroup({
    grade: new FormControl(),
    subject: new FormControl(),
    quiz: new FormControl(),
    chapter: new FormControl()
  });


  constructor(
    private fb: FormBuilder,
    private questionService: QuestionsService,
    private gradeService: GradeService
  ) {
    this.createForm();

  }


  createForm() {
    this.headerForm = this.fb.group({
      grade: '',//[{ value: null, disabled: true }, [Validators.required]],
      subject: '',
      quiz: '',
      chapter: ''
    });
  }

  async ngOnInit() {

    const headerFormValues = JSON.parse(localStorage.getItem('headerFormValues'));
    if (headerFormValues) {
      await this.getSubjectsForGrade(headerFormValues.gradeId)
      await this.getChaptersForSubject(headerFormValues.subjectId)
      this.headerForm.controls['grade'].patchValue(headerFormValues.gradeId)
      this.headerForm.controls['subject'].patchValue(headerFormValues.subjectId)
      this.headerForm.controls['chapter'].setValue(headerFormValues.chapterId)


      this.notifyHeaderChange.emit(headerFormValues.chapterId)
    }
    this.getGrades();
  }

  ngOnDestroy() {
    const headerFormValues = {
      gradeId: this.headerForm.get('grade').value,
      subjectId: this.headerForm.get('subject').value,
      chapterId: this.headerForm.get('chapter').value
    }
    localStorage.setItem('headerFormValues', JSON.stringify(headerFormValues))

  }
  getGrades() {
    this.gradeService.getGrades().subscribe(
      data => {
        this.grades = data
        // console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }, () => {

      }
    )
  }

  onGradeChange() {
    let gId = this.headerForm.get('grade')
    this.quizes = []
    this.subjects = []
    this.headerForm.controls['subject'].setValue('');
    this.getSubjectsForGrade(gId.value)
    this.notifyHeaderChange.emit()
  }

  onSubjectChange() {
    let sId = this.headerForm.get('subject')
    this.headerForm.controls['chapter'].setValue('');
    this.getChaptersForSubject(sId.value)
    // console.log(sId.value)
    this.notifyHeaderChange.emit()
  }

  onChapterChange() {
    let chapterId = this.headerForm.controls['chapter'].value
    // console.log(chapterId )
    this.notifyHeaderChange.emit(chapterId)
  }



  // onQuizChange() {
  //   let q = this.headerForm.controls['quiz'].value
  //   console.log(q)
  //   this.notifyHeaderChange.emit(q)
  // }




  getSubjectsForGrade(gradeId) {
    this.subjects = []
    this.questionService.getSubjectsForGrade(gradeId).subscribe(
      data => {
        this.subjects = data
        // console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }



  getChaptersForSubject(subjectId) {
    this.quizes = []
    this.questionService.getChaptersForSubject(subjectId).subscribe(
      data => {
        this.chapters = data
        // console.log('get chapters')
        // console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }




}
