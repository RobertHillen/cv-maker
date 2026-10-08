import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { ControlContainer, NgForm } from '@angular/forms';

@Component({
  selector: 'input-textarea',
  standalone: false,
  viewProviders: [{ provide: ControlContainer, useExisting: NgForm }],
  templateUrl: './input-textarea.component.html',
  styleUrls: ['./input-textarea.component.scss']
})

export class InputTextAreaComponent {
  @Input() name: string;
  @Input() label: string;
  @Input() value: string;
  @Input() placeHolder: string;
  @Input() rows: number = 3;
  @Input() isRequired: boolean = false;

  @Output() onBlur = new EventEmitter<string>();

  constructor(private cd: ChangeDetectorRef) { }

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  valueChanged(value: string){
    this.onBlur.emit(value);
  }

  public hasLabel() {
    return this.label === undefined ? false : this.label.length > 0;
  }
}
