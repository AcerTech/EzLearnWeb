import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { QuestionsService } from '../../services/questions.service';
import { QuestionsService, GradeService } from "../../services";
import { Answer, Question, QuestionType, Quiz, Grade, Chapter, Subject } from 'src/app/models/interfaces';
import { AngularFireStorage } from "@angular/fire/storage";
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';
declare var $: any;

@Component({
  selector: 'app-question-entry',
  templateUrl: './question-entry.component.html',
  styleUrls: ['./question-entry.component.css']
})
export class QuestionEntryComponent implements OnInit {
  errorMsg: any
  files: any[];
  url: any;
  chapters: Chapter[] = []
  grades: Grade[] = []
  subjects: Subject[] = []
  quizes: Quiz[] = []
  answers: Answer[] = []
  questionsTypes: QuestionType[] = []
  imageFile: File;
  uploadProgress: number = 0
  // imageFilePath: string
  selectedImgUrl: String = ''
  private selectedQuestion: Question;

  // @Input() set selectedQuestion(value: Question) {
  //   this._selectedQuestion = value;
  //   if (!value) {
  //     return;
  //   }
  //   this.refillQuestionForm();
  // }

  // get selectedQuestion(): Question {
  //   return this._selectedQuestion;
  // }


  @Output() notifyQuestionSubmit: EventEmitter<Question> = new EventEmitter<Question>();
  @Output() notifyQuestionClear: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() notifyQuestionDelete: EventEmitter<Question> = new EventEmitter<Question>();

