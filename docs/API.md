# Looma Documentation

This document describes all REST endpoints and WebSocket events for the Chat App MVP. It includes authentication, user management, chats, messages, and real-time communication.

---

## Table of Contents

1. [Authentication](#authentication)
2. [User Endpoints](#user-endpoints)
3. [Chat Endpoints](#chat-endpoints)
4. [WebSocket Events](#websocket-events)

---

## Authentication

### Register User

        POST /api/auth/register

**Request Body**

```json
{
  "username": "toni23",
  "email": "toni@example.com",
  "password": "strongpassword"
}
```

**Response**

```json
{
  "userId": "user1",
  "username": "toni23",
  "email": "toni@example.com",
  "token": "JWT_TOKEN"
}
```

## Login user

        POST /api/auth/login

**Request Body**

```json
{
  "email": "toni@example.com",
  "password": "strongpassword"
}
```

**Response**

```json
{
  "userId": "user1",
  "username": "toni23",
  "token": "JWT_TOKEN"
}
```

## User Endpoints

## Get current User

        GET /api/users/me

Headers
Authorization: Bearer JWT_TOKEN

**Response**

```json
{
  "id": "user1",
  "username": "toni23",
  "email": "toni@example.com",
  "avatarUrl": "https://example.com/avatar.png"
}
```

## Get All Users (for contacts)

        GET /api/users

Headers
Authorization: Bearer JWT_TOKEN

**Response**

```json
[
  { "id": "user2", "username": "maria88", "avatarUrl": "..." },
  { "id": "user3", "username": "alex99", "avatarUrl": "..." }
]
```

## Chat Endpoints

## Get All Chats

        GET /api/chats

Headers
Authorization: Bearer JWT_TOKEN

**Response**

```json
[
  {
    "id": "chat1",
    "participants": ["user1", "user2"],
    "lastMessageId": "msg2",
    "updatedAt": "2025-09-29T12:10:00Z"
  }
]
```

## Get Messages for a Chat

        GET /api/chats/:chatId/messages

Headers
Authorization: Bearer JWT_TOKEN

**Response**

```json
[
  {
    "id": "msg1",
    "chatId": "chat1",
    "senderId": "user1",
    "receiverId": "user2",
    "content": "Hey, how’s it going?",
    "timestamp": "2025-09-29T12:02:00Z",
    "status": "sent"
  },
  {
    "id": "msg2",
    "chatId": "chat1",
    "senderId": "user2",
    "receiverId": "user1",
    "content": "All good! You?",
    "timestamp": "2025-09-29T12:03:00Z",
    "status": "delivered"
  }
]
```
