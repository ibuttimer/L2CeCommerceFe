import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SEARCH_ROUTE } from 'src/app/app.module';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  doSearch(keyword: string): void {
    this.router.navigateByUrl(`/${SEARCH_ROUTE}/${keyword}`);
  }
}
