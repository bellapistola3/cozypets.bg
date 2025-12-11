# Architecture Overview - Cozy Pets by Alice

Това документация описва архитектурата на платформата и ключови технически решения.

## System Architecture

```
┌─────────────────────────────────────────────────────┐
│                    Frontend (React)                  │
│  - User Interface                                    │
│  - State Management (Context API)                   │
│  - Client-side Routing                              │
└───────────────────┬─────────────────────────────────┘
                    │ HTTPS/REST
                    │
┌───────────────────▼─────────────────────────────────┐
│              Supabase Platform                       │
│  ┌─────────────────────────────────────────────┐   │
│  │  PostgreSQL Database (with RLS)             │   │
│  │  - Core tables                              │   │
│  │  - RLS policies                             │   │
│  │  - Foreign keys & indexes                   │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  Authentication (Supabase Auth)             │   │
│  │  - Email/Password                           │   │
│  │  - JWT tokens                               │   │
│  │  - Session management                       │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  Edge Functions (Deno)                      │   │
│  │  - AI processing                            │   │
│  │  - Match engine                             │   │
│  │  - Background jobs                          │   │
│  └─────────────────────────────────────────────┘   │
│                                                      │
│  ┌─────────────────────────────────────────────┐   │
│  │  Storage (Optional)                         │   │
│  │  - Profile pictures                         │   │
│  │  - Pet photos                               │   │
│  └─────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Database Design

### Core Principles

1. **Normalization**: 3NF за избягване на data duplication
2. **Foreign Keys**: Всички relationships enforced на DB ниво
3. **Indexes**: На foreign keys и frequently queried columns
4. **Timestamps**: `created_at`, `updated_at` навсякъде
5. **Soft Deletes**: За audit trail (where applicable)

### Key Design Decisions

#### Profiles vs Users Table

- **Decision**: Използваме и двете таблици
- **Reason**:
  - `users` (legacy) - за backward compatibility
  - `profiles` (new) - синхронизирана с Supabase Auth
- **Auth Flow**: Auth user ID → profiles.id

#### Reviews Architecture

```
reviews (1 review = 1 reservation)
   ↓
sitter_ratings (aggregated per sitter)
   ↓
Used for search/filtering
```

**Benefits**:
- Fast search без aggregation
- Maintained автоматично via triggers
- Includes recency weighting

#### Payment Escrow System

```
Booking Created → Payment Made → Escrow HELD
      ↓
Service Completed → Review Period (48h)
      ↓
Admin/Auto Release → Escrow RELEASED → Sitter Paid
```

**Benefits**:
- Buyer protection
- Dispute resolution period
- Platform commission tracking

#### Chat Approval System

```
Chat Request → Admin Approval → Chat Activated
      ↓
Messages tracked → Violations detected → Auto-ban
```

**Benefits**:
- Spam prevention
- Quality control
- Safety для users

## Security Architecture

### Row Level Security (RLS)

#### Policy Strategy

```sql
-- Pattern 1: Own data only
CREATE POLICY "Users view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Pattern 2: Related data
CREATE POLICY "View own reservations"
  ON reservations FOR SELECT
  TO authenticated
  USING (auth.uid() = owner_id OR
         auth.uid() IN (SELECT profile_id FROM sitters WHERE id = sitter_id));

-- Pattern 3: Public read, restricted write
CREATE POLICY "Public can view sitters"
  ON sitters FOR SELECT
  TO authenticated
  USING (true);
```

#### Admin Bypass

```sql
CREATE POLICY "Admin full access"
  ON table_name FOR ALL
  TO authenticated
  USING (
    (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin'
  );
```

### Authentication Flow

```
1. User enters credentials
   ↓
2. Supabase Auth validates
   ↓
3. JWT token issued
   ↓
4. Frontend stores token
   ↓
5. All requests include token
   ↓
6. RLS policies check auth.uid()
```

## Frontend Architecture

### Component Structure

```
src/
├── components/          # Reusable components
│   ├── common/         # Generic UI components
│   ├── matching/       # AI match features
│   └── [feature]/      # Feature-specific
├── pages/              # Full page components
├── contexts/           # React Context (Auth)
├── lib/                # Utilities & services
│   ├── supabase.ts    # DB client
│   ├── auth.ts        # Auth helpers
│   ├── [feature]Service.ts  # Business logic
│   ├── errorHandler.ts
│   └── validation.ts
└── types/              # TypeScript types
```

### State Management

**Choice**: React Context API

**Why**:
- Simple для малко до средно app
- No external dependencies
- Built-in React
- Sufficient за auth state

**Alternative considered**: Redux
- Rejected: Overkill за този size
- Future: Може да се добави ако app расте significant

### Data Fetching Pattern

```typescript
// Pattern: Service layer
export const serviceModule = {
  async getData() {
    const { data, error } = await supabase
      .from('table')
      .select('*');

    if (error) throw error;
    return data;
  }
};

// Usage in component
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  serviceModule.getData()
    .then(setData)
    .catch(handleError)
    .finally(() => setLoading(false));
}, []);
```

## Payment System Architecture

### Commission Model

```typescript
booking_total = 100 BGN
platform_commission_rate = 15%
platform_fee = 15 BGN
sitter_payout = 85 BGN
```

### Escrow State Machine

```
States:
- HELD: Payment received, service pending
- RELEASED: Service completed, paid to sitter
- REFUNDED: Service cancelled, returned to owner

