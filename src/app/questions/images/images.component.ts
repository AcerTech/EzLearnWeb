import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { Subscription } from 'rxjs';
import { Image } from 'src/app/models/interfaces';
import { ImagesService } from 'src/app/services';

@Component({
  selector: 'app-images',
  templateUrl: './images.component.html',
  styleUrls: ['./images.component.css']
})
export class ImagesComponent implements OnInit {
  images: Image[] = []
  tags: string = ""
  errorMsg: any
  sub: Subscription

  constructor(private imageService: ImagesService, private storage: AngularFireStorage) { }

  ngOnInit(): void {
    // this.getImages();
  }


  searchImages() {
    this.images = []
    // console.log(this.tags)
    if (!this.tags) {
      return;
    }
    this.sub = this.imageService.searchImagesByTags(this.tags).subscribe(
      data => {
        this.images = data
        console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }

  getImages() {

    this.sub = this.imageService.getImages().subscribe(
      data => {
        this.images = data
        console.log(data)
      }, (err: any) => {
        this.errorMsg = err
      }
    )
  }

  deleteImage(url) {

    if (confirm("Are you sure to delete this image?")) {
      const info = this.images.find(i => i.imgUrl == url);
      const index: number = this.images.indexOf(info);
      if (index !== -1) {
        this.images.splice(index, 1);
      }
      this.storage.storage.refFromURL(url).delete();

      //TODO:delete image info from the db
      this.imageService.deleteImageByUrl(url).subscribe(
        () => {
          console.log('Deleted')
        },
        error => {
          console.log(error)
          this.errorMsg = error;
        },
        () => {
          this.errorMsg = ""
          // alert("Image has been deleted!")
        }
      )

    }


  }


  copyToClipboard(url) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = url;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }


}
