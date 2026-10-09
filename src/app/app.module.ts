import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { AvatarUploadComponent } from './shared/avatar-upload/avatar-upload.component';
import { DatePipe } from '@angular/common'
import { RadioButtonModule } from '@openng/optimus-ui/radiobutton';
import { ButtonModule } from '@openng/optimus-ui/button';
import { SelectButtonModule } from '@openng/optimus-ui/selectbutton';
import { InputTextModule } from '@openng/optimus-ui/inputtext';
import { FloatLabelModule } from '@openng/optimus-ui/floatlabel';
import { TextareaModule } from '@openng/optimus-ui/textarea';
import { FileUploadModule } from '@openng/optimus-ui/fileupload';
import { provideOptimus } from '@openng/optimus-ui/config';
import Aura from '@openng/optimus-ui-themes/aura';

@NgModule({
  declarations: [
    AppComponent,
    AvatarUploadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RadioButtonModule,
    ButtonModule,
    SelectButtonModule,
    InputTextModule,
    FloatLabelModule,
    TextareaModule,
    FileUploadModule,
  ],
  providers: [
    DatePipe,
    provideHttpClient(),
    provideOptimus({
      theme: {
        preset: Aura,
        options: { darkModeSelector: false }
      }
    })
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
