# Documentação

## Rotas de criação de cartões e gerenciamento de cartões:

### Rota **POST** `/cards`

Rota para criar cartões originais (físicos)

- Deve receber (pelo body da request), os parâmetros **employeeId** e **type**:

  ```jsx
  {
    employeeId: 1,
    type: "groceries"
  }
  ```

  - Formato esperado:

    ```jsx
    employeeId: number maior que 0,
    type: uma das seguintes strings: 'groceries', 'restaurant', 'transport', 'education', 'health'
    ```

  - Retorna `400` caso os dados estejam no formato incorreto

- Deve receber no headers uma `x-api-key` válida:
  ```jsx
  x-api-key: zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0
  ```
  - Retorna `400` caso não seja mandada no formato correto.
  - Retorna `401` caso não seja uma api-key cadastrada no banco
  - Retorna `404` caso não exista o `employeeId`
  - Retorna `409` caso o empregado já tenha um cartão com o `type` solicitado
- Retorna os dados do cartão criado:

  ```jsx
  {
    cardId: 1
    number: "8933 0179 8650 5801",
    cardholderName: "CICLANA M MADEIRA",
    securityCode: "591",
    expirationDate: "09/27",
    type: "transport"
  }
  ```

  ### Rota **POST** `/cards/virtual`

  Rota para criar cartões virtuais

- Deve receber (pelo body da request), os parâmetros **cardId** e **password**:

  ```jsx
  {
    cardId: 1,
    password: "1234"
  }
  ```

  - Formato esperado:

    ```jsx
    cardId: number maior que 0,
    password: string númerica de tamanho 4
    ```

  - Retorna `400` caso os dados estejam no formato incorreto
  - Retorna `401` caso a senha esteja incorreta
  - Retorna `403` caso seja passado um `cardId` de um cartão virtual **ou** caso o cartão não esteja ativado
  - Retorna `404` caso o `cardId` não exista

- Retorna os dados do cartão criado:
  ```jsx
  {
    cardId: 2,
    originalCardId: 1,
    number: "6771 8920 3306 5669",
    cardholderName: "FULANO R SILVA",
    securityCode: "602",
    expirationDate: "09/27",
    type: "restaurant"
  }
  ```

### Rota **DELETE** `/cards/virtual`

Rota para deletar cartões virtuais

- Deve receber (pelo body da request), os parâmetros **cardId** e **password**:

  ```jsx
  {
    cardId: 2,
    password: "1234"
  }
  ```

  - Formato esperado:

    ```jsx
    cardId: number maior que 0,
    password: string númerica de tamanho 4
    ```

  - Retorna `400` caso os dados estejam no formato incorreto
  - Retorna `401` caso a senha esteja incorreta
  - Retorna `404` caso o `cardId` não exista
  - Retorna `406` caso o `cardId` não seja de um cartão virtual

- Retorna status code `200`

### Rota **PATCH** `/cards/activate`

Rota para ativar cartões originais (físicos)

- Deve receber (pelo body da request), os parâmetros **cardId**, **securityCode** e **password**:

  ```jsx
  {
    cardId: 1,
    securityCode: "979",
    password: "1234"
  }
  ```

  - Formato esperado:

    ```jsx
    cardId: number maior que 0,
    securityCode: string númerica de tamanho 3,
    password: string númerica de tamanho 4
    ```

  - Retorna `400` caso os dados estejam no formato inválido
  - Retorna `404` caso não exista um `cardId` cadastrado
  - Retorna `403` caso seja um cartão virtual
  - Retorna `401` caso o `securityCode` esteja incorreto
  - Retorna `406` caso o cartão esteja expirado

- Retorna status code `200`

### Rota **PATCH** `/blocked`

Rota para bloquear cartões físicos e virtuais

- Deve receber (pelo body da request), os parâmetros **cardId** e **password**:

  ```jsx
  {
    cardId: 3,
    password: "1234"
  }
  ```

  - Formato esperado:

    ```jsx
    cardId: number maior que 0,
    password: string númerica de tamanho 4
    ```

  - Retorna `400` caso os dados estejam no formato inválido
  - Retorna `404` caso não exista um `cardId` cadastrado
  - Retorna `403` caso o cartão não esteja ativado
  - Retorna `401` caso a senha esteja incorreta
  - Retorna `406` caso o cartão esteja expirado
  - Retorna `409` caso o cartão já esteja bloqueado

- Retorna status code `200`

### Rota **PATCH** `/unlock`

Rota para desbloquear cartões físicos e virtuais

