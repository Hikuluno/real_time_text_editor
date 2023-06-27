# Real-Time Text Collaborative Editing

This project is a mini-demo that allows several users to collaborate in real time on editing the same text document. This means that several people can work simultaneously on the same document, view other users' changes in real time and edit the content collaboratively. This application also manages the editing of different documents, with a link representing one instance of a document.

This is a frontend built on top of **Next.js** using **TailwindCSS** and **DaisyUI** combined with a backend in **Django**

## Getting Started

First, run the frontend client:

```bash
cd kmp_front
npm run dev
```

Then, run the backend sever:

```bash
cd kmp_back
python ./manage.py runserver
```

Open two instances of [http://localhost:3000](http://localhost:3000) with your browser to see the result.
