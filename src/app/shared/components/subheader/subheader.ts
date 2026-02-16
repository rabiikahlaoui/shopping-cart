import { Component, input } from '@angular/core';

@Component({
  selector: 'app-subheader',
  imports: [],
  templateUrl: './subheader.html',
  styleUrl: './subheader.scss',
})
export class Subheader {
  title = input<string>('');
}
