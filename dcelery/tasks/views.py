from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from tasks.sample_tasks import create_task
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from celery.result import AsyncResult


def home(request):
    return render(request, "tasks/home.html")


@csrf_exempt
@api_view(http_method_names=["POST"])
def run_task(request):
    if request.method == "POST":
        task_type = request.data["type"]
        task = create_task.delay(int(task_type))
        return Response({"task_type": task.id}, status=status.HTTP_202_ACCEPTED)


@csrf_exempt
@api_view(http_method_names=["GET"])
def get_status(request, task_id):
    task_result = AsyncResult(task_id)
    result = {
        "task_id": task_id,
        "task_status": task_result.status,
        "task_result": task_result.result
    }
    return Response(result, status=status.HTTP_200_OK)