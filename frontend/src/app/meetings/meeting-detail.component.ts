import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MeetingsService } from './meetings.service';
import { MessageService } from 'primeng/api';
import { Meeting, Note, Summary } from './models';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-meeting-detail',
  templateUrl: './meeting-detail.component.html',
  styleUrls: ['./meeting-detail.component.css'],
})
export class MeetingDetailComponent implements OnInit, OnDestroy {
  meeting: Meeting | null = null;
  notes: Note[] = [];
  summary: Summary | null = null;
  notesLoading = false;

  author = '';
  text = '';
  authorTouched = false;
  noteTouched = false;

  loading = false;
  loadingSummary = false;
  error: string | null = null;
  adding = false;

  pollSub?: Subscription;

  constructor(
    private route: ActivatedRoute,
    private api: MeetingsService,
    private router: Router,
    private messages: MessageService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.loading = true;
    this.api.getMeeting(id).subscribe({
      next: (m) => {
        this.meeting = m;
        this.loading = false;
        this.fetchNotes();
        this.fetchSummary();
      },
      error: () => {
        this.error = 'Could not load meeting';
        this.loading = false;
        this.messages.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Could not load meeting',
        });
      },
    });
  }

  ngOnDestroy(): void {
    this.pollSub?.unsubscribe();
  }

  fetchNotes(page = 1) {
    if (!this.meeting) return;
    this.notesLoading = true;
    this.api.listNotes(this.meeting.id, page).subscribe({
      next: (res) => {
        this.notes = res.results || res;
        this.notesLoading = false;
      },
      error: () => {
        this.notesLoading = false;
        this.messages.add({
          severity: 'error',
          summary: 'Load failed',
          detail: 'Could not load notes',
        });
      },
    });
  }

  fetchSummary() {
    if (!this.meeting) return;
    this.loadingSummary = true;
    this.api.getSummary(this.meeting.id).subscribe({
      next: (s) => {
        this.summary = s;
        this.loadingSummary = false;
      },
      error: () => {
        this.loadingSummary = false;
        this.messages.add({
          severity: 'error',
          summary: 'Load failed',
          detail: 'Could not load summary',
        });
      },
    });
  }

  addNote() {
    if (!this.meeting) return;
    this.authorTouched = true;
    this.noteTouched = true;
    if (!this.author || !this.text) return;
    this.adding = true;
    this.api.addNote(this.meeting.id, { author: this.author, text: this.text }).subscribe({
      next: (n) => {
        this.notes = [...this.notes, n];
        this.author = '';
        this.text = '';
        this.authorTouched = false;
        this.noteTouched = false;
        this.adding = false;
      },
      error: () => {
        this.adding = false;
        this.messages.add({
          severity: 'error',
          summary: 'Add failed',
          detail: 'Could not add note',
        });
      },
    });
  }

  generateSummary() {
    if (!this.meeting) return;
    this.api.summarize(this.meeting.id).subscribe({
      next: () => {
        this.pollSub?.unsubscribe();
        this.pollSub = interval(2000).subscribe(() => {
          this.api.getSummary(this.meeting!.id).subscribe({
            next: (s) => {
              this.summary = s;
              if (s.status !== 'pending') this.pollSub?.unsubscribe();
            },
            error: () => {},
          });
        });
      },
      error: () => {
        this.messages.add({
          severity: 'error',
          summary: 'Action failed',
          detail: 'Could not start summary',
        });
      },
    });
  }

  goBack() {
    this.router.navigate(['/meetings']);
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
