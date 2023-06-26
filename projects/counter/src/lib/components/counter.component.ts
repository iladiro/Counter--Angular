import { Component, ElementRef, Input, SimpleChanges, ViewChild } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CurrentDate } from '../interfaces/currentDate';
import { ProgressbarLabel } from '../interfaces/progressbarlabel';
import { CountDownLabel } from '../interfaces/countdownlabel';

@Component({
  selector: 'iladiro-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent {

  private onDestroy$ = new Subject<void>();

  @Input() title!: string;
  @Input() expiredAlertText: string = 'Time out';
  @Input() startDate!: string;
  @Input() endDate!: string;
  @Input() progressbarSize!: string;
  @Input() progressbarColor!: string;

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

  constructor() {}

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

  calculatePastDays(): number {
    return (
      this.convertToTimeStamp(this.getCurrentDate().dateTime) -
      this.convertToTimeStamp(this.startDate)
    ) / (1000 * 3600 * 24);
  }

  calculateMissingDays(): number {
    return this.totalDays - this.calculatePastDays();
  }

  dateValidation(value: string): boolean {
    const rejex = /[0-9]{4}[\/\-](0[1-9]|1[0-2])[\/\-](0[1-9]|[1-2][0-9]|3[0-1]) (2[0-3]|[01][0-9]):[0-5][0-9]/;
    const res = value.match(rejex);
    return (res) ? true : false;
  }

  percentage(partialValue: number, totalValue: number): number {
    return (100 * partialValue) / totalValue;
  }

  calculatePercentageInTime() {
    return {
      "missingDaysPercent": this.percentage(
        this.calculateMissingTime(), this.totalTime
      ),
      "pastDaysPercent": this.percentage(
        this.calculatePastTime(), this.totalTime
      )
    }
  }

  calculatePercentageInDays() {
    return {
      "missingDaysPercent": this.percentage(
        this.calculateMissingDays(), this.totalDays
      ),
      "pastDaysPercent": this.percentage(
        this.calculatePastDays(), this.totalDays
      )
    }
  }

  progressCounterBar(): ProgressbarLabel {
    this.distance = this.calculateMissingTime();

    const missingPerc = this.calculatePercentageInTime().missingDaysPercent;
    const pastPerc = this.calculatePercentageInTime().pastDaysPercent;

    const condition = this.distance <= 0;

    return {
      missing: condition ? 0 : missingPerc,
      past: condition ? 0 : pastPerc
    }
  }
  
  countdown(): CountDownLabel {
    this.distance = this.calculateMissingTime();

    // Time calculations for days, hours, minutes and seconds
    const days = Math.floor(this.distance / (1000 * 3600 * 24));
    const hours = Math.floor((this.distance % (1000 * 3600 * 24)) / (1000 * 3600));
    const minutes = Math.floor((this.distance % (1000 * 3600)) / (1000 * 60));
    const seconds = Math.floor((this.distance % (1000 * 60)) / 1000);

    const isExpired = this.distance <= 0;

    if(isExpired) {      
      this.expired = true;
    }

    return {
      days: isExpired ? 0 : days,
      hours: isExpired ? 0 : hours,
      minutes: isExpired ? 0 : minutes,
      seconds: isExpired ? 0 : seconds
    }
  }

  resizeProgressCounterBar(obj: ProgressbarLabel): void {   
    this.missing.nativeElement.attributes['style'].value = `width: ${obj.missing}%;`;
    this.past.nativeElement.attributes['style'].value = `width: ${obj.past !== 0 ? obj.past : 100}%`;

    this.missingPercentage = obj.missing !== 0 ? Math.round(obj.missing) : 100;
    this.pastPercentage = Math.round(obj.past);   
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['startDate'] && changes['endDate']) {
      if((this.dateValidation(changes['startDate'].currentValue) === false) || (this.dateValidation(changes['endDate'].currentValue) === false)) {        
        console.log("Incorrect startDate or endDate values");
      } else {
        this.totalDays = this.calculateTotalDays(changes['startDate'].currentValue, changes['endDate'].currentValue);
        this.totalTime = this.calculateTotalTime(changes['startDate'].currentValue, changes['endDate'].currentValue);
      }
    }     
  }

  ngAfterViewInit(): void {
    this.resizeProgressCounterBar(this.progressCounterBar());

    this.countdownRun = setInterval(() => {
      const count = this.countdown();
      this.days = count.days;
      this.hours = count.hours;
      this.minutes = count.minutes;
      this.seconds = count.seconds;
    }, 1000);

    this.progressbarRun = setInterval(() => {
      this.resizeProgressCounterBar(this.progressCounterBar());
    }, 6000);
  }

  ngOnDestroy(): void {
    if(this.countdownRun) {
      clearInterval(this.countdownRun);
    }

    if(this.progressbarRun) {
      clearInterval(this.progressbarRun);
    }
  }

}
