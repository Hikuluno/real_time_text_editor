# Generated by Django 4.2.2 on 2023-06-26 16:30

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Document',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('documentId', models.CharField(max_length=100)),
                ('document_content', models.TextField()),
            ],
        ),
    ]