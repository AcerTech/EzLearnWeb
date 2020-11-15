export interface Grade {
    _id: String,
    name: String,
    description: String,
    isActive: Boolean,
    displayOrder: Number
}

export interface Question {
    _id: String,
    questionText: String,
    timer: Number,
    imgUrl: String,
    displayOrder: Number,
    columnsCount: Number,
    isActive: Boolean,
    quiz: Quiz,
    questionType: QuestionType,
    subject: Subject,
    chapter: Chapter,
    grade: Grade,
    answers: Answer[]
}


export interface Answer {
    _id: String,
    answerText: String,
    isCorrect: Boolean,
    imgUrl: String,
    displayOrder: Number
}


export interface Image {
    _id: string,
    tags: String,
    imgUrl: String
}

export interface QuestionType {
    _id: String,
    name: String,
    isActive: Boolean,
    description: String,
    displayOrder: Number
}

export interface Quiz {
    _id: string,
    name: String,
    description: String,
    isActive: Boolean,
    displayOrder: Number,
    chapter: Chapter
}

export interface Subject {
    _id: String,
    name: String,
    description: String,
    isActive: Boolean,
    displayOrder: Number,
    grade: Grade
}

export interface Chapter {
    _id: String,
    name: String,
    description: String,
    isActive: Boolean,
    displayOrder: Number,
    subject: String
}

export interface User {
    _id: String,
    name: String,
    email: String,
    password: String,
    role: string,

}