- Deve receber (pelo body da request), os parâmetros **cardId** e **password**:

  ```jsx
  {
    cardId: 3,
    password: "1234"
  }
  ```

  - Formato esperado:

    ```jsx
    cardId: number maior que 0,
    password: string númerica de tamanho 4
    ```

  - Retorna `400` caso os dados estejam no formato inválido
  - Retorna `404` caso não exista um `cardId` cadastrado
  - Retorna `403` caso o cartão não esteja ativado
  - Retorna `401` caso a senha esteja incorreta
  - Retorna `406` caso o cartão esteja expirado
  - Retorna `409` caso o cartão já esteja desbloqueado

- Retorna status code `200`

### Rota **GET** `/statement/:cardId`

Rota para buscar o extrato do cartão original (físico)

- Deve receber (pelo params da request), o parâmetro **cardId** (number maior que 0):

  - Retorna `400` caso os dados estejam no formato inválido
  - Retorna `404` caso não exista um `cardId` cadastrado

- Retorna status code `200` e:
  ```jsx
  {
  balance: 35000,
  transactions: [
  	{ id: 1, cardId: 1, businessId: 1, businessName: "DrivenEats", timestamp: "22/01/2022", amount: 5000 }
  ]
  recharges: [
  	{ id: 1, cardId: 1, timestamp: "21/01/2022", amount: 40000 }
  ]
  }
  ```
  - **Nota**: caso seja passado um `cardId` de um cartão virtual os dados retornados serão do cartão original

## Rotas de compra e recarga:

### Rota POST `/recharges`

Rota para recarregar cartões originais (físicos)

- Deve receber (pelo body da request), os parâmetros **cardId** e **amount** e a **x-api-key** no headers:

  - Deve receber no headers uma `x-api-key` válida:

    ```jsx
    x-api-key: zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0
    ```

    - Retorna `400` caso não seja mandada no formato correto.
    - Retorna `401` caso não seja uma api-key cadastrada no banco

  ```jsx
  {
    cardId: 3,
    amount: 1234
  }
  ```

  - Formato esperado:

    ```jsx
    cardId: number maior que 0,
    amount: número inteiro maior que 0
    ```

  - Retorna `400` caso os dados estejam no formato inválido
  - Retorna `403` caso o cartão não esteja ativado **ou** caso seja um cartão virtual
  - Retorna `404` caso não exista um `cardId` cadastrado
  - Retorna `406` caso o cartão esteja expirado

- Retorna status code `201`

### Rota POST `/payments`

Rota para compras em POS

- Deve receber (pelo body da request), os parâmetros **cardId**, **businessId**, **password** e **amount**:

  ```jsx
  {
  cardId: 3,
  businessId: 3,
  password: "1234",
  amount: 199
  }
  ```

  - Formato esperado:

    ```jsx
    cardId: number maior que 0,
    businessId: number maior que 0,
    password: string númerica de tamanho 4,
    amount: número inteiro maior que 0
    ```

  - Retorna `400` caso os dados estejam no formato inválido
  - Retorna `401` caso a senha esteja incorreta **ou** caso o cartão esteja bloqueado **ou** caso o `type` do cartão seja diferente do `type` do estabelecimento
  - Retorna `402` caso o saldo do cartão seja insuficiente para a compra
  - Retorna `403` caso o cartão não esteja ativado
  - Retorna `404` caso não exista um `cardId` cadastrado
  - Retorna `406` caso o cartão esteja expirado **ou** caso seja um cartão virtual

- Retorna status code `201`

### Rota POST `/payments/online`

Rota para compras online

- Deve receber (pelo body da request), os parâmetros **number**, **cardholderName**, **expirationDate**, **securityCode**, **businessId** e **amount**:

  ```jsx
  {
  number: "5423 0841 5808 1432",
  cardholderName: "FULANO R SILVA",
  expirationDate: "09/27",
  securityCode: "966",
  businessId: 3,
  amount: 199
  }
  ```

  - Formato esperado:

    ```jsx
    number: string númerica com tamanho 19 (16 números e 3 espaços),
    cardholderName: string,
    expirationDate: string no formato MM/YY
    securityCode: string númerica de tamanho 3,
    businessId: number maior que 0,
    amount: número inteiro maior que 0
    ```

  - Retorna `400` caso os dados estejam no formato inválido
  - Retorna `401` caso o cartão esteja bloqueado **ou** caso o `type` do cartão seja diferente do `type` do estabelecimento **ou** caso o `securityCode` esteja incorreto
  - Retorna `402` caso o saldo do cartão seja insuficiente para a compra
  - Retorna `403` caso o cartão não esteja ativado
  - Retorna `404` caso o `number`, `cardholderName` e `expirationDate` estejam incorretos
  - Retorna `406` caso o cartão esteja expirado **ou** caso seja um cartão virtual

- Retorna status code `201`
