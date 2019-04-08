import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss'],
})
export class ErrorComponent implements OnInit {
  public routeParams: Params;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {}

  ngOnInit() {
    // this.routeParams = this.activatedRoute.snapshot.queryParams;

    const errors = this.activatedRoute.snapshot.queryParams;
    this.routeParams = { error: { ...errors } };

    if (!this.routeParams.error) {
      this.router.navigate(['/']);
    }
  }
}
