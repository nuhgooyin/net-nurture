import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrl: './credits.component.css',
})
export class CreditsComponent implements OnInit {
  error: string = '';

  constructor(private api: ApiService) {}

  ngOnInit(): void {}
}
