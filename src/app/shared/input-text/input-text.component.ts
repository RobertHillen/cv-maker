import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'input-text',
  templateUrl: './input-text.component.html',
  styleUrls: ['./input-text.component.scss']
})

export class InputTextComponent {
  @Input() name: string;
  @Input() label: string;
  @Input() value: string;
  @Input() placeHolder: string;
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
