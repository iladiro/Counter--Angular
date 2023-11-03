# Counter
Angular Counter plugin with countdown and progress bar, flexible and easily customizable

# Before start

  1. npm i @iladiro/angular-counter
  2. Import IladiroCounterModule into your module from import { IladiroCounterModule } from '@iladiro/angular-counter';

# Getting Setup

  Use ```<iladiro-counter></iladiro-counter>``` selector to show the counter

  Note: The example below shows the mandatory data!

  ```<iladiro-counter [startDate]="'<yourDate>'" [endDate]="'<yourDate>'"></iladiro-counter>```

# Options

  Other options are available besides the mandatory ones

  property | type | required | default | notes
  ------------ | ------------- | ------------- | ------------- | -------------
  startDate | ``` string ``` | yes | ``` undefined ``` | The format to be used is yyyy/mm/dd hh:mm:ss
  endDate | ``` string ``` | yes | ``` undefined ``` | The format to be used is yyyy/mm/dd hh:mm:ss
  title | ``` string ``` | no | ``` undefined ``` | If this data is not passed, the title will not be displayed
  customClass | ``` string ``` | no | ``` undefined ``` | It can be useful to add a custom class to the counter
  expiredAlertText | ``` string ``` | no | ``` Time is expired ``` | This string is shown at the end of the countdown
  progressbarSize | ``` string ``` | no | ``` undefined ``` | To have different sizes (sm - md - lg - xxl)
  progressbarColor | ``` string ``` | no | ``` undefined ``` | To change the color of the bar
  daysLabel | ``` string ``` | no | ``` Days ``` | To show the day field label
  hoursLabel | ``` string ``` | no | ``` Hours ``` | To show the hours field label
  minutesLabel | ``` string ``` | no | ``` Minutes ``` | To show the minutes field label
  secondsLabel | ``` string ``` | no | ``` Seconds ``` | To show the seconds field label
  expiredEvent | ``` event ``` | no | ``` undefined ``` | When the counter expires, the event is issued. Value is a boolean
  
