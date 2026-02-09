# f-backend-gestafe — Documentação de Rotas

Este documento descreve as rotas da API, os parâmetros esperados, exemplos de request/response e os códigos de status retornados.

Base URL
- `http://{HOST}:{PORT}/` (substitua `{HOST}:{PORT}` pelo host/porta onde a API está rodando — ex: `http://localhost:5000/`)

Formato de resposta padrão
Todas as rotas retornam um objeto no formato `Response`:

```json
{
  "code": <number>,
  "message": "<mensagem>",
  "data": <objeto ou null>
}
```

`ResponseEnum` (valores possíveis em `Objects/Contracts/ResponseEnum.cs`):
- `SUCCESS = 1`
- `INVALID = 2`
- `NOT_FOUND = 3`
- `CONFLICT = 4`
- `UNAUTHORIZED = 5`
- `ERROR = 6`

Regras gerais
- Endpoints usam o nome do controller como base da rota (atributo `[Route("[controller]")]`).
- Erros inesperados retornam status `500` com `code: ERROR` e um `data` contendo `ErrorMessage` e `StackTrace`.
- Validações simples retornam `400` com `code: INVALID`.
- Recursos não encontrados retornam `404` com `code: NOT_FOUND`.

Endpoints
---------

1) Eventos
- Base: `/Eventos`

- GET `/Eventos`
  - Descrição: Lista todos os eventos.
  - Resposta 200: `code: SUCCESS`, `data` = array de `EventosDTO`.

- GET `/Eventos/{id}`
  - Descrição: Obtém um evento por `id`.
  - Resposta 200: `code: SUCCESS`, `data` = `EventosDTO`.
  - Resposta 404: `code: NOT_FOUND` quando não existe.

- POST `/Eventos`
  - Descrição: Cria um novo evento.
  - Body (exemplo):

```json
{
  "nome": "Culto de Domingo",
  "tipo": "Culto",
  "resumo": "Culto matinal",
  "data": "2025-12-07",
  "hora_inicio": "09:00:00",
  "hora_fim": "11:00:00"
}
```

  - Resposta 200: `code: SUCCESS`, `data` = objeto criado (`EventosDTO` com `id`).
  - Resposta 400: `code: INVALID` quando body inválido.

- PUT `/Eventos`
  - Descrição: Atualiza por completo um evento. O body deve conter `Id`.
  - Body: mesmo formato de `EventosDTO` (incluindo `id`).
  - Resposta 200: `code: SUCCESS`, `data` = objeto atualizado.
  - Resposta 404: `code: NOT_FOUND` se o id não existir.

- DELETE `/Eventos/{id}`
  - Descrição: Remove um evento por `id`.
  - Resposta 200: `code: SUCCESS` em sucesso.
  - Resposta 404: `code: NOT_FOUND` se não existir.

Campos do `EventosDTO` (em `Objects/Dtos/Entities/EventosDTO.cs`):
- `Id` (int)
- `Nome` (string)
- `Tipo` (string)
- `Resumo` (string)
- `Data` (DateOnly — formato `yyyy-MM-dd`)
- `Hora_inicio` (TimeOnly — `HH:mm:ss`)
- `Hora_fim` (TimeOnly — `HH:mm:ss`)

2) Igreja
- Base: `/Igreja`

- GET `/Igreja`
  - Lista todas as igrejas. Resposta 200 com array de `IgrejaDTO`.

- GET `/Igreja/{id}`
  - Obtém igreja por id. 200 com `IgrejaDTO` ou 404.

- POST `/Igreja`
  - Cria igreja.
  - Body exemplo:

```json
{
  "nome": "Igreja Exemplo",
  "cnpj": "12.345.678/0001-99",
  "estado": "SP",
  "rua": "Rua A",
  "cep": "01234-567",
  "numero": "123"
}
```

- PATCH `/Igreja/AtualizarIgrejaPorId{id}`
  - Descrição: Atualização parcial. Enviar somente os campos a alterar.
  - Exemplo body:

```json
{
  "nome": "Novo Nome"
}
```

- PUT `/Igreja`
  - Atualização completa (body com `Id`).

- DELETE `/Igreja/{id}`
  - Remove igreja por id.

Campos `IgrejaDTO`:
- `Id`, `Nome`, `Cnpj`, `Estado`, `Rua`, `Cep`, `Numero`.

3) Ministerio
- Base: `/Ministerio`

- GET `/Ministerio` — lista todos.
- GET `/Ministerio/{id}` — obter por id.
- POST `/Ministerio` — criar. Exemplo body:

```json
{
  "nome": "Louvor",
  "tamanho_max": 20
}
```

- PUT `/Ministerio` — atualizar (body com `Id`).
- DELETE `/Ministerio/{id}` — remover.

Campos `MinisterioDTO`:
- `Id`, `Nome`, `Tamanho_max`.

4) TipoUsuario
- Base: `/TipoUsuario`

- GET `/TipoUsuario` — lista todos.
- GET `/TipoUsuario/{id}` — obter por id.
- POST `/TipoUsuario` — criar. Body exemplo:

```json
{
  "nome": "Administrador"
}
```

- PATCH `/TipoUsuario/AtualizarTipoUsuarioPorId{id}` — atualização parcial (ex: `{"nome":"Novo"}`).
- PUT `/TipoUsuario` — atualização completa (body com `Id`).
- DELETE `/TipoUsuario/{id}` — remover.

Campos `TipoUsuarioDTO`:
- `Id`, `Nome`.

5) Usuario
- Base: `/Usuario`

- GET `/Usuario` — lista todos.
- GET `/Usuario/{id}` — obter por id.
- POST `/Usuario` — criar. Body exemplo:

```json
{
  "nome": "João",
  "sobrenome": "Silva",
  "telefone": "(11) 99999-9999",
  "email": "joao@example.com",
  "senha": "senha123",
  "idIgreja": 1,
  "idTipoUsuario": 2
}
```

- PATCH `/Usuario/AtualizarUsuarioPorId{id}` — atualização parcial (enviar só campos a alterar). Exemplo:

```json
{
  "telefone": "(11) 98888-8888",
  "email": "novo@example.com"
}
```

- PUT `/Usuario` — atualização completa (body com `Id`).
- DELETE `/Usuario/{id}` — remover usuário.

Campos `UsuarioDTO`:
- `Id`, `Nome`, `Sobrenome`, `Telefone`, `Email`, `Senha`, `IdIgreja`, `IdTipoUsuario`.

Exemplos de respostas (sucesso)

```json
{
  "code": 1,
  "message": "Usuários listados com sucesso",
  "data": [ /* array de objetos */ ]
}
```

Exemplo de erro (não encontrado)

```json
{
  "code": 3,
  "message": "O usuário informado não existe",
  "data": null
}
```

Exemplo de erro interno (500)

```json
{
  "code": 6,
  "message": "Não foi possível cadastrar o usuário",
  "data": {
    "ErrorMessage": "Detalhes do erro...",
    "StackTrace": "..."
  }
}
```

Observações finais
- Verifique os DTOs em `Objects/Dtos/Entities/` para detalhes dos campos e tipos.
- Rotas `PATCH` usam segmentos customizados como `AtualizarUsuarioPorId{id}` — lembre-se de fornecer o `id` na URL.
- Se quiser que eu gere exemplos de curl/HTTPie ou Postman collection, me avise.

---
Gerado automaticamente: documentação básica de rotas para o projeto `f-backend-gestafe`.
