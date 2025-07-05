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

## 🏗️ Architecture

This project follows **Clean Architecture** principles with a clear separation of concerns:

```
src/
├── domain/                    # Business logic and entities
│   ├── entities/             # Core business entities
│   │   ├── Product.ts        # Product entity
│   │   ├── Cart.ts           # Shopping cart entity
│   │   ├── CartItem.ts       # Cart item entity
│   │   └── Customer.ts       # Customer entity (VIP/Common)
│   ├── value-objects/        # Value objects
│   │   └── PricingResult.ts  # Pricing calculation result
│   ├── services/             # Domain services
│   │   ├── PricingStrategy.ts        # Strategy pattern interface
│   │   ├── ThreeForTwoStrategy.ts    # "3 for 2" promotion
│   │   ├── VipDiscountStrategy.ts    # VIP 15% discount
│   │   └── PricingService.ts         # Main pricing orchestrator
│   └── repositories/         # Repository interfaces
│       ├── ProductRepository.ts
│       ├── CartRepository.ts
│       └── CustomerRepository.ts
├── application/              # Application layer (use cases)
│   └── use-cases/
│       ├── AddItemToCartUseCase.ts
│       └── CalculateCartPriceUseCase.ts
├── infrastructure/           # Infrastructure layer
│   └── repositories/
│       ├── InMemoryProductRepository.ts
│       ├── InMemoryCartRepository.ts
│       └── InMemoryCustomerRepository.ts
└── app/                     # Next.js App Router
    ├── api/                 # REST API endpoints
    │   ├── products/        # GET /api/products
    │   ├── customers/       # GET /api/customers
    │   └── cart/
    │       ├── add/         # POST /api/cart/add
    │       └── calculate/   # POST /api/cart/calculate
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

- **POST** `/api/cart/calculate` - Calculate cart price with promotions
  ```json
  {
    "cartId": "cart-123",
    "customerId": "vip-1"
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
- **Coverage includes**: Domain logic, use cases, and API endpoints

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
- **Domain Layer**: Pure business logic, no dependencies on external frameworks
- **Application Layer**: Use cases orchestrate domain objects
- **Infrastructure Layer**: Implements repository interfaces with in-memory storage
- **API Layer**: Thin controllers that delegate to use cases

### 2. SOLID Principles
- **Single Responsibility**: Each class has one reason to change
- **Open/Closed**: New promotions can be added without modifying existing code
- **Liskov Substitution**: All pricing strategies are interchangeable
- **Interface Segregation**: Repositories have focused interfaces
- **Dependency Inversion**: High-level modules don't depend on low-level modules

### 3. Strategy Pattern
- **PricingStrategy**: Interface for different promotion types
- **ThreeForTwoStrategy**: Implements "3 for 2" logic
- **VipDiscountStrategy**: Implements 15% VIP discount
- **PricingService**: Orchestrates strategies and selects the best option

### 4. Repository Pattern
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
- **Styling**: Tailwind CSS
- **Architecture**: Clean Architecture
- **Patterns**: Strategy, Repository, Value Objects

## 📈 Future Enhancements

1. **Database Integration**: Replace in-memory repositories with PostgreSQL/MongoDB
2. **Authentication**: Add user authentication and session management
3. **More Promotions**: Implement additional promotional strategies
4. **Inventory Management**: Add stock tracking and availability
5. **Order Processing**: Complete checkout flow and order management
6. **Analytics**: Track promotion effectiveness and customer behavior

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
