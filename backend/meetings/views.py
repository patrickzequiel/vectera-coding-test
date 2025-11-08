import logging
from django.db.models import Count
from rest_framework import status, viewsets
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.shortcuts import get_object_or_404

from .models import Meeting, Note, Summary
from .serializers import MeetingSerializer, NoteSerializer, SummarySerializer
from .services import ai

log = logging.getLogger(__name__)

@api_view(["GET"])
def health(request):
    return Response({"status": "ok"}, status=status.HTTP_200_OK)

class MeetingViewSet(viewsets.ModelViewSet):
    """
    TODO: Implement:
    - list with pagination (newest first)
    - retrieve (include latest summary if any)
    - create
    """
    queryset = Meeting.objects.all().annotate(note_count=Count("notes"))
    serializer_class = MeetingSerializer

    @action(detail=True, methods=["get", "post"], url_path="notes")
    def notes(self, request, pk=None):
        """
        GET: list notes for a meeting (paginated, oldest to newest)
        POST: create a note for this meeting
        """
        meeting = get_object_or_404(Meeting, pk=pk)

        if request.method.lower() == "post":
            serializer = NoteSerializer(data=request.data)
            serializer.is_valid(raise_exception=True)
            note = Note.objects.create(meeting=meeting, **serializer.validated_data)
            return Response(NoteSerializer(note).data, status=status.HTTP_201_CREATED)

        qs = meeting.notes.order_by("created_at")
        paginator = PageNumberPagination()
        page = paginator.paginate_queryset(qs, request)
        serializer = NoteSerializer(page if page is not None else qs, many=True)
        if page is not None:
            return paginator.get_paginated_response(serializer.data)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=True, methods=["post"], url_path="summarize")
    def summarize(self, request, pk=None):
        """
        TODO:
        - Create or update a Summary with status 'pending'
        - Simulate async job: concatenate notes, call services.ai.summarize, then set 'ready'/'failed'
        - Log meeting_id and note_count
        - Return 202 Accepted
        """
        meeting = get_object_or_404(Meeting, pk=pk)
        note_qs = meeting.notes.order_by("created_at").values_list("text", flat=True)
        text = "\n".join(note_qs)

        summary, created = Summary.objects.get_or_create(meeting=meeting)
        summary.status = Summary.PENDING
        summary.content = ""
        summary.save(update_fields=["status", "content", "updated_at"])
        log.info("summarize_requested", extra={"meeting_id": meeting.id, "note_count": note_qs.count()})

        try:
            output = ai.summarize(text)
            summary.content = output
            summary.status = Summary.READY
            summary.save(update_fields=["content", "status", "updated_at"])
        except Exception:
            log.exception("summarize_failed", extra={"meeting_id": meeting.id})
            summary.status = Summary.FAILED
            summary.save(update_fields=["status", "updated_at"])

        return Response({"status": summary.status}, status=status.HTTP_202_ACCEPTED)
    @action(detail=True, methods=["get"], url_path="summary")
    def get_summary(self, request, pk=None):
        """
        TODO: Return the summary or 404 if none.
        """
        meeting = get_object_or_404(Meeting, pk=pk)
        summary = getattr(meeting, "summary", None)
        if not summary:
            return Response({"detail": "Not found."}, status=status.HTTP_404_NOT_FOUND)
        return Response(SummarySerializer(summary).data, status=status.HTTP_200_OK)
