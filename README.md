# 🎥 Video Transcoding and Compression as a Service
## 🚀 Project Overview

This project delivers a **Video Transcoding and Compression as a Service** platform designed for video streaming companies.  
Our system efficiently processes raw video files uploaded by clients, transcoding them into multiple device-compatible formats and compressing them to optimize storage and streaming performance — all handled seamlessly in the cloud.

---

## 🏗️ Architecture & Components

The solution follows a **event driven microservices architecture** composed of four specialized services:

| Service           | Responsibility                                               |
|-------------------|--------------------------------------------------------------|
| **upload-service** | Handles client video uploads and temporary file storage      |
| **process-service**| Manages transcoding and compression pipelines                 |
| **metadata-service** | Stores video metadata and tracks processing status           |
| **auth-service**   | Secures the system with authentication and authorization     |

Services communicate asynchronously via **RabbitMQ**, while video files are stored on **Backblaze B2**, ensuring scalability and reliability.

---

## ⚙️ Technology Stack

- **Backend:** Node.js & Express.js  
- **Messaging:** RabbitMQ for async service communication  
- **Storage:** Backblaze B2 cloud storage  
- **Containerization:** Docker & Docker Compose  
- **API Gateway:** Traefik 
- **Security:** JWT-based authentication & authorization  
- **Architecture:** RESTful APIs with event driven microservices

---

## 📊 Architecture Diagram

![Architecture Diagram](./images/architecture-diagram.png)

*The diagram illustrates the flow between clients, API Gateway, microservices, RabbitMQ messaging, and cloud storage.*

---

## ⚡ Key Features

- Multi-format video transcoding & compression tailored for device compatibility  
- Decoupled, scalable microservices architecture  
- Secure, centralized authentication and service authorization  
- Asynchronous processing with RabbitMQ to improve throughput  
- Cloud-native video storage with Backblaze B2  
- API Gateway routing and middleware management with Traefik  

---

## Next Steps
- Implement CI/CD pipelines for automated testing, building, and deployment.
- Deploy to Microsoft Azure using Azure Container Instances.
- Enhance monitoring and logging with centralized tools.

