import { Component, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup } from "@angular/forms";

@Component({
  selector: 'avatar-upload',
  templateUrl: './avatar-upload.component.html',
  styleUrls: ['./avatar-upload.component.scss']
})

export class AvatarUploadComponent {
  @Input() imageURL: string;
  @Output() onChange = new EventEmitter<string>();

  avatarForm: FormGroup;

  constructor(public fb: FormBuilder) {
      this.avatarForm = this.fb.group({
      avatar: [null],
      name: ['']
    })
  }

  showPreview(event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.avatarForm.patchValue({
      avatar: file
    });
    this.avatarForm.get('avatar').updateValueAndValidity()

    const reader = new FileReader();
    reader.onload = () => {
      this.imageURL = reader.result as string;
      this.onChange.emit(this.imageURL);
    }
    reader.readAsDataURL(file);
  }
}
