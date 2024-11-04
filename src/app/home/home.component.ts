import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Username } from '../models/username.interface';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { map, Observable, startWith, Subscription } from 'rxjs';
import { RegionsService } from 'src/regions.service';
import { Regions } from '../models/region.interface';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from 'moment-timezone';
import { environment } from '../../../src/environments/environments';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  friendForm!: FormGroup;
  stepForm!: FormGroup;
  regionForm!: FormControl;
  filteredJSONDataOptions: Observable<any[]> | undefined;
  usernames = new MatTableDataSource<Username>([]);
  options: Regions[] = [];
  region: any;
  private subs = new Subscription();
  displayedColumns: string[] = ['username'];
  filterValue = '';
  @ViewChild(MatPaginator) paginator: MatPaginator | undefined;
  filterForm = new FormControl();

  constructor(
    private fb: FormBuilder,
    private regionsSv: RegionsService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.initializeForms();
    this.fetchUsernames();
    this.fetchRegions();
    this.setupFilteredOptions();
  }
  // Initialize forms
  private initializeForms(): void {
    this.friendForm = this.fb.group({
      username: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern('^[a-zA-Z0-9]{1,12}$'), // Between 1 and 12 characters
        ]),
      ],
    });

    this.stepForm = this.fb.group({
      steps: [
        null,
        Validators.compose([
          Validators.pattern('^[0-9]*$'), // Allow only digits
          Validators.min(1), // Minimum value 1
          Validators.max(100000),
        ]),
      ],
    });

    // Initialize regionForm as a standalone FormControl
    this.regionForm = new FormControl(null);
  }
  private fetchRegions(): void {
    // Fetch regions data and setup the autocomplete filter
    this.regionsSv.getRegions().subscribe(
      (data) => {
        this.options = data; // Populate options with the data from the service
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching regions:', error);
      }
    );
  }

  private setupFilteredOptions(): void {
    // Set up the filtered options observable
    this.filteredJSONDataOptions = this.regionForm.valueChanges.pipe(
      startWith(''),
      map((value) => this.json_data_filter(value || ''))
    );
  }

  private fetchUsernames(): void {
    this.http.get<Username[]>(`${environment.apiUrl}/usernames`).subscribe(
      (res: Username[]) => {
        this.usernames.data = res;
        console.log(this.usernames.data);
        const userTimezone = moment.tz.guess();
        const serverTimezone = 'America/Denver';

        // Use moment-timezone for both server and user timezones
        this.usernames.data.forEach((username: Username) => {
          const createdAtMoment = moment
            .tz(username.createdAt, serverTimezone)
            .tz(userTimezone); // Convert to user's timezone
          const formattedCreatedAt = createdAtMoment.fromNow();
          username.createdAt = formattedCreatedAt as unknown as Date;
        });
      },
      (error: HttpErrorResponse) => {
        console.error('Error fetching usernames:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usernames.filter = filterValue.trim().toLowerCase();
    console.log('Filter applied');
  }

  clearFilter() {
    console.log('clearing filter');
    this.usernames.filter = '';
    this.filterValue = '';
  }

  // Filter function for the autocomplete
  private json_data_filter(value: string): Regions[] {
    const filterValue = value.toLowerCase();
    return this.options.filter((option) =>
      option.name.toLowerCase().includes(filterValue)
    );
  }

  // Submit function for both forms
  submitUsername(): void {
    var isValid = false;

    const usernameInput = this.friendForm.value;
    let regionInput = this.regionForm.value;
    let stepsInput = this.stepForm.value.steps;

    if (this.friendForm.invalid) {
      this.friendForm.markAllAsTouched();
      this.stepForm.markAllAsTouched();
      return;
    }

    // Looping through each option
    for (var i = 0; i < this.options.length; i++) {
      // Checking if region input matches any option name, stop looping if true
      // if it's empty we won't check anything as this field is optional
      if (!regionInput) {
        isValid = true;
        console.log('valid');
      } else {
        if (this.options[i].name === regionInput) {
          isValid = true;
          console.log('valid');
          break;
        }
      }
    }

    // If true, submit form, else user receives error
    if (isValid) {
      this.http
        .post(`${environment.apiUrl}/username`, {
          username: usernameInput.username,
          date: new Date(),
          region: regionInput || null,
          steps: stepsInput,
        })
        .subscribe((response: any) => {
          this.submitSnackbar('Success!', 'Dismiss', '10000');
          console.log('SUCCESS');
          window.location.reload();
        });
    } else {
      alert('Invalid region');
    }

    console.log('Form submitted successfully:', this.friendForm.value);
  }

  // Restrict special characters in the username input
  restrictSpecialCharacters(event: KeyboardEvent): void {
    const regex = /^[a-zA-Z0-9]*$/; // Allow only letters and numbers
    const key = String.fromCharCode(event.keyCode || event.which); // Get the typed character

    // If the key doesn't match the allowed pattern, prevent input
    if (!regex.test(key) && !this.isControlKey(event)) {
      event.preventDefault();
    }
  }

  // Allow control keys like backspace, delete, etc.
  isControlKey(event: KeyboardEvent): boolean {
    const controlKeys = [
      'Backspace',
      'Tab',
      'ArrowLeft',
      'ArrowRight',
      'Delete',
    ];
    return controlKeys.includes(event.key);
  }

  // Displays the toast when a user copies a username
  copySnackbar(content: string, action: string | undefined, duration: number) {
    this.snackBar.open(content, action, {
      duration: 1000,
      verticalPosition: 'top', // Allowed values are  'top' | 'bottom'
      horizontalPosition: 'center', // Allowed values are 'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  // Displays the toast when a user submits a code successfully
  submitSnackbar(
    content: string,
    action: string | undefined,
    duration: string
  ) {
    this.snackBar.open(content, action, {
      duration: 1000,
      verticalPosition: 'top',
      horizontalPosition: 'center',
      panelClass: ['submit-snackbar'],
    });
  }
}