  questionForm = new FormGroup({
    grade: new FormControl(Validators.required),
    chapter: new FormControl(Validators.required),
    subject: new FormControl(Validators.required),
    questionType: new FormControl(Validators.required),
    quiz: new FormControl(Validators.required),
    questionText: new FormControl(Validators.required),
    timer: new FormControl(Validators.required),
    imgUrl: new FormControl(),
    displayOrder: new FormControl(0),
    columnsCount: new FormControl(0),
    isActive: new FormControl(true),
    // quizId: new FormControl(Validators.required),

  })

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private questionService: QuestionsService,
    private gradeService: GradeService,
    private af: AngularFireStorage
  ) {
    this.createForm();
    if (this.router.getCurrentNavigation().extras.state) {
      this.selectedQuestion = this.router.getCurrentNavigation().extras.state.question;
      this.refillQuestionForm();
    }
  }

  ngOnInit(): void {
    this.getGrades();
    this.getQuestionsTypes();
  }

  refillQuestionForm() {
    console.log(this.selectedQuestion)
    this.getSubjectsForGrade(this.selectedQuestion.grade._id)
    this.getChaptersForSubject(this.selectedQuestion.subject._id)
    this.getQuizesForChapter(this.selectedQuestion.chapter._id)

    this.answers = this.selectedQuestion.answers;
    this.questionForm.controls['questionText'].setValue(this.selectedQuestion.questionText)
    // this.questionForm.controls['chapter'].setValue(this.selectedQuestion.chapter)
    this.questionForm.controls['imgUrl'].setValue(this.selectedQuestion.imgUrl)
    this.selectedImgUrl = this.selectedQuestion.imgUrl
    this.questionForm.controls['timer'].setValue(this.selectedQuestion.timer)

    this.questionForm.controls['columnsCount'].setValue(this.selectedQuestion.columnsCount)
    this.questionForm.controls['displayOrder'].setValue(this.selectedQuestion.displayOrder)
    this.questionForm.controls['isActive'].setValue(this.selectedQuestion.isActive)
    this.questionForm.controls['questionType'].patchValue(this.selectedQuestion.questionType._id)
    this.questionForm.controls['subject'].setValue(this.selectedQuestion.subject._id)
    this.questionForm.controls['chapter'].setValue(this.selectedQuestion.chapter._id)
    this.questionForm.controls['quiz'].setValue(this.selectedQuestion.quiz._id)
    this.questionForm.controls['grade'].setValue(this.selectedQuestion.grade._id)
  }

  createForm() {
    this.questionForm = this.fb.group({
      grade: ['', [Validators.required]],//[{ value: null, disabled: true }, [Validators.required]],
      subject: ['', [Validators.required]],
      chapter: ['', [Validators.required]],
      quiz: ['', [Validators.required]],
      questionType: ['', [Validators.required]],
      questionText: ['', [Validators.required]],
      timer: [0, [Validators.min(0), Validators.max(20)]],
      imgUrl: '',
      displayOrder: 0,
      columnsCount: 0,
      isActive: true,
      // quizId: [null, [Validators.required]],


    });
  }

  onAnswerAdded(_answer) {
    this.answers.push(_answer)
  }

  onSelectImage(imgUrl) {
    this.questionForm.controls['imgUrl'].setValue(imgUrl);
    this.selectedImgUrl = imgUrl
  }

  clearForm() {
    // this.questionForm.reset();
    this.createForm();
    this.answers = []
    this.selectedQuestion = null
    this.notifyQuestionClear.emit(true)
  }

  deleteQuestion() {
    if (confirm("Are you sure to delete ")) {
      // this.notifyQuestionDelete.emit(this.selectedQuestion)
      // console.log(this.selectedQuestion)
      this.questionService.deleteQuestion(this.selectedQuestion._id.toString()).subscribe(
        data => {
          // console.log(data)
        }, (err: any) => {
          this.errorMsg = err
        }, () => {
          // console.log('questions is deleted')
          this.clearForm()
        }
      )
    }

  }


  // onSelectedImage(event) {
  //   this.imageFile = event.target.files[0];
  //   this.imageFilePath = event.target.files[0]//this.imageFile.name;
  //   // console.log(event.target.files[0])
  // }



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

  getQuestionsTypes() {
    this.questionService.getQuestionsTypes().subscribe(
      data => {
        this.questionsTypes = data
        // console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }, () => {
        if (!this.selectedQuestion) {
          this.questionForm.controls['questionType'].patchValue(this.questionsTypes[0]._id)
        }

      }
    )
  }

  onGradeChange() {
    let gId = this.questionForm.get('grade')
    this.quizes = []
    this.subjects = []
    this.chapters = []
    this.questionForm.controls['subject'].setValue('');
    this.questionForm.controls['chapter'].setValue('');
    this.questionForm.controls['quiz'].setValue('');
    this.getSubjectsForGrade(gId.value)
    // this.notifyHeaderChange.emit()
  }

  onSubjectChange() {
    let sId = this.questionForm.get('subject')
    this.questionForm.controls['quiz'].setValue('');
    this.questionForm.controls['chapter'].setValue('');
    this.getChaptersForSubject(sId.value)
    console.log("subjectId: " + sId.value)
    // this.notifyHeaderChange.emit()
  }

  onChapterChange() {
    let cId = this.questionForm.get('chapter')
    this.quizes = []
    this.questionForm.controls['quiz'].setValue('');
    this.getQuizesForChapter(cId.value)
    // this.notifyHeaderChange.emit()
  }


  onQuizChange() {
    let q = this.questionForm.controls['quiz'].value
    console.log(q)
    // this.notifyHeaderChange.emit(q)
  }


  getSubjectsForGrade(gradeId) {
    this.subjects = []
    this.questionService.getSubjectsForGrade(gradeId).subscribe(
      data => {
        this.subjects = data
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }


  getChaptersForSubject(subjectId) {
    this.chapters = []
    this.questionService.getChaptersForSubject(subjectId).subscribe(
      data => {
        this.chapters = data
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }

  getQuizesForChapter(chapterId) {
    this.quizes = []
    this.questionService.getQuizesForChapter(chapterId).subscribe(
      data => {
        this.quizes = data
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }
  saveQuestion() {

    if (!this.questionForm.valid || this.questionForm.get('questionText').value == '') {
      alert('You may need to select a Grade, Subject and Quiz! and Question Text is required!')
      return;
    }

    console.log('Everything is OK')
    // this.notifyQuestionSubmit.emit(this.questionForm.value)

    if (this.answers.length == 0) {
      alert("You need to add some Answers")
      return;
    }

    if (this.selectedQuestion) {
      this.updateQuestion(this.selectedQuestion._id)
      return;
    }

    this.addNewQuestion();

  }

  //method to retrieve download url
  async getUrl(snap: firebase.storage.UploadTaskSnapshot) {
    const url = await snap.ref.getDownloadURL();
    return url
  }

  async addNewQuestion() {
    var question = this.questionForm.value;
    question.answers = this.answers;

    // if (this.imageFile) {
    //   const randomId = Math.random().toString(36).substring(2, 8);
    //   const imgUrl = `files/${new Date().getTime()}` + "_" + randomId;
    //   const uploadTask = await this.af.upload(imgUrl, this.imageFile)
    //   // uploadTask.percentageChanges().subscribe(changes => {
    //   //   this.uploadProgress = changes
    //   // });
    //   const url = await this.getUrl(uploadTask)
    //   question.imgUrl = url;

    //   // uploadTask.then(async res => {
    //   //   console.log('imgUrl ' + environment.imgFileStorePath + imgUrl)
    //   // })

    // }

    this.questionService.addQuestion(question).subscribe(
      (data: Question) => {
      },
      error => {
        this.errorMsg = error;
      },
      () => {
        this.errorMsg = ""
        alert("Question has been added!")
      }
    )
  }


  async updateQuestion(questionId) {

    var question = this.questionForm.value;
    question.answers = this.answers;

    await this.questionService.updateQuestion(questionId, question).subscribe(
      (data: Question) => {
        console.log(data)
      }, error => {
        this.errorMsg = error;
      },
      () => {
        this.errorMsg = ""
        alert("Question has been UPDATED!")
      }
    )

  }



  deleteAnswer(answer) {
    const index: number = this.answers.indexOf(answer);
    if (index !== -1) {
      this.answers.splice(index, 1);
    }
  }

  validateQuestionText() {
    return this.questionForm.controls['questionText'].valid || this.questionForm.controls['questionText'].untouched
  }


}
