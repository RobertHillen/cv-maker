import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AvatarUploadComponent } from './shared/avatar-upload/avatar-upload.component';
import { InputTextComponent } from './shared/input-text/input-text.component';
import { InputTextAreaComponent } from './shared/input-textarea/input-textarea.component';
import { QuillModule } from 'ngx-quill'
import { DatePipe } from '@angular/common'

@NgModule({
  declarations: [
    AppComponent,
    AvatarUploadComponent,
    InputTextComponent,
    InputTextAreaComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot()
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
