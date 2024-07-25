# integrate-AI-in-health-site-chatbot
integrate AI in health site chatbot

## System Architecture Overview

This document provides an overview of the architecture for our web application, which integrates a chatbot powered by AWS Bedrock.This architecture leverages AWS services to provide a secure, scalable, and efficient environment for deploying a web application with a chatbot. JWT is used for robust user authentication, ensuring that only authorized users can access protected resources.
 ![WEBAPP Workflow](./Assets/jwt.png)
## Components

### 1. Web Application
- **Function**: Serves as the frontend interface for users.
- **Location**: Deployed within Subnet A of the VPC.
- **Security**: Secured with Security Groups (SG) to control inbound and outbound traffic.

### 2. Backend
- **Function**: Manages business logic and processes requests from the Web App and Chatbot.
- **Location**: Deployed within Subnet B of the VPC.
- **Security**: Secured with Security Groups (SG) to control inbound and outbound traffic.

### 3. Chatbot
- **Function**: Provides user interaction and is integrated with AWS Bedrock for AI-driven responses.
- **Location**: Deployed within Subnet A of the VPC.
- **Interaction**: Communicates with AWS Bedrock for processing.

### 4. Database
- **Function**: Stores application data.
- **Location**: Deployed within Subnet B of the VPC.
- **Security**: Secured with Security Groups (SG) to control inbound and outbound traffic.

### 5. AWS Bedrock
- **Function**: Provides AI capabilities to the Chatbot.
- **Interaction**: Receives requests from the Chatbot and sends back processed data.

## User Authentication and JWT Workflow

### Overview
User authentication is handled using JWT. The workflow ensures secure communication and access control between the user, the web application, and the backend services.

### Workflow Steps

1. **Login Request**: The user initiates a login request from the client application (Web App).
2. **JWT Generation**: The backend API verifies the user's credentials and generates a JWT using a secret key.
3. **JWT Return**: The backend API returns the JWT to the client application.
4. **Authenticated Requests**: The client application includes the JWT in the header of subsequent requests to authenticate and access protected resources.

### Detailed Workflow Diagram

1. **User** sends a login request to the **API** via the **Client App**.
2. **API** generates a JWT using a secret key upon successful authentication.
3. **API** returns the JWT to the **Client App**.
4. **Client App** uses the JWT for further requests to access protected endpoints.

![JWT Workflow](./Assets/jwt-workflow-4.png)

## Network Security

- **VPC (Virtual Private Cloud)**: The entire application is deployed within a VPC to ensure isolation and security.
- **Security Groups**: Used to control inbound and outbound traffic to resources within the VPC.
- **Subnets**: The architecture is divided into Subnet A (Web App and Chatbot) and Subnet B (Backend and Database) for better management and security.

## Integration

- **Chatbot and AWS Bedrock**: The chatbot interacts with AWS Bedrock for AI processing, ensuring seamless and intelligent user interactions.
- **Backend and Database**: The backend communicates with the database to store and retrieve data securely.
