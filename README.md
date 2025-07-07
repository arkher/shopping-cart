# Shopping Cart with Promotions API

A robust shopping cart system built with Next.js, featuring promotional campaigns and differentiated pricing based on user types. The system automatically calculates and suggests the best pricing option for customers.

## 🎯 Features

### Promotions
1. **Get 3 for the Price of 2**: 
   - Buy 3 items, get the cheapest one for free
   - Applies to all customer types
   - The free item is always the lowest-priced one

2. **VIP Discount (15%)**:
   - Exclusive 15% discount for VIP customers
   - Cannot be combined with "Get 3 for 2" promotion
   - System automatically chooses the best deal

### Automatic Price Calculation
- The API automatically calculates and suggests the best pricing option
- Compares all available promotions and selects the one with the lowest final price
- Provides detailed breakdown of savings and recommendations

### Cart Persistence
- Cart data persists across page reloads using localStorage
- Hybrid repository pattern: memory storage on server + localStorage on client
- Automatic cart loading when the application starts

### Responsive Design
- Fully responsive interface that works on desktop, tablet, and mobile devices
- Grid layout adapts from 2 columns on desktop to 1 column on mobile
- Touch-friendly buttons and interactive elements

## 🏗️ Architecture

This project follows **Clean Architecture** principles with a clear separation of concerns:

