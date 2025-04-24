# Pattern Generator

An application that generates printable 2D clothing patterns from body measurements.

## Features

- Customer management: Add, edit, and delete customers
- Measurement management: Record and track body measurements for customers
- Pattern selection: Choose from a variety of clothing patterns
- Pattern generation: Generate printable clothing patterns based on measurements
- Download patterns: Download generated patterns as PDFs

## Technical Implementation

- React.js frontend with Tailwind CSS for styling
- API routes using Vercel serverless functions
- Embedded database using LowDB for data storage
- PDF generation for downloadable patterns

## Development

1. Install dependencies:
```
npm install
```

2. Start the development server:
```
npm run dev
```

3. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Database

The application uses an embedded database powered by LowDB. Data is stored in memory during each function invocation.

**Note about persistence**: In a serverless environment like Vercel, the in-memory database is reset between function invocations. For a production application, you would need to implement a persistence layer.

## Build and Deploy

```
npm run build
```

Deploy using Vercel or another platform that supports serverless functions.