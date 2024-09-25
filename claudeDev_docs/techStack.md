# Technology Stack

This document outlines the current technology choices for the Trip Planning App (MVP) and the rationale behind each decision.

## Frontend

- Next.js: Chosen for its server-side rendering capabilities, optimized performance, and ease of use for building React applications.
- Tailwind CSS: A utility-first CSS framework for rapidly building custom user interfaces. It provides low-level utility classes that let you build completely custom designs without ever leaving your HTML.
- Light and Dark Theming: To be implemented using Tailwind CSS and Next.js, providing a better user experience.

## Backend

- Python: Selected for its versatility and compatibility with CrewAI for implementing agent-based functionality.
- CrewAI: To be used for creating and managing agents for various tasks in the trip planning process.
- FastAPI: A modern, fast (high-performance) web framework for building APIs with Python. It's easy to use and provides automatic API documentation.

## Database

- PostgreSQL: A powerful, open-source relational database that works well with Python and can handle complex data relationships.

## Deployment

- Vercel (recommended for frontend): Provides seamless deployment for Next.js applications.
- Heroku or DigitalOcean (recommended for backend): Offers easy deployment for Python applications and PostgreSQL databases.

This tech stack is designed to provide a solid foundation for the MVP while allowing for scalability and feature expansion in the future.
