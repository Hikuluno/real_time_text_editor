from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Document
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
from django.db import transaction
import json
import ast


class PracticeConsumer(AsyncWebsocketConsumer):
    connected_clients = set()

    async def connect(self):
        self.document_id = None
        await self.accept()
        await self.send(text_data=json.dumps({'message': 'Connected'}))
        PracticeConsumer.connected_clients.add(self)

    async def disconnect(self, close_code):
        PracticeConsumer.connected_clients.remove(self)
        if self.document_id:
            await self.send_updates({"type": "disconnect"})
            self.document_id = None

    async def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)
        type = data["type"]
        message = data["message"]

        if type == "update_message":
            await self.send_updates(message)
        elif type == "typing_notification":
            await self.send_typing_notification(message)
        elif type == "handle_documentId":
            await self.handle_document_id(message)
        elif type == "save_document":
            await self.save_document(message)

    async def send_updates(self, message):
        if self.document_id:
            for client in PracticeConsumer.connected_clients:
                if client != self and client.document_id == self.document_id:
                    await client.send(text_data=json.dumps({'type': 'update_message', 'message': message}))

    async def send_typing_notification(self, message):
        if self.document_id:
            for client in PracticeConsumer.connected_clients:
                if client != self and client.document_id == self.document_id:
                    await client.send(text_data=json.dumps({'type': 'typing_notification', 'message': message}))

    async def handle_document_id(self, document_id):
        if self.document_id:
            await self.send_updates({"type": "disconnect"})

        self.document_id = document_id
        # Fetch document content from the database
        try:
            document = await database_sync_to_async(Document.objects.get)(documentId=document_id)
            document_content = ast.literal_eval(document.document_content)
            await self.send(text_data=json.dumps({'type': 'handle_documentId', 'message': document_content}))
        # Create the document in the database
        except Document.DoesNotExist:
            await database_sync_to_async(Document.objects.create)(
                documentId=self.document_id, document_content="")
            await self.send(text_data=json.dumps({'type': 'handle_documentId', 'message': ""}))

        # Send document content to the consumer
        await self.send_updates({"type": "connect"})

    async def save_document(self, document_content):
        if self.document_id:
            try:
                # Get document
                document = await database_sync_to_async(Document.objects.get)(
                    documentId=self.document_id)
                # Update document
                document.document_content = document_content
                # Save modifications to the document
                await sync_to_async(document.save)()
            except Document.DoesNotExist:
                # If the document doesn't exist, create it
                await database_sync_to_async(Document.objects.create)(
                    documentId=self.document_id, document_content=document_content)
            await self.send(text_data=json.dumps({'type': 'saved', 'message': ""}))
