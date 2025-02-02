import {Component, OnInit} from '@angular/core';
import {UserService} from '../services/user.service';
import {Router} from '@angular/router';
import {User} from "../entities/user";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: User[];
  currentUser: any;
  showUser = false;
  new_user: any;

  constructor(private userService: UserService, private router: Router) {
  }

  ngOnInit() {
    if (!this.userService.isLoggedIn()) {
      alert("Please login");
      this.router.navigate(['']);
    }
    this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
    if (this.currentUser.role === 'ROLE_USER') {
      this.router.navigate(['']);
    }
    else {
      this.userService.getUsers()
        .subscribe((res_data) => {
            if (res_data.status === 200) {
              this.users = res_data.entity;
            }
            else if (res_data.status === 409) {
              alert('Error getting users');
              this.router.navigate(['']);
            }
          },
          error => {
            alert('Error getting users using GET request');
            this.router.navigate(['']);
          });
    }
  }

  deleteUser(username: string) {
    this.userService.deleteUser(username)
      .subscribe((res_data) => {
          if (res_data.status === 204) {
            this.reload_fun();
          }
        },
        error => {
          alert('Error getting users using GET request');
          this.router.navigate(['']);
        });

  }


  saveUser(username, firstName, lastName, password, city, address, state_id, zip, pop_coef, fair_coef, com_coef) {
    let new_user = {
      username: username,
      user_password: password,
      first_name: firstName,
      last_name: lastName,
      city: city,
      state_id: state_id,
      address: address,
      zip: zip,
      role: 'ROLE_USER',
      population_coefficient: pop_coef,
      fairness_coefficient: fair_coef,
      compactness_coefficient: com_coef
    };
    if (state_id.length > 2) {
      alert("State ID Greater than 2");
    }
    else {
      this.userService.editUser(new_user)
        .subscribe((res_data) => {
            if (res_data.status === 200) {
              this.reload_fun();
            }
          },
          error => {
            alert('Error saving user');
            this.router.navigate(['']);
          });
    }
  }

  reload_fun(): any {
    location.reload();
  }

  searchForUser(username: string) {
    if (username.length == 0) {
      alert('username cannot be empty');
    }
    else {
      this.userService.getUser(username)
        .subscribe((res_data) => {
            if (res_data.status === 200) {
              console.log(res_data);
              this.showUser = true;
              this.new_user = res_data.entity
            }
            if (res_data.status === 404) {
              alert('user not found');
            }
          },
          error => {
            alert('Error saving user');
            this.router.navigate(['']);
          });
    }

  }
}
