import { Component, OnInit } from '@angular/core';
import { Answer, Question} from 'src/app/models/interfaces';
import { QuestionsService } from '../../services/questions.service';



@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  chapterInfo: any;
  questionInfo: Question;
  answers: Answer[] = []
  questionId: string = ""
  questionCreatedDate: String
  _selectedQuestion: Question;
  errorMsg: any=""

  constructor(private questionService: QuestionsService) { }

  ngOnInit(): void {
  }


  onHeaderChange(_chapterInfo) {
    this.chapterInfo = _chapterInfo

    console.log(_chapterInfo)
  }

  onAnswerAdded(_answer) {
    this.answers.push(_answer)
  }

  onQuestionFormClear(isClear) {
    if (isClear) {
      console.log(isClear)
      this.questionCreatedDate = ""
      this.questionId = ""
      this.answers = []
      this._selectedQuestion = null
    }
  }
  onQuestionDelete(question) {
    console.log(question._id)

    this.questionService.deleteQuestion(question._id).subscribe(
      q => {
        console.log(q)
      },
      error => {
        // console.log(error)
        this.errorMsg = error;

      },
      () => {
        this.onQuestionFormClear(true)
        alert("Question has been DELETED!")
      }
    )


  }

  questionSelectedChange(selectedQuestion) {
    this._selectedQuestion = selectedQuestion
    this.answers = this._selectedQuestion.answers
    let timestamp = this._selectedQuestion._id.toString().substring(0, 8)
    let date = new Date(parseInt(timestamp, 16) * 1000)
    this.questionCreatedDate = date.toString()
    this.questionId = JSON.stringify(this._selectedQuestion._id)
    // console.log(selectedQuestion)
  }

  onQuestionSubmit(_question) {

    if (this.answers.length == 0) {
      alert("You need to add some Answers")
      return;
    }
    console.log(_question)
    _question.answers = this.answers
    _question.quizId = this.chapterInfo._id
    _question.subjectId=this.chapterInfo.subject

    if (this.questionId) {
      // _question._id =this.questionId
      console.log(_question)
      this.updateQuestion(this.questionId, _question)
      return;
    }


    this.addNewQuestion(_question);

  }

  addNewQuestion(question) {
    this.questionService.addQuestion(question).subscribe(
      (data: Question) => {
        console.log(data)
        this.questionInfo = data
      },
      error => {
        console.log(error)
        this.errorMsg = error;
      },
      () => {
        this.questionId = this.chapterInfo._id
        let timestamp = this.chapterInfo._id.toString().substring(0, 8)
        let date = new Date(parseInt(timestamp, 16) * 1000)
        this.questionCreatedDate = date.toString()
        alert("Question has beeN added!")
      }
    )
  }


  updateQuestion(questionId, question) {
    console.log(question)
    this.questionService.updateQuestion(questionId, question).subscribe(
      (data: Question) => {
        console.log(data)
      }, error => {
        console.log(error)
        this.errorMsg = error;
      },
      () => {
        alert("Question has beeN UPDATED!")
      }
    )

  }



  deleteAnswer(answer) {

    const index: number = this.answers.indexOf(answer);
    if (index !== -1) {
      this.answers.splice(index, 1);
    }

  }

}
