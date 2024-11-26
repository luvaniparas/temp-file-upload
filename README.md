Below is a sample `README.md` file that outlines the project, its specifications, setup instructions, API endpoints, and other relevant information:

---

# Expiring Temporary Resource Sharing Module

## Objective

This backend module manages temporary resource sharing, where users can share resources (such as files, documents, or links) with others for a limited time. After the expiration time is reached, the resources automatically become inaccessible.

---

## Key Features

- **Create Temporary Resources**: Allows users to upload or register a resource with an expiration time.
- **Access Control**: Provides secure access links to resources with validation.
- **Auto-Expiry**: Expired resources are flagged and no longer accessible.
- **Query Resources**: Allows fetching of resources by their status (active/expired).
- **Secure Resource Access**: Resources can be accessed through unique tokens.

---

## Tech Stack

- **Backend**: Node.js with Express
- **Database**: PostgreSQL or MySQL
- **Scheduling**: Cron jobs for auto-expiration logic
- **Authentication**: JSON Web Tokens (JWT)
- **ORM**: Prisma ORM (for database interaction)

---

## Database Schema

**Users**

- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String)
- `created_at` (Timestamp)
- `updated_at` (Timestamp)

**Resources**

- `id` (UUID, Primary Key)
- `name` (String)
- `url` (String)
- `type` (String, e.g., file, video, etc.)
- `size` (Integer)
- `expiration` (Integer)
- `status` (String, default: 'active')
- `created_by_id` (UUID, Foreign Key to Users)
- `created_at` (Timestamp)

**Shared Links**

- `id` (UUID, Primary Key)
- `resource_id` (UUID, Foreign Key to Resources)
- `shared_by_id` (UUID, Foreign Key to Users)
- `expires_at` (Timestamp)
- `created_at` (Timestamp)

---

## API Endpoints

### POST `/resources`

**Description**: Create a new resource with a specified expiration time.

**Request Body**:

```json
{
  "name": "File 1",
  "url": "https://example.com/resources/project-document.pdf",
  "type": "file",
  "size": 1024,
  "expiration_time": 5 // Expiration time in hours
}
```

**Response**:

- `201 Created` on success.
- `400 Bad Request` on invalid data.
- `401 Unauthorized` on missing or invalid authentication token
- `403 Forbidden` on necessary permissions
- `409 Conflict` already exists
- `500 Internal Server Error` on server-side error

### GET `/resources`

**Description**: Fetch all resources for the logged-in user. Optionally filter by status (`active`, `expired`).

**Query Parameters**:

- `status` (optional): `active` or `expired`.

**Response**:

```json
[
  {
    "id": "7d41dd98-afa7-47d7-a73d-4c6ff1d780a1",
    "name": "Sample Resource 1",
    "url": "https://example.com/resources/project-document.pdf",
    "type": "file",
    "size": 1024,
    "expiration": 1,
    "status": "active",
    "createdAt": "2024-11-26T14:43:10.202Z",
    "createdById": "bc83b459-c098-48eb-a23b-077449f1ccfe"
  },
  {
    "id": "8fccbc0b-3175-40df-bec1-69e2ad93d450",
    "name": "Sample Resource 1",
    "url": "https://example.com/resources/project-document.pdf",
    "type": "file",
    "size": 1024,
    "expiration": 1,
    "status": "active",
    "createdAt": "2024-11-26T14:56:38.606Z",
    "createdById": "bc83b459-c098-48eb-a23b-077449f1ccfe"
  }
]
```

### GET `/resources/:id`

**Description**: Fetch a specific resource by ID. The resource must be active to access.

```json
{
  "id": "7d41dd98-afa7-47d7-a73d-4c6ff1d780a1",
  "name": "Sample Resource 1",
  "url": "https://example.com/resources/project-document.pdf",
  "type": "file",
  "size": 1024,
  "expiration": 1,
  "status": "active",
  "createdAt": "2024-11-26T14:43:10.202Z",
  "createdById": "bc83b459-c098-48eb-a23b-077449f1ccfe"
}
```

**Response**:

- `200 OK` if the resource is active.
- `404 Not Found` if the resource is expired or doesn't exist.

### DELETE `/resources/:id`

**Description**: Delete a resource by ID. Only the owner of the resource can delete it.

**Response**:

- `204 No Content` on successful deletion.
- `403 Forbidden` if the user is not the owner.
- `404 Not Found` if the resource does not exist.

---

## Expiry Logic

The module uses a cron job to periodically check for expired resources (share links and associated resources). If the `expires_at` field of a `sharedLink` has passed, the status of the associated resource is updated to `"expired"`. The cron job runs every minute.

### Cron Job:

The cron job checks every minute for expired share links and updates the status of the associated resources:

```javascript
cron.schedule("*/1 * * * *", async () => {
  const expiredShareLinks = await prisma.sharedLink.findMany({
    where: { expiresAt: { lte: dayjs().toDate() } },
    include: { resource: true },
  });

  if (expiredShareLinks.length > 0) {
    const updatePromises = expiredShareLinks.map((link) => {
      return prisma.resource.update({
        where: { id: link.resource.id },
        data: { status: "expired" },
      });
    });

    await Promise.all(updatePromises);
  }
});
```

---

## Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/luvaniparas/temp-file-upload.git
   cd temp-file-upload
   ```

2. **Install Dependencies**

   ```bash
   npm install
   ```

3. **Setup Database**

   - Create a `.env` file with your database credentials:

   ```plaintext
   DATABASE_URL="postgresql://postgres:postgres@localhost:5432/tempFileUpload?schema=public"
   PORT=3000
   JWT_SECRET="9f86d081884c7d659a2feaa0c55ad023"
   ```

   - Run database migrations using Prisma:

   ```bash
   npx prisma migrate dev
   ```

4. **Start the Server**

   ```bash
   npm start
   ```

5. **Cron Job**
   The cron job is automatically scheduled when the application starts and runs every minute to check for expired resources.

---

## Example API Requests

### 1. Create a New Resource (POST `/resources`)

Using **Postman** or **curl**:

```bash
curl -X POST http://localhost:3000/api/v1/resources \
  -H "Content-Type: application/json" \
  -d '{
        "name": "Sample File",
        "type": "file",
        "size": 2048,
        "expiration_time": 2
      }'
```

### 2. Fetch Resources (GET `/resources`)

```bash
curl http://localhost:3000/api/v1/resources?status=active
```

### 3. Access a Specific Resource (GET `/resources/:id`)

```bash
curl http://localhost:3000/api/v1/resources/your-resource-id
```

### 4. Delete a Resource (DELETE `/resources/:id`)

```bash
curl -X DELETE http://localhost:3000/api/v1/resources/your-resource-id
```

---

## Error Handling

- **404 Not Found**: When accessing a resource that no longer exists or is expired.
- **400 Bad Request**: When invalid data is provided (e.g., missing or incorrect fields).
- **403 Forbidden**: When trying to delete a resource that isn't owned by the logged-in user.
- **500 Internal Server Error**: For unexpected server-side errors.

---

## Evaluation Criteria

1. **API Design**: RESTful, clean, and secure.
2. **Data Handling**: Efficient handling of expiration and access control.
3. **Scalability**: Proper use of scheduling/queue systems for high performance.
4. **Security**: Secure resource sharing via tokens and access control.
5. **Documentation**: Clear instructions, API usage, and example requests.

---

## License

MIT License. See [LICENSE](LICENSE) for more details.

---

This `README.md` file provides clear instructions for setting up the module, using the API, and understanding the system’s behavior. You can further customize it as needed based on your exact implementation.