```
src/
├── domain/                    # Business logic and entities (pure)
│   ├── entities/             # Core business entities
│   │   ├── Product.ts        # Product entity
│   │   ├── Cart.ts           # Shopping cart entity
│   │   ├── CartItem.ts       # Cart item entity
│   │   ├── Customer.ts       # Customer entity (VIP/Common)
│   │   └── __tests__/        # Entity tests
│   │       ├── Product.test.ts
│   │       ├── Cart.test.ts
│   │       ├── CartItem.test.ts
│   │       └── Customer.test.ts
│   ├── value-objects/        # Value objects
│   │   ├── PricingResult.ts  # Pricing calculation result
│   │   └── __tests__/        # Value object tests
│   │       └── PricingResult.test.ts
│   ├── services/             # Domain service interfaces
│   │   ├── PricingStrategy.ts        # Strategy pattern interface
│   │   └── PricingService.ts         # Service interface
│   └── repositories/         # Repository interfaces
│       ├── ProductRepository.ts
│       ├── CartRepository.ts
│       └── CustomerRepository.ts
├── application/              # Application layer (use cases & services)
│   ├── services/             # Service implementations
│   │   ├── PricingStrategy.ts        # Strategy interface
│   │   ├── ThreeForTwoStrategy.ts    # "3 for 2" promotion implementation
│   │   ├── VipDiscountStrategy.ts    # VIP 15% discount implementation
│   │   ├── PricingService.ts         # Main pricing orchestrator
│   │   └── __tests__/                # Service tests
│   │       ├── ThreeForTwoStrategy.test.ts
│   │       ├── VipDiscountStrategy.test.ts
│   │       └── PricingService.test.ts
│   └── use-cases/            # Use cases (business operations)
│       ├── AddItemToCartUseCase.ts
│       ├── RemoveItemFromCartUseCase.ts
│       └── CalculateCartPriceUseCase.ts
├── infrastructure/           # Infrastructure layer
│   └── repositories/
│       ├── Repositories.ts           # Singleton instances
│       ├── InMemoryProductRepository.ts
│       ├── InMemoryCartRepository.ts
│       ├── InMemoryCustomerRepository.ts
│       ├── LocalStorageCartRepository.ts  # Client-side persistence
│       └── HybridCartRepository.ts        # Memory + localStorage
└── app/                     # Next.js App Router
    ├── api/                 # REST API endpoints
    │   ├── products/        # GET /api/products
    │   ├── customers/       # GET /api/customers
    │   └── cart/
    │       ├── add/         # POST /api/cart/add
    │       ├── remove/      # POST /api/cart/remove
    │       ├── calculate/   # POST /api/cart/calculate
    │       └── load/        # POST /api/cart/load
    ├── components/          # UI Components
    │   ├── CartSection.tsx          # Shopping cart display
    │   ├── CustomerSelectionSection.tsx  # Customer type selection
    │   ├── PricingResultSection.tsx      # Price calculation results
    │   ├── ProductsSection.tsx           # Product listing
    │   └── index.ts                    # Component exports
    ├── layout.tsx
    ├── page.tsx
    └── globals.css
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd shopping-cart
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📡 API Endpoints

### Products
- **GET** `/api/products` - List all available products

### Customers
- **GET** `/api/customers` - List available customers (for testing)

### Cart Operations
- **POST** `/api/cart/add` - Add item to cart
  ```json
  {
    "cartId": "cart-123",
    "productId": "tshirt",
    "quantity": 2
  }
  ```

- **POST** `/api/cart/remove` - Remove item from cart
  ```json
  {
    "cartId": "cart-123",
    "productId": "tshirt"
  }
  ```

- **POST** `/api/cart/calculate` - Calculate cart price with promotions
  ```json
  {
    "cartId": "cart-123",
    "customerId": "vip-1"
  }
  ```

- **POST** `/api/cart/load` - Load cart from localStorage
  ```json
  {
    "cartId": "cart-123"
  }
  ```

## 🧪 Testing

### Run Tests
```bash
npm test
# or
yarn test
```

### Run Tests with Coverage
```bash
npm run test:coverage
# or
yarn test:coverage
```

### Test Coverage Target
- **Minimum coverage**: 70%
- **Current coverage**: 86% (statements), 72% (branches), 90% (functions)
- **Coverage includes**: Domain logic, application services, use cases, and API endpoints
- **Test files**: 8 test suites with 57 tests total

## 📊 Sample Scenarios

### Scenario 1: Common Customer - 3 T-shirts
- **Input**: 3 T-shirts (35.99 each)
- **Expected**: USD 71.98 (pay for 2, 1 free)
- **Promotion**: Get 3 for 2

### Scenario 2: Common Customer - Mixed Items
- **Input**: 2 T-shirts + 2 Jeans
- **Expected**: USD 137.49 (T-shirt is free as cheapest)
- **Promotion**: Get 3 for 2

### Scenario 3: VIP Customer - 3 Dresses
- **VIP Discount**: USD 205.91 (15% off 242.25)
- **Get 3 for 2**: USD 161.50 (pay for 2 dresses)
- **Recommendation**: Get 3 for 2 (better deal)

### Scenario 4: VIP Customer - Mixed Items
- **Input**: 2 Jeans + 2 Dresses
- **VIP Discount**: USD 249.57 (15% off 293.00)
- **Get 3 for 2**: USD 211.25 (Jeans is free)
- **Recommendation**: Get 3 for 2 (better deal)

## 🏛️ Design Decisions

### 1. Clean Architecture
- **Domain Layer**: Pure business logic and interfaces, no dependencies on external frameworks
- **Application Layer**: Service implementations and use cases that orchestrate domain objects
- **Infrastructure Layer**: Implements repository interfaces with in-memory and localStorage storage
- **API Layer**: Thin controllers that delegate to use cases

### 2. SOLID Principles
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: New promotions can be added without modifying existing code
- **Liskov Substitution**: All pricing strategies are interchangeable
- **Interface Segregation**: Repositories have focused interfaces
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### 3. Strategy Pattern
- **PricingStrategy**: Interface for different promotion types
- **ThreeForTwoStrategy**: Implements "3 for 2" logic with proper item grouping
- **VipDiscountStrategy**: Implements 15% VIP discount
- **PricingService**: Orchestrates strategies and selects the best option

### 4. Repository Pattern
- **Interfaces in Domain**: Define contracts for data access
- **Implementations in Infrastructure**: Concrete implementations (in-memory, localStorage)
- **HybridCartRepository**: Combines server memory with client localStorage for persistence

### 5. Layer Separation
- **Domain**: Contains only business rules, entities, and interfaces
- **Application**: Contains service implementations and use cases
- **Infrastructure**: Contains technical implementations (repositories, external services)
- **Presentation**: Contains UI components and API routes
- **Interfaces**: Define contracts for data access
- **In-Memory Implementation**: Simple storage for development/testing
- **Easy to Extend**: Can be replaced with database implementations

### 5. Value Objects
- **PricingResult**: Immutable object representing calculation results
- **Type Safety**: Strong typing prevents invalid states
- **Business Logic**: Encapsulates pricing calculation logic

## 🔧 Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Testing**: Jest + Testing Library
- **Styling**: Tailwind CSS (Responsive Design)
- **Architecture**: Clean Architecture
- **Patterns**: Strategy, Repository, Value Objects
- **UI/UX**: Responsive design with mobile-first approach
