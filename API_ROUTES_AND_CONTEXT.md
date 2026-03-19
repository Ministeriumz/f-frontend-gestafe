# GESTAFE - Backend API Documentation
**Sistema de Gestão para Igreja (Church Management System)**

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [API Routes & Endpoints](#api-routes--endpoints)
4. [Data Models](#data-models)
5. [Architecture & Layers](#architecture--layers)
6. [Middleware & Configurations](#middleware--configurations)
7. [Database Structure](#database-structure)
8. [Response Contract](#response-contract)
9. [CORS & Security](#cors--security)

---

## 🎯 Project Overview

**Project Name:** f-backend-gestafe  
**Purpose:** RESTful API backend for managing church/religious organization operations  
**Domain:** Church Management System  
**Current Status:** Development (NET 9.0)

### Main Domains
- **Church Management** (Igreja)
- **User Management** (Usuario)
- **Event Management** (Eventos)
- **Ministry Management** (Ministerio)
- **Financial Management** (Financeiro)
- **User Types** (TipoUsuario)
- **Settings** (Configuracoes)
- **Activity Logs** (Log)

---

## 🛠 Technology Stack

| Component | Technology |
|-----------|-----------|
| **Framework** | ASP.NET Core 9.0 |
| **Language** | C# |
| **ORM** | Entity Framework Core |
| **Database** | PostgreSQL |
| **API Documentation** | Swagger/OpenAPI |
| **Mapping** | AutoMapper |
| **Architecture Pattern** | Repository + Service Pattern |

---

## 🔌 API Routes & Endpoints

### Base URL
```
http://localhost:5000
```

### 1. IGREJA (Church)
**Route Base:** `/Igreja`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/Igreja` | List all churches | 200 OK |
| GET | `/Igreja/{id}` | Get church details by ID | 200 OK / 404 NOT FOUND |
| POST | `/Igreja` | Create new church | 201 CREATED |
| PATCH | `/Igreja/{id}` | Update church (partial) | 200 OK |

**Request/Response Example:**
```json
POST /Igreja
{
  "nome": "Igreja Central",
  "cnpj": "12.345.678/0001-90",
  "estado": "SP",
  "rua": "Avenida Principal",
  "cep": "01234-567",
  "numero": "100"
}

Response 200:
{
  "code": 1,
  "message": "Igreja criada com sucesso",
  "data": {
    "id": 1,
    "nome": "Igreja Central",
    "cnpj": "12.345.678/0001-90",
    ...
  }
}
```

---

### 2. USUARIO (User)
**Route Base:** `/Usuario`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/Usuario` | List all users | 200 OK |
| GET | `/Usuario/{id}` | Get user by ID | 200 OK / 404 NOT FOUND |
| POST | `/Usuario` | Create new user | 201 CREATED |
| PATCH | `/Usuario/{id}` | Update user (name, surname, phone) | 200 OK |

**Request/Response Example:**
```json
POST /Usuario
{
  "nome": "João",
  "sobrenome": "Silva",
  "telefone": "+55 11 9999-9999",
  "email": "joao@example.com",
  "senha": "senha123",
  "idIgreja": 1,
  "idTipoUsuario": 1
}

Response 200:
{
  "code": 1,
  "message": "Usuário listado com sucesso",
  "data": {
    "id": 1,
    "nome": "João",
    "sobrenome": "Silva",
    "telefone": "+55 11 9999-9999",
    "email": "joao@example.com",
    "idIgreja": 1,
    "idTipoUsuario": 1
  }
}
```

---

### 3. EVENTOS (Events)
**Route Base:** `/Eventos`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/Eventos` | List all events | 200 OK |
| GET | `/Eventos/{id}` | Get event by ID | 200 OK / 404 NOT FOUND |
| POST | `/Eventos` | Create new event | 201 CREATED |
| PUT | `/Eventos` | Update event (full replacement) | 200 OK |

**Request/Response Example:**
```json
POST /Eventos
{
  "nome": "Culto de Celebração",
  "tipo": "Culto",
  "resumo": "Culto especial de celebração",
  "data": "2026-03-15",
  "horaInicio": "19:30",
  "horaFim": "21:00"
}

Response 200:
{
  "code": 1,
  "message": "Eventos listados com sucesso",
  "data": {
    "id": 1,
    "nome": "Culto de Celebração",
    "tipo": "Culto",
    "resumo": "Culto especial de celebração",
    "data": "2026-03-15",
    "horaInicio": "19:30",
    "horaFim": "21:00"
  }
}
```

---

### 4. MINISTERIO (Ministry)
**Route Base:** `/Ministerio`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/Ministerio` | List all ministries | 200 OK |
| GET | `/Ministerio/{id}` | Get ministry by ID | 200 OK / 404 NOT FOUND |
| POST | `/Ministerio` | Create new ministry | 201 CREATED |
| PUT | `/Ministerio` | Update ministry (full replacement) | 200 OK |

**Request/Response Example:**
```json
POST /Ministerio
{
  "nome": "Ministério de Louvor",
  "tamanhoMax": 20
}

Response 200:
{
  "code": 1,
  "message": "Ministerios listados com sucesso",
  "data": {
    "id": 1,
    "nome": "Ministério de Louvor",
    "tamanhoMax": 20
  }
}
```

---

### 5. TIPOUSUARIO (User Type)
**Route Base:** `/TipoUsuario`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/TipoUsuario` | List all user types | 200 OK |
| GET | `/TipoUsuario/{id}` | Get user type by ID | 200 OK / 404 NOT FOUND |
| POST | `/TipoUsuario` | Create new user type | 201 CREATED |
| PATCH | `/TipoUsuario/{id}` | Update user type (name only) | 200 OK |

**Request/Response Example:**
```json
POST /TipoUsuario
{
  "nome": "Administrador"
}

Response 200:
{
  "code": 1,
  "message": "Tipos de usuário listados com sucesso",
  "data": {
    "id": 1,
    "nome": "Administrador"
  }
}
```

---

### 6. CONFIGURACOES (Settings)
**Route Base:** `/Configuracoes`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/Configuracoes` | List all configurations | 200 OK |
| GET | `/Configuracoes/{igrejaId}` | Get church configuration by church ID | 200 OK / 404 NOT FOUND |
| POST | `/Configuracoes` | Create church configuration | 201 CREATED |
| PUT | `/Configuracoes/{igrejaId}` | Update church configuration | 200 OK |
| DELETE | `/Configuracoes/{igrejaId}` | Delete configuration | 204 NO CONTENT |

**Request/Response Example:**
```json
POST /Configuracoes
{
  "igrejaId": 1,
  "configuracaoJson": {
    "tema": "dark",
    "idioma": "pt-BR",
    "utcOffset": -3
  }
}

Response 200:
{
  "code": 1,
  "message": "Configuração criada com sucesso",
  "data": {
    "igrejaId": 1,
    "configuracaoJson": {...}
  }
}
```

---

### 7. FINANCEIRO (Financial)
**Route Base:** `/Financeiro`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/Financeiro` | List all financial records | 200 OK |
| GET | `/Financeiro/{id}` | Get financial record by ID | 200 OK / 404 NOT FOUND |
| POST | `/Financeiro` | Create financial record | 201 CREATED |
| PUT | `/Financeiro` | Update financial record (full replacement) | 200 OK |
| DELETE | `/Financeiro/{id}` | Delete financial record | 204 NO CONTENT |

**Request/Response Example:**
```json
POST /Financeiro
{
  "valor": 1500.50,
  "acao": "Dízimo recebido",
  "data": "2026-03-06T10:30:00",
  "status": 1,
  "igrejaId": 1
}

Response 200:
{
  "code": 1,
  "message": "Registro financeiro listado com sucesso",
  "data": {
    "id": 1,
    "valor": 1500.50,
    "acao": "Dízimo recebido",
    "data": "2026-03-06T10:30:00",
    "status": 1,
    "igrejaId": 1
  }
}
```

**Status Enum:**
- `1` = Pago (Paid)
- `2` = Pendente (Pending)

---

### 8. LOG (Activity Logs)
**Route Base:** `/Log`

| HTTP Method | Endpoint | Purpose | Status Code |
|---|---|---|---|
| GET | `/Log` | List all activity logs | 200 OK |
| GET | `/Log/{id}` | Get log entry by ID | 200 OK / 404 NOT FOUND |

**Response Example:**
```json
GET /Log

Response 200:
{
  "code": 1,
  "message": "Logs listados com sucesso",
  "data": [
    {
      "id": 1,
      "data": "2026-03-06",
      "hora": "10:30:00",
      "acao": "Criou novo usuário",
      "idUsuario": 1
    }
  ]
}
```

---

## 📊 Data Models

### 1. Igreja (Church)
```csharp
public class Igreja
{
    public int Id { get; set; }                    // Primary Key
    public string Nome { get; set; }               // Max 100 chars, required
    public string Cnpj { get; set; }               // Max 18 chars (registration number)
    public string Estado { get; set; }             // State abbreviation, max 2 chars
    public string Rua { get; set; }                // Street, max 100 chars
    public string Cep { get; set; }                // Postal code, max 10 chars
    public string Numero { get; set; }             // House number, max 20 chars
    
    // Relationships
    public ICollection<Usuario> Usuarios { get; set; }
    public Configuracoes Configuracoes { get; set; }
    public ICollection<Financeiro> Registros { get; set; }
}

Database Table: igrejas
```

### 2. Usuario (User)
```csharp
public class Usuario
{
    public int IdUsuario { get; set; }             // Primary Key
    public string Nome { get; set; }               // Max 100 chars, required
    public string Sobrenome { get; set; }          // Surname, Max 100 chars, required
    public string Telefone { get; set; }           // Max 18 chars
    public string Email { get; set; }              // Max 100 chars, unique, email validation
    public string Senha { get; set; }              // Password, Max 50 chars, required
    public int IdIgreja { get; set; }              // Foreign Key → Igreja
    public int IdTipoUsuario { get; set; }         // Foreign Key → TipoUsuario
    
    // Relationships
    public Igreja Igreja { get; set; }
    public TipoUsuario TipoUsuario { get; set; }
}

Database Table: usuarios
```

### 3. Eventos (Events)
```csharp
public class Eventos
{
    public int Id { get; set; }                    // Primary Key
    public string Nome { get; set; }               // Event name, Max 100 chars
    public string Tipo { get; set; }               // Event type, Max 100 chars
    public string Resumo { get; set; }             // Summary, Max 255 chars
    public DateOnly Data { get; set; }             // Date
    public TimeOnly HoraInicio { get; set; }       // Start time
    public TimeOnly HoraFim { get; set; }          // End time
}

Database Table: eventos
```

### 4. Ministerio (Ministry)
```csharp
public class Ministerio
{
    public int IdMinisterio { get; set; }          // Primary Key
    public string Nome { get; set; }               // Ministry name, Max 100 chars, required
    public int TamanhoMax { get; set; }            // Maximum capacity
    
    // Relationships
    public ICollection<Usuario> Usuarios { get; set; }
}

Database Table: ministerios
```

### 5. TipoUsuario (User Type)
```csharp
public class TipoUsuario
{
    public int IdTipo { get; set; }                // Primary Key
    public string Nome { get; set; }               // Type name, Max 100 chars, required
    
    // Relationships
    public ICollection<Usuario> Usuarios { get; set; }
}

Database Table: tipo_usuario
```

### 6. Configuracoes (Settings)
```csharp
public class Configuracoes
{
    public int IgrejaId { get; set; }              // Primary Key + Foreign Key → Igreja (1:1)
    public string ConfiguracaoJson { get; set; }  // JsonB data type, stores JSON configuration
    
    // Relationships
    public Igreja Igreja { get; set; }
}

Database Table: configuracoes
```

### 7. Financeiro (Financial)
```csharp
public class Financeiro
{
    public int Id { get; set; }                    // Primary Key
    public decimal Valor { get; set; }             // Amount
    public string Acao { get; set; }               // Action description
    public DateTime Data { get; set; }             // DateTime
    public int Status { get; set; }                // Status: 1=Paid, 2=Pending
    public int? IgrejaId { get; set; }             // Optional Foreign Key → Igreja
    
    // Relationships
    public Igreja Igreja { get; set; }
}

Database Table: financeiro

Status Enum:
- 1 = StatusFinanceiro.Pago
- 2 = StatusFinanceiro.Pendente
```

### 8. Log (Activity Logs)
```csharp
public class Log
{
    public int Id { get; set; }                    // Primary Key
    public DateTime Data { get; set; }             // Log date
    public TimeSpan Hora { get; set; }             // Log time
    public string Acao { get; set; }               // Action, Max 100 chars
    public int? IdUsuario { get; set; }            // Optional Foreign Key → Usuario
}

Database Table: logs
```

---

## 🏗 Architecture & Layers

### Layer Structure
```
Controllers (HTTP Entry Points)
    ↓
Services (Business Logic)
    ↓
Repositories (Data Access)
    ↓
Database (PostgreSQL)
```

### Layer Details

#### 1. Controller Layer
**Location:** `/Controllers`
- `IgrejaController.cs` - Church management
- `UsuarioController.cs` - User management
- `EventosController.cs` - Event management
- `MinisterioController.cs` - Ministry management
- `TipoUsuarioController.cs` - User type management
- `ConfiguracoesController.cs` - Settings management
- `FinanceiroController.cs` - Financial management
- `LogController.cs` - Log viewing

**Characteristics:**
- All controllers inherit from `ControllerBase` or `Controller`
- Use `[ApiController]` attribute
- Route: `[Route("[controller]")]` (converts to controller name without "Controller")
- All methods are async
- Standard response wrapping with `Response` contract

#### 2. Service Layer
**Location:** `/Services/Entities` and `/Services/Interfaces`

**Generic Service Pattern:**
```csharp
public interface IGenericService<T, TDto>
{
    Task<IEnumerable<TDto>> GetAll();
    Task<TDto> GetById(int id);
    Task Create(TDto entityDTO);
    Task Update(TDto entityDTO, int id);
    Task Remove(int id);
}
```

**Concrete Services:**
- `IgrejaService` / `IIgrejaService`
- `UsuarioService` / `IUsuarioService`
- `EventosService` / `IEventosService`
- `MinisterioService` / `IMinisterioService`
- `TipoUsuarioService` / `ITipoUsuarioService`
- `ConfiguracoesService` / `IConfiguracoesService`
- `FinanceiroService` / `IFinanceiroService`
- `LogService` / `ILogService`

**Dependency Injection Registration:**
```csharp
builder.Services.AddScoped<IIgrejaService, IgrejaService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IEventosService, EventosService>();
// ... and so on
```

#### 3. Repository Layer
**Location:** `/Data/Repositories` and `/Data/Interfaces`

**Generic Repository Pattern:**
```csharp
public interface IGenericRepository<T>
{
    Task<IEnumerable<T>> GetAll();
    Task<T> GetById(int id);
    Task Create(T entity);
    Task Update(T entity);
    Task Remove(T entity);
    Task SaveChangesAsync();
}
```

**Concrete Repositories:**
- `IgrejaRepository` / `IIgrejaRepository`
- `UsuarioRepository` / `IUsuarioRepository`
- `EventosRepository` / `IEventosRepository`
- `MinisterioRepository` / `IMinisterioRepository`
- `TipoUsuarioRepository` / `ITipoUsuarioRepository`
- `ConfiguracoesRepository` / `IConfiguracoesRepository`
- `FinanceiroRepository` / `IFinanceiroRepository`
- `LogRepository` / `ILogRepository`

**Base Implementation:**
`GenericRepository<T>` provides common CRUD operations

#### 4. Database Layer
**Location:** `/Data/AppDbContext.cs`

**DbSets:**
```csharp
public DbSet<Igreja> Igrejas { get; set; }
public DbSet<Usuario> Usuario { get; set; }
public DbSet<Eventos> Eventos { get; set; }
public DbSet<Ministerio> Ministerios { get; set; }
public DbSet<TipoUsuario> TipoUsuario { get; set; }
public DbSet<Configuracoes> Configuracoes { get; set; }
public DbSet<Financeiro> Financeiro { get; set; }
public DbSet<Log> Log { get; set; }
```

**Model Configuration:**
Uses Fluent Builder Pattern located in `/Data/Builders/`:
- `IgrejaBuilder.cs`
- `UsuarioBuilder.cs`
- `EventosBuilder.cs`
- `MinisterioBuilder.cs`
- `TipoUsuarioBuilder.cs`
- `ConfiguracoesBuilder.cs`
- `FinanceiroBuilder.cs`
- `LogBuilder.cs`

---

## ⚙️ Middleware & Configurations

### 1. Error Handling Middleware
**File:** `/Middles/ErrorHandlingMiddleware.cs`

**Purpose:** Catches all unhandled exceptions globally

**Behavior:**
- Catches exceptions from the entire request pipeline
- Returns standardized JSON error response
- HTTP Status: 500 Internal Server Error
- Includes error message and stack trace (development only recommended)
- Response Format:
```json
{
  "code": 5,  // ResponseEnum.ERROR
  "message": "Error message description",
  "data": null
}
```

**Registration in Program.cs:**
```csharp
app.UseMiddleware<ErrorHandlingMiddleware>();
```

### 2. Logging Middleware
**File:** `/Middles/LogMiddleware.cs`

**Purpose:** Logs all HTTP requests to the database

**Captured Information:**
- HTTP Method (GET, POST, PUT, etc.)
- Request Path/Route
- Timestamp (Date and Time)
- User ID (if available from context)
- Action description

**Exclusions:**
- Swagger/OpenAPI documentation requests (`/swagger`, `/api/v1`)
- Not excluded but safe: Will not break if logging fails

**Logging Flow:**
1. Request arrives
2. Extract method and path
3. Create Log entry
4. Store in database via LogService
5. Continue with request

**Response:**
```csharp
Log entity saved:
{
  "id": 1,
  "data": "2026-03-06",
  "hora": "10:30:00",
  "acao": "GET /Usuario",
  "idUsuario": null
}
```

### 3. Service Registration
**File:** `Program.cs`

```csharp
// Database Context
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    opt.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection"));
});

// AutoMapper for DTO mapping
builder.Services.AddAutoMapper(opt => { }, AppDomain.CurrentDomain.GetAssemblies());

// Repositories (Scoped lifecycle)
builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IIgrejaRepository, IgrejaRepository>();
builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IEventosRepository, EventosRepository>();
builder.Services.AddScoped<IMinisterioRepository, MinisterioRepository>();
builder.Services.AddScoped<ITipoUsuarioRepository, TipoUsuarioRepository>();
builder.Services.AddScoped<IConfiguracoesRepository, ConfiguracoesRepository>();
builder.Services.AddScoped<IFinanceiroRepository, FinanceiroRepository>();
builder.Services.AddScoped<ILogRepository, LogRepository>();

// Services (Scoped lifecycle)
builder.Services.AddScoped<IIgrejaService, IgrejaService>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IEventosService, EventosService>();
builder.Services.AddScoped<IMinisterioService, MinisterioService>();
builder.Services.AddScoped<ITipoUsuarioService, TipoUsuarioService>();
builder.Services.AddScoped<IConfiguracoesService, ConfiguracoesService>();
builder.Services.AddScoped<IFinanceiroService, FinanceiroService>();
builder.Services.AddScoped<ILogService, LogService>();
```

### 4. CORS Configuration
**Allowed Origins:**
```
http://localhost:3000   (React development)
http://localhost:5173   (Vite/Vue development)
```

**Policies:**
- Allow all HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- Allow all headers
- Allow credentials (cookies, authorization headers)

**Configuration:**
```csharp
builder.Services.AddCors(o => o.AddPolicy("DefaultPolicy", policy =>
{
    policy.WithOrigins("http://localhost:3000", "http://localhost:5173")
          .AllowAnyMethod()
          .AllowAnyHeader()
          .AllowCredentials();
}));

app.UseCors("DefaultPolicy");
```

### 5. Swagger/OpenAPI
- **Endpoint:** `/swagger/ui/index.html`
- **JSON Spec:** `/swagger/v1/swagger.json`
- **Status:** Enabled in Development environment
- **Registration:**
```csharp
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

app.UseSwagger();
app.UseSwaggerUI();
```

### 6. HTTPS Redirection
```csharp
app.UseHttpsRedirection();
```

---

## 🗄 Database Structure

### PostgreSQL Configuration
**Connection String:** (from appsettings.json)
```
Server=localhost;Port=5432;Database=gestafe_db;UserId=postgres;Password=password;
```

### Tables Overview

| Table | Purpose | Primary Key | Special Notes |
|-------|---------|-------------|--------------|
| `igrejas` | Churches | `id` | Main entity |
| `usuarios` | Users | `id_usuario` | References: Igreja, TipoUsuario |
| `eventos` | Events | `id` | No foreign keys |
| `ministerios` | Ministries | `id_ministerio` | References: Users (N:N) |
| `tipo_usuario` | User Types/Roles | `id_tipo` | Referenced by Users |
| `configuracoes` | Church Settings | `igreja_id` | 1:1 with Igreja, JsonB storage |
| `financeiro` | Financial Records | `id` | Optional: References Igreja |
| `logs` | Activity Logs | `id` | Optional: References Usuario |

### Entity Relationships Diagram
```
Igreja (1) ──────── (N) Usuario
  │                    │
  │                    └──── (N) TipoUsuario
  │
  ├──── (1) Configuracoes
  │
  └──── (N) Financeiro

Eventos (standalone - no foreign keys)
Ministerio (N:N relationship with Usuario through junction table)
Log (Optional N:1 with Usuario)
```

### Migrations
**Location:** `/Migrations`

- **Migration 1:** `20260305140524_inicial` - Initial database schema
- **Migration 2:** `20260306160540_dev` - Development changes

**Model Snapshot:** `AppDbContextModelSnapshot.cs`

---

## 📋 Response Contract

### Standard Response Wrapper
All API responses follow this contract:

```csharp
public class Response
{
    public ResponseEnum Code { get; set; }      // Status code enum
    public string Message { get; set; }         // Response message (Portuguese)
    public object Data { get; set; }            // Response payload
}

public enum ResponseEnum
{
    SUCCESS = 1,        // Successful operation
    INVALID = 2,        // Invalid request
    NOT_FOUND = 3,      // Resource not found
    DUPLICATE = 4,      // Duplicate entry
    ERROR = 5           // Generic error
}
```

### Example Responses

**Success (200 OK):**
```json
{
  "code": 1,
  "message": "Operação concluída com sucesso",
  "data": {
    "id": 1,
    "nome": "Exemplo",
    ...
  }
}
```

**Not Found (404):**
```json
{
  "code": 3,
  "message": "Recurso não encontrado",
  "data": null
}
```

**Error (500):**
```json
{
  "code": 5,
  "message": "Erro interno do servidor",
  "data": null
}
```

---

## 🔐 CORS & Security

### Current CORS Configuration
**Allowed Frontends:**
- React Development Server: `http://localhost:3000`
- Vite Development Server: `http://localhost:5173`

### Allowed Operations
- ✅ All HTTP methods (GET, POST, PUT, PATCH, DELETE, OPTIONS)
- ✅ All headers
- ✅ Credentials/Cookies

### Recommendations for Production
- [ ] Restrict allowed methods based on endpoint
- [ ] Add authentication (JWT tokens)
- [ ] Implement authorization checks
- [ ] Use HTTPS only in production
- [ ] Update CORS origins to production URLs
- [ ] Add rate limiting
- [ ] Implement input validation/sanitization
- [ ] Add API versioning strategy

---

## 🔧 Running the Project

### Prerequisites
- .NET 9.0 SDK
- PostgreSQL 12+
- Visual Studio Code or Visual Studio 2022+

### Setup Steps
1. Configure PostgreSQL connection string in `appsettings.json`
2. Run migrations: `dotnet ef database update`
3. Build project: `dotnet build`
4. Run project: `dotnet run`

### Default Ports
- **API Server:** `http://localhost:5000` (HTTP) / `https://localhost:5001` (HTTPS)
- **Swagger UI:** `http://localhost:5000/swagger`

---

## 📝 Notes for AI/Development

### Key Observations
1. **Architecture Pattern:** Clean layered architecture with Repository and Service patterns
2. **DTO Usage:** All services use DTOs for data transfer (mapped via AutoMapper)
3. **Update Methods:** Mix of PATCH (partial) and PUT (full replacement)
   - Usuario, TipoUsuario: Use PATCH
   - Eventos, Ministerio, Financeiro: Use PUT
4. **Configuracoes Special Case:** Uses composite primary key (IgrejaId) with 1:1 relationship
5. **Financeiro Optional FK:** Church reference is nullable
6. **Language:** All code and messages in Portuguese
7. **Middleware Order:** Error handling → Logging → Routing → CORS
8. **Dependency Injection:** All services registered as Scoped

### Future Considerations
- Add authentication/authorization layer
- Implement API versioning
- Add rate limiting
- Add caching strategies
- Add pagination for list endpoints
- Add filtering/sorting capabilities
- Add unit tests
- Add integration tests
- Document DTOs and mappings
- Add API documentation comments (XML docs)

---

## 📞 Quick Reference

### Controller Routes
```
GET    /Igreja              - List churches
GET    /Igreja/{id}         - Get church
POST   /Igreja              - Create church
PATCH  /Igreja/{id}         - Update church

GET    /Usuario             - List users
GET    /Usuario/{id}        - Get user
POST   /Usuario             - Create user
PATCH  /Usuario/{id}        - Update user

GET    /Eventos             - List events
GET    /Eventos/{id}        - Get event
POST   /Eventos             - Create event
PUT    /Eventos             - Update event

GET    /Ministerio          - List ministries
GET    /Ministerio/{id}     - Get ministry
POST   /Ministerio          - Create ministry
PUT    /Ministerio          - Update ministry

GET    /TipoUsuario         - List user types
GET    /TipoUsuario/{id}    - Get user type
POST   /TipoUsuario         - Create user type
PATCH  /TipoUsuario/{id}    - Update user type

GET    /Configuracoes       - List configurations
GET    /Configuracoes/{id}  - Get configuration
POST   /Configuracoes       - Create configuration
PUT    /Configuracoes/{id}  - Update configuration
DELETE /Configuracoes/{id}  - Delete configuration

GET    /Financeiro          - List financial records
GET    /Financeiro/{id}     - Get record
POST   /Financeiro          - Create record
PUT    /Financeiro          - Update record
DELETE /Financeiro/{id}     - Delete record

GET    /Log                 - List logs
GET    /Log/{id}            - Get log entry
```

---

**Document Generated:** March 6, 2026  
**Project Status:** Development (NET 9.0)  
**API Version:** v1 (Implied)  
**Last Updated:** 2026-03-06
