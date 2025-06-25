import { NextResponse } from 'next/server';

// Mock data - replace with actual data source
const mockUnavailablePorts = [
  { port: 80, service: "HTTP", description: "Web server" },
  { port: 443, service: "HTTPS", description: "Secure web server" },
  { port: 22, service: "SSH", description: "Secure Shell" },
  { port: 3306, service: "MySQL", description: "Database server" },
  { port: 5432, service: "PostgreSQL", description: "Database server" },
  { port: 6379, service: "Redis", description: "Cache server" },
  { port: 3000, service: "Node.js", description: "Development server" },
  { port: 8080, service: "Tomcat", description: "Application server" },
  { port: 9000, service: "PHP-FPM", description: "FastCGI Process Manager" },
  { port: 25, service: "SMTP", description: "Mail server" }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // In a real application, you would:
    // 1. Connect to your database or external API
    // 2. Query for unavailable ports from your nginx configuration
    // 3. Check system processes for port usage
    // 4. Return the actual data
    
    return NextResponse.json({
      success: true,
      data: mockUnavailablePorts,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching unavailable ports:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch unavailable ports',
        message: error.message 
      },
      { status: 500 }
    );
  }
}

// POST endpoint for adding new port configurations
export async function POST(request) {
  try {
    const { subdomain, port } = await request.json();
    
    // Validate input
    if (!subdomain || !port) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Missing required fields',
          message: 'Both subdomain and port are required' 
        },
        { status: 400 }
      );
    }
    
    // Check if port is in valid range
    const portNumber = parseInt(port);
    if (portNumber < 1 || portNumber > 65535) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid port number',
          message: 'Port must be between 1 and 65535' 
        },
        { status: 400 }
      );
    }
    
    // Check if port is already in use
    const isPortUnavailable = mockUnavailablePorts.some(p => p.port === portNumber);
    if (isPortUnavailable) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Port already in use',
          message: `Port ${portNumber} is already unavailable` 
        },
        { status: 409 }
      );
    }
    
    // In a real application, you would:
    // 1. Generate nginx configuration
    // 2. Test the configuration
    // 3. Reload nginx
    // 4. Update your database
    
    console.log('Creating nginx configuration for:', { subdomain, port: portNumber });
    
    return NextResponse.json({
      success: true,
      message: 'Nginx configuration created successfully',
      data: {
        subdomain,
        port: portNumber,
        configPath: `/etc/nginx/sites-available/${subdomain}`,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    console.error('Error creating nginx configuration:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create configuration',
        message: error.message 
      },
      { status: 500 }
    );
  }
}