Transitions:
HELD → RELEASED (after service + 48h review period)
HELD → REFUNDED (on cancellation before service)
RELEASED → [terminal state]
```

### Platform Earnings Tracking

```sql
platform_earnings table:
- reservation_id
- platform_commission_amount
- sitter_payout_amount
- status (collected, pending, refunded)
- collected_at
```

**Benefits**:
- Clear audit trail
- Easy reconciliation
- Revenue reporting

## Performance Optimization

### Database Level

1. **Indexes**:
   ```sql
   CREATE INDEX idx_reservations_owner ON reservations(owner_id);
   CREATE INDEX idx_reservations_sitter ON reservations(sitter_id);
   CREATE INDEX idx_reviews_sitter ON reviews(sitter_id);
   ```

2. **Materialized Views**: `sitter_ratings` за fast search

3. **Query Optimization**:
   - Select specific columns, not `*`
   - Use `maybeSingle()` за 0-1 results
   - Batch queries със `.in()`

### Frontend Level

1. **Code Splitting**: Route-based
2. **Lazy Loading**: Heavy components
3. **Memoization**: Expensive calculations
4. **Debouncing**: Search inputs

### Caching Strategy

Currently: No caching layer

**Future consideration**:
- Redis для frequent queries
- Browser cache за static data
- Service worker за offline support

## Scalability Considerations

### Current Limits

- Supabase Free Tier:
  - 500 MB database
  - 2 GB bandwidth
  - 50 MB file storage

### Scaling Path

1. **Phase 1** (0-1000 users):
   - Current architecture sufficient
   - Monitor query performance

2. **Phase 2** (1000-10000 users):
   - Upgrade Supabase plan
   - Add database indexes
   - Implement caching
   - CDN за static assets

3. **Phase 3** (10000+ users):
   - Database sharding (може би)
   - Microservices за heavy features
   - Queue system за background jobs
   - Load balancer

## Error Handling Strategy

### Layers

1. **Database Layer**: PostgreSQL constraints & triggers
2. **RLS Layer**: Permission denied errors
3. **Service Layer**: Business logic validation
4. **Component Layer**: User input validation
5. **Global Layer**: ErrorBoundary

### Error Types

```typescript
- ValidationError: User input problems
- AuthError: Authentication failures
- PermissionError: RLS policy violations
- NetworkError: API communication issues
- UnknownError: Unexpected errors
```

## Testing Strategy

### Current State

Minimal testing (production-ready но not test-covered)

### Recommended Testing

```
Unit Tests:
- Validation functions
- Utility functions
- Service layer methods

Integration Tests:
- API calls
- Database operations
- Auth flows

E2E Tests:
- User registration → booking flow
- Sitter registration → receiving booking
- Admin operations
```

### Tools Suggestion

- Jest за unit tests
- React Testing Library за component tests
- Playwright за E2E tests
- Supabase local для test database

## Monitoring & Observability

### Current Implementation

- Console logging
- Browser DevTools
- Supabase Dashboard logs

### Recommended Additions

```
Error Tracking: Sentry
  - Frontend errors
  - Unhandled promise rejections
  - Network failures

Analytics: Plausible/Google Analytics
  - User journeys
  - Conversion funnels
  - Feature usage

Performance: Web Vitals
  - LCP, FID, CLS
  - Page load times
  - API response times

Database Monitoring:
  - Query performance
  - Connection pooling
  - Disk usage
```

## Future Architecture Improvements

### Short Term

1. Add comprehensive testing
2. Implement proper error tracking
3. Setup CI/CD pipeline
4. Add performance monitoring

### Medium Term

1. Caching layer (Redis)
2. Email notification system
3. Real-time updates (Supabase Realtime)
4. Advanced search (full-text search)

### Long Term

1. Mobile app (React Native)
2. Microservices за heavy features
3. Event-driven architecture
4. Multi-region deployment

## Technology Choices Rationale

### Why React?

- Component-based architecture
- Large ecosystem
- Great developer experience
- TypeScript support
- Easy hiring

### Why TypeScript?

- Type safety
- Better IDE support
- Catch errors early
- Self-documenting code

### Why Supabase?

- Fast development
- Built-in auth
- Real-time capabilities
- PostgreSQL (proven DB)
- RLS за security
- Cost-effective

### Why Vite?

- Fast dev server
- Quick builds
- Modern tooling
- Great DX
- Small bundle sizes

## Conclusion

Архитектурата е designed за:
- **Rapid development**: Fast iteration
- **Security first**: RLS everywhere
- **Scalability**: Clear scaling path
- **Maintainability**: Clean code structure
- **Cost efficiency**: Serverless architecture

Текущата implementation е production-ready за MVP stage с clear path за scaling.
