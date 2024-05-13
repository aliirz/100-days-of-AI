import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http'; // For making HTTP requests
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, HttpClientModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  
})
export class AppComponent {
  title = 'is-it-pizza';
  selectedFile: File | null = null;
  apiResponse: any = null; // Store the server response
  imagePreview: string | ArrayBuffer = ''; // Initialize the 'imagePreview' property


  constructor(private http: HttpClient) {}

    
  onFileSelected(event: any) {
    event.preventDefault();
    this.selectedFile = event.target.files[0];
    const reader = new FileReader();
    if (this.selectedFile) {
      reader.onload = () => {
        this.imagePreview = reader.result as string | ArrayBuffer; // Add type assertion here
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  onUpload() {
    if (!this.selectedFile) return;

    const formData = new FormData();
    formData.append('image', this.selectedFile);

    this.http.post('http://localhost:8000', formData)
      .subscribe(response => {
        console.log(response);
        this.apiResponse = response;
        // Handle the response, e.g., display a message or the image itself
      });
  }

}
