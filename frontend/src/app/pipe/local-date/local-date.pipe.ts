import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'localDate'
})
export class LocalDatePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): string {
    
    const currentDateTime = new Date().getTime();
    const postedDate = new Date(value);
    const postedDateTime = postedDate.getTime();

    var diff = currentDateTime - postedDateTime;
    var seconds = Math.round(diff / 1000);
    if (seconds < 60)
    {
      return "Just now"; 
    }
    var minutes = Math.round(seconds / 60);
    if (minutes < 60)
    {
      return `${minutes}m`;
    }
    var hours = Math.round(minutes / 60);
    if (hours < 24)
    {
      return `${hours}h`; 
    }
    var days = Math.round(hours / 24);
    if (days < 7)
    {
      return `${days}d`;  
    }
    var weeks = Math.round(days / 7);
    if (weeks < 4)
    {
      return `${weeks}w`;   
    }
    var months = Math.round(weeks / 4);
    if (months < 12)
    {
      return `${months} Month`;  
    }
    var years = Math.round(months / 12);
    return `${years}y`;  
  
    //return postedDate.toLocaleString();
  }

}
