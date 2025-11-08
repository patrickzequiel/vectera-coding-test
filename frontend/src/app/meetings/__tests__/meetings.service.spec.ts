import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { MeetingsService } from '../meetings.service';
import { Meeting, Note, Summary } from '../models';

describe('Given the MeetingsService is initialized', () => {
  let service: MeetingsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(MeetingsService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  describe('When listMeetings is called with default page', () => {
    let received: any;
    const payload = { results: [], count: 0, next: null, previous: null };

    beforeEach(() => {
      service.listMeetings().subscribe((res) => (received = res));
    });

    it('Then it calls /api/meetings/?page=1', () => {
      const req = httpMock.expectOne('/api/meetings/?page=1');
      expect(req.request.method).toBe('GET');
      req.flush(payload);
    });

    it('Then it returns the response body', () => {
      const req = httpMock.expectOne('/api/meetings/?page=1');
      req.flush(payload);
      expect(received).toEqual(payload);
    });
  });

  describe('When listMeetings is called with page=3', () => {
    let received: any;
    const payload = { results: [{ id: 1 }], count: 10 } as any;

    beforeEach(() => {
      service.listMeetings(3).subscribe((res) => (received = res));
    });

    it('Then it calls /api/meetings/?page=3', () => {
      const req = httpMock.expectOne('/api/meetings/?page=3');
      expect(req.request.method).toBe('GET');
      req.flush(payload);
    });

    it('Then it returns the response body', () => {
      const req = httpMock.expectOne('/api/meetings/?page=3');
      req.flush(payload);
      expect(received).toEqual(payload);
    });
  });

  describe('When getMeeting is called with id=42', () => {
    let received: Meeting | undefined;
    const meeting: Meeting = {
      id: 42,
      title: 'Weekly Sync',
      started_at: '2024-01-01T10:00:00Z',
      created_at: '2024-01-01T09:50:00Z',
      note_count: 0,
      latest_summary: null,
    };

    beforeEach(() => {
      service.getMeeting(42).subscribe((res) => (received = res));
    });

    it('Then it calls /api/meetings/42/', () => {
      const req = httpMock.expectOne('/api/meetings/42/');
      expect(req.request.method).toBe('GET');
      req.flush(meeting);
    });

    it('Then it returns the meeting', () => {
      const req = httpMock.expectOne('/api/meetings/42/');
      req.flush(meeting);
      expect(received).toEqual(meeting);
    });
  });

  describe('When addNote is called', () => {
    let received: Note | undefined;
    const payload = { author: 'Ada', text: 'Hello' };
    const note: Note = {
      id: 7,
      author: 'Ada',
      text: 'Hello',
      created_at: '2024-01-01T11:00:00Z',
    };

    beforeEach(() => {
      service.addNote(42, payload).subscribe((res) => (received = res));
    });

    it('Then it posts to /api/meetings/42/notes/', () => {
      const req = httpMock.expectOne('/api/meetings/42/notes/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(note);
    });

    it('Then it returns the created note', () => {
      const req = httpMock.expectOne('/api/meetings/42/notes/');
      req.flush(note);
      expect(received).toEqual(note);
    });
  });

  describe('When listNotes is called with default page', () => {
    let received: any;
    const payload = { results: [], count: 0 } as any;

    beforeEach(() => {
      service.listNotes(42).subscribe((res) => (received = res));
    });

    it('Then it calls /api/meetings/42/notes/?page=1', () => {
      const req = httpMock.expectOne('/api/meetings/42/notes/?page=1');
      expect(req.request.method).toBe('GET');
      req.flush(payload);
    });

    it('Then it returns the response body', () => {
      const req = httpMock.expectOne('/api/meetings/42/notes/?page=1');
      req.flush(payload);
      expect(received).toEqual(payload);
    });
  });

  describe('When listNotes is called with page=5', () => {
    let received: any;
    const payload = { results: [{ id: 5 }], count: 3 } as any;

    beforeEach(() => {
      service.listNotes(42, 5).subscribe((res) => (received = res));
    });

    it('Then it calls /api/meetings/42/notes/?page=5', () => {
      const req = httpMock.expectOne('/api/meetings/42/notes/?page=5');
      expect(req.request.method).toBe('GET');
      req.flush(payload);
    });

    it('Then it returns the response body', () => {
      const req = httpMock.expectOne('/api/meetings/42/notes/?page=5');
      req.flush(payload);
      expect(received).toEqual(payload);
    });
  });

  describe('When summarize is called', () => {
    let received: any;
    const payload = { status: 'pending' } as any;

    beforeEach(() => {
      service.summarize(42).subscribe((res) => (received = res));
    });

    it('Then it posts to /api/meetings/42/summarize/', () => {
      const req = httpMock.expectOne('/api/meetings/42/summarize/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({});
      req.flush(payload);
    });

    it('Then it returns the response body', () => {
      const req = httpMock.expectOne('/api/meetings/42/summarize/');
      req.flush(payload);
      expect(received).toEqual(payload);
    });
  });

  describe('When getSummary is called', () => {
    let received: Summary | undefined;
    const summary: Summary = {
      id: 3,
      content: 'Summary text',
      status: 'ready',
      created_at: '2024-01-01T12:00:00Z',
      updated_at: '2024-01-01T12:30:00Z',
    };

    beforeEach(() => {
      service.getSummary(42).subscribe((res) => (received = res));
    });

    it('Then it calls /api/meetings/42/summary/', () => {
      const req = httpMock.expectOne('/api/meetings/42/summary/');
      expect(req.request.method).toBe('GET');
      req.flush(summary);
    });

    it('Then it returns the summary', () => {
      const req = httpMock.expectOne('/api/meetings/42/summary/');
      req.flush(summary);
      expect(received).toEqual(summary);
    });
  });

  describe('When createMeeting is called', () => {
    let received: Meeting | undefined;
    const payload = { title: 'Kickoff', started_at: '2024-02-01T09:00:00Z' };
    const meeting: Meeting = {
      id: 9,
      title: 'Kickoff',
      started_at: '2024-02-01T09:00:00Z',
      created_at: '2024-02-01T08:50:00Z',
      note_count: 0,
      latest_summary: null,
    };

    beforeEach(() => {
      service.createMeeting(payload).subscribe((res) => (received = res));
    });

    it('Then it posts to /api/meetings/', () => {
      const req = httpMock.expectOne('/api/meetings/');
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(meeting);
    });

    it('Then it returns the created meeting', () => {
      const req = httpMock.expectOne('/api/meetings/');
      req.flush(meeting);
      expect(received).toEqual(meeting);
    });
  });
});
