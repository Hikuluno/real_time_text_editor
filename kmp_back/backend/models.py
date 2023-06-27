from django.db import models


class Document(models.Model):
    documentId = models.CharField(max_length=100)
    document_content = models.TextField()

    def __str__(self):
        return self.documentId
