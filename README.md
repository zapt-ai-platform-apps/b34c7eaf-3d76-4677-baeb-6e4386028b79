# ReactJS Starter - Contract-Based Modular Architecture

This is a ReactJS starter template using a contract-based modular architecture.

## Architecture

This project follows a contract-based modular architecture, which provides the benefits of microservices (isolation, clear boundaries) while keeping everything in a single codebase for simplified deployment.

### Core Principles

1. **Module Autonomy**: Each module encapsulates a specific domain or feature set
2. **Explicit Contracts**: Modules interact only through well-defined interfaces
3. **Runtime Validation**: Data crossing module boundaries is validated at runtime
4. **Event-Based Communication**: Modules can communicate indirectly via events
5. **Encapsulated State**: State management is isolated within module boundaries

### Folder Structure

```
src/
├── modules/           # Feature modules
│   ├── core/          # Core module infrastructure
│   ├── app/           # Main app module
│   │   ├── api.js     # Public contract
│   │   ├── events.js  # Event definitions
│   │   ├── validators.js # Contract validation
│   │   ├── internal/  # Private implementation
│   │   └── ui/        # UI components
│   └── index.js       # Module exports and initialization
├── app/               # Application shell
│   ├── App.jsx        # Main App component wrapper
│   └── AppProviders.jsx # Providers composition
├── styles/            # Global styles
├── shared/            # Cross-cutting utilities and components
└── index.jsx          # Entry point
```

## Available Scripts

- `npm run dev` - Run the app in development mode
- `npm run build` - Build the app for production
- `npm run serve` - Serve the production build locally
- `npm start` - Start the app in development mode (with a host)