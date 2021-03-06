import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../services/users/users.service';
import { IUser } from '../../models/user.model';
import { IUserParams } from '../../models/user-params.model';
import * as moment from 'moment';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  public route$: Subscription;
  public accessToken: string;
  public limit = 25;
  public pageNumber: number;
  public searchValue: string;
  public userStatus: string;
  public userAccountType: string;
  public selectSort: string;
  public selectedStartDate: FormControl = new FormControl(moment());
  public selectedEndDate: FormControl = new FormControl(moment());
  public serialNumber = 0;
  public userData: IUser[] = [];
  public displayedColumns: string[] = [
    's.no.',
    'name',
    'email',
    'type',
    'signupVia',
    'status',
    'createdAt',
    'lastAccessed',
    // 'actions',
  ];
  public loading = false;

  // MatPaginator Inputs
  public totalRecords = 0; // TOTAL RECORDS COUNT
  public pageIndex = 0; // CURRENT PAGE NUMBER
  public pageSize = this.limit; // TOTAL NUMBER OF RECORDS TO SHOW
  public pageSizeOptions: number[] = [5, 10, 25, 100]; // PAGE SIZE OPTIONS

  // MatPaginator Output
  pageEvent: PageEvent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService
  ) {}

  async getUpdatedUsers(params: IUserParams) {
    let pageNumber = 1;
    let searchValue = '';
    let status = '';
    let accountType = '';
    let sort = 'createdAt DESC';
    let date = '';

    if (params.hasOwnProperty('search')) {
      searchValue = params.search;
    }

    const currentPage = pageNumber;
    if (params.page && parseInt(params.page, 10) !== currentPage) {
      pageNumber = parseInt(params.page, 10);
    }

    if (params.hasOwnProperty('status')) {
      status = params.status;
    }

    if (params.hasOwnProperty('accountType')) {
      accountType = params.accountType;
    }

    if (params.hasOwnProperty('sort')) {
      sort = params.sort;
    }

    if (params.hasOwnProperty('date') && params.date !== 'date') {
      date = params.date;
    }

    const d = date.split('to');

    this.searchValue = searchValue;
    this.pageNumber = pageNumber;
    this.userStatus = status;
    this.userAccountType = accountType;
    this.selectSort = decodeURIComponent(sort);
    this.selectedEndDate.setValue(d[1] ? moment(d[1]) : undefined);
    this.selectedStartDate.setValue(d[0] ? moment(d[0]) : undefined);
    this.serialNumber = this.limit * (pageNumber - 1) + 1;

    const where: any[] = [];

    if (searchValue) {
      where.push({
        or: [
          {
            name: { like: `${searchValue}.*`, options: 'i' },
          },
          {
            id: searchValue,
          },
        ],
      });
    }

    if (status) {
      where.push({
        status,
      });
    }

    if (accountType) {
      where.push({
        type: accountType,
      });
    }

    if (this.selectedStartDate.value && this.selectedEndDate.value) {
      const dateFilter = {
        createdAt: {
          between: [this.selectedStartDate.value, this.selectedEndDate.value],
        },
      };
      where.push(dateFilter);
    }

    if (this.selectedStartDate.value && !this.selectedEndDate.value) {
      const dateFilter = {
        createdAt: {
          gte: this.selectedStartDate.value,
        },
      };
      where.push(dateFilter);
    }

    if (!this.selectedStartDate.value && this.selectedEndDate.value) {
      const dateFilter = {
        createdAt: {
          gte: this.selectedEndDate.value,
        },
      };
      where.push(dateFilter);
    }

    const condition = {
      limit: this.limit,
      skip: (pageNumber - 1) * this.limit,
      order: `${this.selectSort}`,
      where: {},
    };

    if (where.length) {
      condition.where = { and: where };
    }

    this.getUsers(condition);
    this.getCount(condition.where);
  }

  async getCount(params = {}) {
    this.totalRecords = 0;
    try {
      await this.userService.getUserscount(params).subscribe(res => {
        this.totalRecords = res.count;
      });
    } catch (error) {
      this.totalRecords = 0;
    }
  }

  async getUsers(params = {}) {
    this.loading = true;
    this.userData = [];
    try {
      this.userService.fetchUsers(params).subscribe((res: IUser[]) => {
        this.userData = [...res];
        this.loading = false;
      });
    } catch (error) {
      this.loading = false;
    }
  }

  async onApplyFilters() {
    this.router.navigate(['/admin/users'], {
      queryParams: {
        search: this.searchValue,
        status: this.userStatus,
        accountType: this.userAccountType,
        sort: this.selectSort,
        date: [
          this.selectedStartDate.value
            ? moment(this.selectedStartDate.value).format('YYYY-MM-DD')
            : '',
          this.selectedEndDate.value
            ? moment(this.selectedEndDate.value).format('YYYY-MM-DD')
            : '',
        ].join('to'),
      },
    });
  }

  async onResetFilters() {
    this.router.navigate(['/admin/users']);
  }

  async onPaginateChange(e: Event) {
    console.log(e);
  }

  async ngOnInit() {
    this.route$ = this.route.queryParams.subscribe(
      async (params: IUserParams) => {
        await this.getUpdatedUsers(params);
      }
    );
  }

  async ngOnDestroy() {
    await this.route$.unsubscribe();
  }
}
