# Nginx UI Manager

A modern, professional web interface for managing Nginx reverse proxy configurations.

## Features

- **Professional UI**: Clean, modern design with responsive layout
- **Sidebar Navigation**: Displays unavailable ports with service information
- **Form Validation**: Client-side and server-side validation for subdomain and port inputs
- **API Integration**: RESTful API endpoints for managing nginx configurations
- **Real-time Updates**: Dynamic updates of unavailable ports list
- **Error Handling**: Comprehensive error handling with user-friendly messages

## API Endpoints

### GET /api/unavailable-ports

Retrieves the list of ports currently in use.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "port": 80,
      "service": "HTTP",
      "description": "Web server"
    }
  ],
  "timestamp": "2025-06-25T10:30:00.000Z"
}
```

### POST /api/unavailable-ports

Creates a new nginx configuration for the specified subdomain and port.

**Request Body:**
```json
{
  "subdomain": "api",
  "port": 3000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Nginx configuration created successfully",
  "data": {
    "subdomain": "api",
    "port": 3000,
    "configPath": "/etc/nginx/sites-available/api",
    "timestamp": "2025-06-25T10:30:00.000Z"
  }
}
```

## Architecture

### Frontend Components

- **Main Page** (`src/app/page.js`): React component with form handling and state management
- **Styles** (`src/app/page.module.css`): CSS modules with responsive design and dark mode support

### Backend API

- **API Routes** (`src/app/api/unavailable-ports/route.js`): Next.js API routes for handling requests

## Extending the Application

### Adding Real Data Sources

To connect to real data sources, modify the API route:

```javascript
// In src/app/api/unavailable-ports/route.js

// Example: Connect to a database
import { db } from '@/lib/database';

export async function GET() {
  try {
    const unavailablePorts = await db.query('SELECT * FROM nginx_ports WHERE status = "unavailable"');
    return NextResponse.json({
      success: true,
      data: unavailablePorts
    });
  } catch (error) {
    // Error handling
  }
}
```

### Adding System Integration

For real nginx integration:

1. **Port Checking**: Use system commands to check port availability
2. **Config Generation**: Generate nginx configuration files
3. **Service Management**: Reload nginx service after configuration changes

```javascript
// Example system integration
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function checkPortAvailability(port) {
  try {
    const { stdout } = await execAsync(`netstat -tulpn | grep :${port}`);
    return stdout.trim().length > 0; // Port is in use if output exists
  } catch (error) {
    return false; // Port is available
  }
}
```

### Adding Authentication

To secure the application:

1. Add authentication middleware
2. Implement user sessions
3. Add role-based access control

### Database Integration

Recommended schema for persistence:

```sql
CREATE TABLE nginx_configurations (
  id SERIAL PRIMARY KEY,
  subdomain VARCHAR(255) NOT NULL,
  port INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  config_path VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE unavailable_ports (
  port INTEGER PRIMARY KEY,
  service VARCHAR(255),
  description TEXT,
  is_system_port BOOLEAN DEFAULT FALSE
);
```

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Environment Variables

Create a `.env.local` file for environment-specific configuration:

```env
# Database connection
DATABASE_URL=postgresql://user:password@localhost:5432/nginx_ui

# Nginx configuration paths
NGINX_SITES_AVAILABLE=/etc/nginx/sites-available
NGINX_SITES_ENABLED=/etc/nginx/sites-enabled

# API configuration
API_BASE_URL=http://localhost:3000
```

## Security Considerations

- Validate all inputs server-side
- Sanitize subdomain names to prevent directory traversal
- Implement rate limiting for API endpoints
- Use HTTPS in production
- Validate nginx configurations before applying them
- Implement proper error logging without exposing sensitive information
