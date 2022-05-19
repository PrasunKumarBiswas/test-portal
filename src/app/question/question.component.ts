import { Component, OnInit } from '@angular/core';
import { QuestionsService } from '../questions.service';
import { interval } from 'rxjs';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  public name: string="";
  public questionList: any=[];
  public currentQuestion: number=0;
  public point: number=0;
  counter=60;
  correctAnswer: number=0;
  wrongAnswer: number=0;
  Interval$: any;
  progress: string="0";
  isQuizComplete: boolean = false;

  constructor(private questionService : QuestionsService) { }

  ngOnInit(): void {
    this.name = localStorage.getItem('name')!;
    this.GetAllQuestions();
    this.StartCounter();
  }

  GetAllQuestions(){
    this.questionService.GetQuestionJson()
    .subscribe(response=>{
      this.questionList = response.questions;
    });
  }

  NextQuestion(){
    this.currentQuestion++;
    this.ResetCounter();
    this.getProgressPercent();
  }

  PrevQuestion(){
    this.currentQuestion--;
    this.ResetCounter();
    this.getProgressPercent();
  }

  Answer(currentQuestionNumber: number, option: any){

    if(currentQuestionNumber==this.questionList.length){
      this.isQuizComplete = true;
      this.StopCounter();
    }

     if(option.correct){
       this.point+=10;
       this.correctAnswer++;
       this.currentQuestion++;
       this.ResetCounter();
       this.getProgressPercent();
     }
     else{
       this.point-=10;
       this.wrongAnswer++;
       this.currentQuestion++;
       this.ResetCounter();
       this.getProgressPercent();
     }
  }

  StartCounter(){
    this.Interval$=interval(1000)
    .subscribe(value=>{
      this.counter--;
      if(this.counter==0){
        this.currentQuestion++;
        this.counter=60;
      }
    });
    
  }
  
  StopCounter(){
    this.Interval$.unsubscribe();
    this.counter=0;
  }

  ResetCounter(){
    this.StopCounter();
    this.counter=60;
    this.StartCounter();
  }

  ResetQuiz(){
    this.ResetCounter();
    this.GetAllQuestions();
    this.point=0;
    this.currentQuestion=0;
    this.progress="0";
  }

  getProgressPercent(){
    this.progress = ((this.currentQuestion/this.questionList.length)*100).toString();
    return this.progress;
  }
 
}
