'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export default function SwaggerPage() {
  return (
    <div className="swagger-wrapper">
      <header className="swagger-header">
        <h1>API Documentation</h1>
        <p>User Management API - Complete Reference</p>
      </header>
      <div className="swagger-container">
        <SwaggerUI
          url="/api/docs"
          docExpansion="list"
          defaultModelsExpandDepth={-1}
          filter={true}
          tryItOutEnabled={true}
          displayRequestDuration={true}
          requestSnippetsEnabled={true}
        />
      </div>
      <style jsx global>{`
        .swagger-wrapper {
          min-height: 100vh;
          background: #f8f9fa;
        }

        .swagger-header {
          background: #2d3748;
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .swagger-header h1 {
          margin: 0;
          font-size: 2.5rem;
          font-weight: 600;
        }

        .swagger-header p {
          margin: 0.5rem 0 0;
          opacity: 0.8;
        }

        .swagger-container {
          max-width: 1400px;
          margin: 0 auto;
          padding: 2rem;
          background: white;
          box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }

        /* Swagger UI Customization */
        .swagger-ui {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
        }

        .swagger-ui .opblock {
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.05);
          margin: 0 0 1rem;
        }

        .swagger-ui .opblock .opblock-summary {
          padding: 1rem;
        }

        .swagger-ui .opblock-tag {
          font-size: 1.5rem;
          font-weight: 600;
          padding: 1rem 0;
          border-bottom: 2px solid #edf2f7;
        }

        .swagger-ui .btn {
          border-radius: 4px;
          font-weight: 500;
        }

        .swagger-ui input[type=text], 
        .swagger-ui textarea {
          border-radius: 4px;
          border: 1px solid #e2e8f0;
          padding: 0.5rem;
        }

        .swagger-ui .execute-wrapper {
          padding: 1rem;
          background: #f7fafc;
          border-radius: 4px;
        }

        /* Method colors */
        .swagger-ui .opblock-get {
          background: rgba(97, 175, 254, 0.1);
          border-color: #61affe;
        }

        .swagger-ui .opblock-post {
          background: rgba(73, 204, 144, 0.1);
          border-color: #49cc90;
        }

        .swagger-ui .opblock-put {
          background: rgba(252, 161, 48, 0.1);
          border-color: #fca130;
        }

        .swagger-ui .opblock-delete {
          background: rgba(249, 62, 62, 0.1);
          border-color: #f93e3e;
        }

        /* Response section */
        .swagger-ui .responses-wrapper {
          background: #f8fafc;
          padding: 1rem;
          border-radius: 4px;
        }

        /* Schema section */
        .swagger-ui .model-box {
          background: #f8fafc;
          border-radius: 4px;
          padding: 1rem;
        }

        /* Navigation */
        .swagger-ui .opblock-tag-section {
          margin-bottom: 2rem;
        }

        /* Make it responsive */
        @media (max-width: 768px) {
          .swagger-container {
            padding: 1rem;
          }

          .swagger-header h1 {
            font-size: 2rem;
          }

          .swagger-ui .opblock-tag {
            font-size: 1.2rem;
          }
        }
      `}</style>
    </div>
  );
} 