import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { MeetingsService } from './meetings.service';
import { Meeting } from './models';

@Component({
  selector: 'app-meetings-list',
  styleUrls: ['./meetings-list.component.css'],
  templateUrl: './meetings-list.component.html',
})
export class MeetingsListComponent implements OnInit {
  meetings: Meeting[] = [];
  loading = false;
  error: string | null = null;

  title = '';
  started_at = '';
  submitted = false;
  creating = false;

  constructor(
    private api: MeetingsService,
    private router: Router,
    private messages: MessageService,
  ) {}

  ngOnInit(): void {
    this.fetch();
  }

  fetch() {
    this.loading = true;
    this.api.listMeetings().subscribe({
      next: (res) => {
        this.meetings = res.results || res;
        this.loading = false;
      },
      error: () => {
        this.error = 'Could not load meetings';
        this.loading = false;
        this.messages.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load meetings',
        });
      },
    });
  }

  open(m: Meeting) {
    this.router.navigate(['/meetings', m.id]);
  }

  create() {
    this.submitted = true;
    if (!this.title || !this.started_at) return;
    this.creating = true;
    this.api.createMeeting({ title: this.title, started_at: this.started_at }).subscribe({
      next: () => {
        this.title = '';
        this.started_at = '';
        this.submitted = false;
        this.creating = false;
        this.fetch();
      },
      error: () => {
        this.error = 'Could not create meeting';
        this.creating = false;
        this.messages.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not create meeting',
        });
      },
    });
  }

  statusSeverity(status?: string): 'success' | 'warning' | 'danger' | 'info' {
    switch (status) {
      case 'ready':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'danger';
      default:
        return 'info';
    }
  }

  statusLabel(status?: string): string {
    if (!status) return '';
    return status.charAt(0).toUpperCase() + status.slice(1);
  }

  statusIcon(status?: string): string {
    switch (status) {
      case 'ready':
        return 'pi pi-check';
      case 'pending':
        return 'pi pi-clock';
      case 'failed':
        return 'pi pi-exclamation-triangle';
      default:
        return '';
    }
  }
}
