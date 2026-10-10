import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from "@angular/forms";
import { FileSelectEvent, FileUploadModule } from '@openng/optimus-ui/fileupload';

@Component({
  selector: 'avatar-upload',
  imports: [CommonModule, ReactiveFormsModule, FileUploadModule],
  templateUrl: './avatar-upload.component.html',
  styleUrl: './avatar-upload.component.css'
})

export class AvatarUploadComponent {
  @Input() imageURL: string;
  @Output() imageLoaded = new EventEmitter<string>();

  public fb: FormBuilder = inject(FormBuilder);

  avatarForm: FormGroup = this.fb.group({
    avatar: [null],
    name: ['']
  });

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
      this.imageLoaded.emit(this.imageURL);
    }
    reader.readAsDataURL(file);
  }
}
