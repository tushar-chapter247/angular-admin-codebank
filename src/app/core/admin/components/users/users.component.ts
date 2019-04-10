import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { UsersService } from '../../../services/users/users.service';

interface IUserParams {
  search: string;
  page: string;
  status: string;
  accountType: string;
  date: string;
  sort: string;
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit, OnDestroy {
  public route$: Subscription;
  public accessToken: string;
  public totalRecords = 0;
  public limit = 25;
  public pageNumber: number;
  public searchValue: string;
  public userStatus: string;
  public userAccountType: string;
  public selectSort: string;
  public selectedStartDate: Date;
  public selectedEndDate: Date;
  public userData: any[] = [];
  public loading = false;

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
    this.selectedEndDate = d[1] ? new Date(d[1]) : undefined;
    this.selectedStartDate = d[0] ? new Date(d[0]) : undefined;

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

    if (this.selectedStartDate && this.selectedEndDate) {
      const dateFilter = {
        createdAt: {
          between: [this.selectedStartDate, this.selectedEndDate],
        },
      };
      where.push(dateFilter);
    }

    if (this.selectedStartDate && !this.selectedEndDate) {
      const dateFilter = {
        createdAt: {
          gte: this.selectedStartDate,
        },
      };
      where.push(dateFilter);
    }

    if (!this.selectedStartDate && this.selectedEndDate) {
      const dateFilter = {
        createdAt: {
          gte: this.selectedEndDate,
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
      this.userService.fetchUsers(params).subscribe((res: any[]) => {
        this.userData = [...res];
      });
    } catch (error) {
      this.loading = true;
      this.userData = [];
    }
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
