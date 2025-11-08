import pytest
from django.utils import timezone
from django.urls import reverse
from rest_framework.test import APIClient


@pytest.mark.django_db
def test_create_and_list_meetings():
    client = APIClient()
    url = reverse("meeting-list")
    started_at = timezone.now().isoformat()
    res = client.post(url, {"title": "Kickoff", "started_at": started_at}, format="json")
    assert res.status_code == 201

    res = client.get(url)
    assert res.status_code == 200
    data = res.json()
    results = data.get("results", data)
    assert len(results) >= 1
    m = results[0]
    assert m["title"] == "Kickoff"
    assert "note_count" in m
    assert m["note_count"] == 0


@pytest.mark.django_db
def test_add_and_list_notes():
    client = APIClient()
    m_url = reverse("meeting-list")
    started_at = timezone.now().isoformat()
    m_res = client.post(m_url, {"title": "Daily", "started_at": started_at}, format="json")
    meeting_id = m_res.json()["id"]

    notes_url = reverse("meeting-notes", args=[meeting_id])
    res = client.post(notes_url, {"author": "A", "text": "First"}, format="json")
    assert res.status_code == 201
    res = client.post(notes_url, {"author": "B", "text": "Second"}, format="json")
    assert res.status_code == 201

    res = client.get(notes_url)
    assert res.status_code == 200
    data = res.json()
    items = data.get("results", data)
    assert [n["text"] for n in items] == ["First", "Second"]


@pytest.mark.django_db
def test_add_note_validation_errors():
    client = APIClient()
    m_url = reverse("meeting-list")
    started_at = timezone.now().isoformat()
    m_res = client.post(m_url, {"title": "Weekly", "started_at": started_at}, format="json")
    meeting_id = m_res.json()["id"]
    notes_url = reverse("meeting-notes", args=[meeting_id])

    res = client.post(notes_url, {"author": "", "text": ""}, format="json")
    assert res.status_code == 400


@pytest.mark.django_db
def test_summarize_and_get_summary():
    client = APIClient()
    m_url = reverse("meeting-list")
    started_at = timezone.now().isoformat()
    m_res = client.post(m_url, {"title": "Retro", "started_at": started_at}, format="json")
    meeting_id = m_res.json()["id"]

    notes_url = reverse("meeting-notes", args=[meeting_id])
    client.post(notes_url, {"author": "A", "text": "We shipped"}, format="json")

    summarize_url = reverse("meeting-summarize", args=[meeting_id])
    res = client.post(summarize_url, {}, format="json")
    assert res.status_code == 202

    summary_url = reverse("meeting-summary", args=[meeting_id])
    res = client.get(summary_url)
    assert res.status_code == 200
    body = res.json()
    assert body["status"] in ("ready", "failed")
    if body["status"] == "ready":
        assert "AI-STUB" in body["content"]


@pytest.mark.django_db
def test_get_summary_404_before_generated():
    client = APIClient()
    m_url = reverse("meeting-list")
    started_at = timezone.now().isoformat()
    m_res = client.post(m_url, {"title": "Planning", "started_at": started_at}, format="json")
    meeting_id = m_res.json()["id"]
    summary_url = reverse("meeting-summary", args=[meeting_id])
    res = client.get(summary_url)
    assert res.status_code == 404
