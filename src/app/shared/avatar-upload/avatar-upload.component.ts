import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FileSelectEvent, FileUploadModule } from '@openng/optimus-ui/fileupload';

@Component({
  selector: 'avatar-upload',
  imports: [CommonModule, ReactiveFormsModule, FileUploadModule],
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

  showPreview(event: FileSelectEvent) {
    const file = event.currentFiles[0];
    if (!file) {
      return;
    }

    this.avatarForm.patchValue({
      avatar: file,
      name: file.name
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
