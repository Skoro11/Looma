# Data Models

This document describes the main data models for the Chat App MVP, including Users, Chats, and Messages, along with their relationships.

---

## 1. User

```json
{
  "id": "ObjectId",
  "username": "toni23",
  "email": "toni@example.com",
  "passwordHash": "$2b$12$hash",
  "avatarUrl": "https://example.com/avatar.png",
  "createdAt": "2025-09-29T12:00:00Z",
  "lastLogin": "2025-09-29T12:05:00Z"
}
```

## 2. Chat

```json
{
  "id": "ObjectId",
  "participants": ["userId1", "userId2"],
  "lastMessageId": "messageId",
  "createdAt": "2025-09-29T12:00:00Z",
  "updatedAt": "2025-09-29T12:01:00Z"
}
```

## 3. Message

```json
{
  "id": "ObjectId",
  "chatId": "chatId",
  "senderId": "userId1",
  "receiverId": "userId2",
  "content": "Hey, how’s it going?",
  "timestamp": "2025-09-29T12:02:00Z",
  "status": "sent"
}
```

flowchart TD
User -->|participates in| Chat
Chat -->|contains| Message
Message -->|sent by| User
