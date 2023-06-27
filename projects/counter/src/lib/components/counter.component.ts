import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CurrentDate } from '../interfaces/currentDate';
import { ProgressbarLabel } from '../interfaces/progressbarlabel';
import { CountDownLabel } from '../interfaces/countdownlabel';

@Component({
  selector: 'iladiro-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnChanges, OnDestroy, AfterViewInit {  

  @Input() customClass!: string;
  @Input() title!: string;
  @Input() expiredAlertText: string = 'Time out';
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() progressbarSize!: string;
  @Input() progressbarColor!: string;
  @Input() daysLabel = 'days';
  @Input() hoursLabel = 'hours';
  @Input() minutesLabel = 'minutes';
  @Input() secondsLabel = 'seconds';

  @Output() expiredEvent = new EventEmitter();

  @ViewChild('missing') missing!: ElementRef;
  @ViewChild('past') past!: ElementRef;

  days = 0;
  hours = 0;
  minutes = 0;
  seconds = 0;

  missingPercentage = 100;
  pastPercentage = 0;

  distance!: number;
  totalDays!: number;
  totalTime!: number;
  expired = false;

  progressbarRun!: any;
  countdownRun!: any;

  constructor(public cdRef:ChangeDetectorRef) {}

  convertToTimeStamp(value: string): number {
    return new Date(value).getTime();
  }

  getCurrentDate(): CurrentDate {
    const today = new Date();
    const date = `${today.getFullYear()}/${today.getMonth()+1}/${today.getDate()}`;
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;

    return {
      "date": date,
      "time": time,
      "dateTime": `${date} ${time}`
    }
  }

  calculateTotalTime(start: string, end: string): number {
    return this.convertToTimeStamp(end) - this.convertToTimeStamp(start);
  }

  calculatePastTime(): number {
    return this.convertToTimeStamp(this.getCurrentDate().dateTime) - this.convertToTimeStamp(this.startDate);
  }

  calculateMissingTime(): number {      
    return this.totalTime - this.calculatePastTime();
  }

  calculateTotalDays(start: string, end: string): number {
    return (
      this.convertToTimeStamp(end) -
      this.convertToTimeStamp(start)
    ) / (1000 * 3600 * 24);
  }

  dateValidation(value: string): boolean {
    const rejex = /[0-9]{4}[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    const res = value.match(rejex);
    return (res) ? true : false;
  }

  percentage(partialValue: number, totalValue: number): number {
    return (100 * partialValue) / totalValue;
  }

  calculatePercentageInTime(): ProgressbarLabel {
    return {
      "missing": this.percentage(
        this.calculateMissingTime(), this.totalTime
      ),
      "past": this.percentage(
        this.calculatePastTime(), this.totalTime
      )
    }
  }

  isExpired(): boolean {
    return this.calculateMissingTime() < 0;
  }
  
  countdown(isExpired: boolean): CountDownLabel {
    this.distance = this.calculateMissingTime();

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(this.distance / (1000 * 3600 * 24));
    const hours = Math.floor((this.distance % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((this.distance % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

    //const isExpired = this.isExpired();

    return {
      days: isExpired ? 0 : days,
      hours: isExpired ? 0 : hours,
      minutes: isExpired ? 0 : minutes,
      seconds: isExpired ? 0 : seconds
    }
  }

  progressCounterBar(): ProgressbarLabel {
    this.distance = this.calculateMissingTime();

    const missingPerc = this.calculatePercentageInTime().missing;
    const pastPerc = this.calculatePercentageInTime().past;

    const condition = this.distance < 0;    

    return {
      missing: condition ? 0 : missingPerc,
      past: condition ? 100 : pastPerc
    }
  }

  resizeProgressCounterBar(obj: ProgressbarLabel): void {    
    this.missing.nativeElement.attributes['style'].value = `width: ${obj.missing}%;`;
    this.past.nativeElement.attributes['style'].value = `width: ${obj.past}%`;

    this.missingPercentage = Math.round(obj.missing);
    this.pastPercentage = Math.round(obj.past);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['startDate'] && changes['endDate']) {
      if((this.dateValidation(changes['startDate'].currentValue) === false) || (this.dateValidation(changes['endDate'].currentValue) === false)) {        
        console.log("Incorrect startDate or endDate values");
      } else {
        if(this.convertToTimeStamp(changes['endDate'].currentValue) > this.convertToTimeStamp(changes['startDate'].currentValue)) {
          this.totalDays = this.calculateTotalDays(changes['startDate'].currentValue, changes['endDate'].currentValue);
          this.totalTime = this.calculateTotalTime(changes['startDate'].currentValue, changes['endDate'].currentValue);
        } else {
          console.log("la data di fine deve essere maggiore della data di inizio");
        }       
      }
    }     
  }

  settingDate(count: CountDownLabel): void {
    this.days = count.days;
    this.hours = count.hours;
    this.minutes = count.minutes;
    this.seconds = count.seconds;
  }

  clearAllaSetInterval(): void {
    if(this.countdownRun) {
      clearInterval(this.countdownRun);
    }

    if(this.progressbarRun) {
      clearInterval(this.progressbarRun);
    }
  }

  ngAfterViewInit(): void {  
    if(this.isExpired()) {
      this.resizeProgressCounterBar(this.progressCounterBar());
      this.settingDate(this.countdown(true));      
    } else {
      this.resizeProgressCounterBar(this.progressCounterBar());

      this.countdownRun = setInterval(() => {           
        if(this.isExpired()){          
          clearInterval(this.countdownRun);
          this.expired = true;
          this.expiredEvent.emit(true);
        } else {
          this.settingDate(this.countdown(false));
        }         
      }, 1000);

      this.progressbarRun = setInterval(() => {
        if(this.isExpired()){
          clearInterval(this.progressbarRun);
        } else {
          this.resizeProgressCounterBar(this.progressCounterBar());
        }          
      }, 6000);
    } 

    this.cdRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.clearAllaSetInterval();
  }

}
