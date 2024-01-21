import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'count'
})
export class CountPipe implements PipeTransform {
   private thousand = 1000;
   private million = 1000000;
   private billion = 1000000000;
   private trillion = 1000000000000;

  transform(value: number): string
  {
    if (value < this.thousand)
    {
      return value + "";  
    }
    if (value < this.million)
    {
      return (value / this.thousand).toFixed(0) + "K";  
    }
    if (value < this.billion)
    {
      return (value / this.million).toFixed(0) + "M";
    }
    if (value < this.trillion)
    {
      return (value / this.billion).toFixed(0) + "B";  
    }
    return (value / this.trillion).toFixed(0) + "T";
  }

}
