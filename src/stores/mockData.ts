export const MOCK_CUSTOMERS = [
  {
    id: '1',
    name: 'Construtora Alpha Ltda',
    document: '12.345.678/0001-90',
    phone: '(11) 98765-4321',
    email: 'contato@alpha.com.br',
  },
  {
    id: '2',
    name: 'João Silva Reformas',
    document: '123.456.789-00',
    phone: '(11) 91234-5678',
    email: 'joao.reformas@email.com',
  },
  {
    id: '3',
    name: 'Engenharia Omega',
    document: '98.765.432/0001-10',
    phone: '(21) 99999-8888',
    email: 'compras@omega.eng.br',
  },
]

export const MOCK_INVENTORY = [
  {
    id: '1',
    code: 'FUR-001',
    name: 'Furadeira de Impacto Bosch',
    category: 'Ferramentas',
    totalQty: 15,
    availableQty: 12,
    rentedQty: 3,
    conditionStatus: 'Disponível',
    image: 'https://img.usecurling.com/p/200/200?q=drill&color=blue',
  },
  {
    id: '2',
    code: 'AND-002',
    name: 'Andaime Tubular 1x1.5m',
    category: 'Estruturas',
    totalQty: 50,
    availableQty: 20,
    rentedQty: 30,
    conditionStatus: 'Disponível',
    image: 'https://img.usecurling.com/p/200/200?q=scaffolding&color=gray',
  },
  {
    id: '3',
    code: 'BET-001',
    name: 'Betoneira 400L',
    category: 'Máquinas Pesadas',
    totalQty: 5,
    availableQty: 1,
    rentedQty: 4,
    conditionStatus: 'Manutenção',
    image: 'https://img.usecurling.com/p/200/200?q=cement%20mixer&color=yellow',
  },
  {
    id: '4',
    code: 'MAR-003',
    name: 'Martelete Rompedor',
    category: 'Ferramentas',
    totalQty: 8,
    availableQty: 8,
    rentedQty: 0,
    conditionStatus: 'Disponível',
    image: 'https://img.usecurling.com/p/200/200?q=jackhammer&color=red',
  },
]

const today = new Date()
const yesterday = new Date(today)
yesterday.setDate(today.getDate() - 1)
const tomorrow = new Date(today)
tomorrow.setDate(today.getDate() + 2)
const lastWeek = new Date(today)
lastWeek.setDate(today.getDate() - 7)

export const MOCK_RENTALS = [
  {
    id: 'LOC-0001',
    customerId: '1',
    items: [
      { itemId: '2', qty: 20 },
      { itemId: '3', qty: 2 },
    ],
    startDate: lastWeek.toISOString().split('T')[0],
    expectedReturnDate: tomorrow.toISOString().split('T')[0],
    status: 'Ativo',
    total: 1500.0,
  },
  {
    id: 'LOC-0002',
    customerId: '2',
    items: [{ itemId: '1', qty: 3 }],
    startDate: lastWeek.toISOString().split('T')[0],
    expectedReturnDate: yesterday.toISOString().split('T')[0],
    status: 'Atrasado',
    total: 250.0,
  },
  {
    id: 'LOC-0003',
    customerId: '3',
    items: [{ itemId: '3', qty: 2 }],
    startDate: '2023-09-01',
    expectedReturnDate: '2023-09-15',
    actualReturnDate: '2023-09-14',
    status: 'Devolvido',
    total: 3000.0,
  },
  {
    id: 'LOC-0004',
    customerId: '1',
    items: [{ itemId: '4', qty: 1 }],
    startDate: lastWeek.toISOString().split('T')[0],
    expectedReturnDate: today.toISOString().split('T')[0],
    status: 'Ativo',
    total: 120.0,
  },
]

export const MOCK_USERS = [
  {
    id: '1',
    name: 'Admin Silva',
    email: 'admin@loja.com.br',
    role: 'Administrador',
    active: true,
  },
  {
    id: '2',
    name: 'Operador João',
    email: 'joao@loja.com.br',
    role: 'Operador',
    active: true,
  },
]

export const MOCK_SETTINGS = {
  primaryColor: '#1e40af',
  logoUrl: null as string | null,
  contractFileName: null as string | null,
  lateFeeType: 'daily',
  lateFeeValue: 2,
  companyName: 'LocaWeb Gestão de Ativos LTDA',
  companyDocument: '00.000.000/0001-00',
  companyAddress: 'Av. Central, 1000 - Centro, São Paulo/SP',
}
