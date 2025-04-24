# Sewing Pattern Generator

This app generates printable PDF 2D clothing patterns for garment construction from body measurements. It includes customer registration, body measurement collection, and pattern generation features.

## Features

- Customer registration and management
- Body measurement collection and storage
- Pattern selection and generation
- Printable PDF pattern downloads
- Database for storing customer and measurement data

## Architecture

This project follows a contract-based modular architecture, which provides the benefits of microservices (isolation, clear boundaries) while keeping everything in a single codebase for simplified deployment.

### Core Principles

1. **Module Autonomy**: Each module encapsulates a specific domain or feature set
2. **Explicit Contracts**: Modules interact only through well-defined interfaces
3. **Runtime Validation**: Data crossing module boundaries is validated at runtime
4. **Event-Based Communication**: Modules can communicate indirectly via events
5. **Encapsulated State**: State management is isolated within module boundaries

## Getting Started

### Prerequisites

- Node.js
- CockroachDB database

### Installation

1. Clone the repository
2. Install dependencies with `npm install`
3. Set up environment variables in a `.env` file
4. Run development server with `npm run dev`

## Usage

1. Register a customer with their basic information
2. Enter body measurements for the customer
3. Select a pattern type to generate
4. Download the printable PDF pattern

## Database Schema

- **customers**: Stores customer information
- **measurements**: Stores body measurements for customers
- **patterns**: Catalog of available pattern types
- **pattern_generations**: Records of generated patterns

## Available Scripts

- `npm run dev` - Run the app in development mode
- `npm run build` - Build the app for production
- `npm run serve` - Serve the production build locally
- `npm start` - Start the app in development mode (with a host)