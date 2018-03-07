import { Component } from '@angular/core';
import {MatDialog} from '@angular/material';
import {LogindialogComponent} from "../logindialog/logindialog.component";
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent{

  name: string;
  password: string;
  res: any;
  nav_bar_name = "Login";
  logged_in = false;

  constructor(public dialog: MatDialog, public router: Router, private http: HttpClient) {}

  openDialog(): void {
    let dialogRef = this.dialog.open(LogindialogComponent, {
      height: '400px',
      width: '600px',
      data: { name: this.name, password: this.password}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.name = result.name;
      this.password = result.password;
      this.login();
    });
  }


  login() {
    var username = this.name;
    var password = this.password;
    let headers = new HttpHeaders();
    headers = headers.append('Authorization', 'Basic ' + btoa(username + ':' + password));
    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
    //event.preventDefault();
    let body = JSON.stringify({ username, password });
    this.http.get('http://localhost:8080/login', { headers: headers})
      .subscribe((data) => {
        console.log(data)
        this.res = data;
        if (this.res.entity.roles["0"]=='ROLE_USER'){
          this.logged_in=true;
          this.nav_bar_name=this.name;
        }

      },
        error => {
          console.log(error);
          alert('Username/Password Bad');
        });
  }

  logout(){
    console.log("logout");
  }

  goHome() {
    this.router.navigate(['']);
  }
}

