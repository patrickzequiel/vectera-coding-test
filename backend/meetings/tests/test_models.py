import pytest
from django.utils import timezone

from meetings.models import Meeting, Note, Summary


@pytest.mark.django_db
def test_meeting_ordering_newest_first():
    m1 = Meeting.objects.create(title="Old", started_at=timezone.now() - timezone.timedelta(days=1))
    m2 = Meeting.objects.create(title="New", started_at=timezone.now())
    titles = list(Meeting.objects.values_list("title", flat=True))
    assert titles == ["New", "Old"]


@pytest.mark.django_db
def test_note_ordering_oldest_to_newest():
    m = Meeting.objects.create(title="Any", started_at=timezone.now())
    n1 = Note.objects.create(meeting=m, author="A", text="First")
    n2 = Note.objects.create(meeting=m, author="B", text="Second")
    texts = list(m.notes.values_list("text", flat=True))
    assert texts == ["First", "Second"]


@pytest.mark.django_db
def test_summary_one_per_meeting():
    m = Meeting.objects.create(title="Any", started_at=timezone.now())
    Summary.objects.create(meeting=m, content="x", status=Summary.READY)
    with pytest.raises(Exception):
        Summary.objects.create(meeting=m, content="y", status=Summary.READY)
