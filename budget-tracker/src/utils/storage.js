const KEY = 'budget_tracker_v1'

export const DEFAULT_CATEGORIES = [
  { id: 'housing',       name: 'Housing',       color: '#7b6cf5', budget: 1200 },
  { id: 'food',          name: 'Food',           color: '#d4a96a', budget: 600  },
  { id: 'transport',     name: 'Transport',      color: '#4ec994', budget: 250  },
  { id: 'health',        name: 'Health',         color: '#e05c5c', budget: 150  },
  { id: 'entertainment', name: 'Entertainment',  color: '#5bc4d9', budget: 200  },
  { id: 'shopping',      name: 'Shopping',       color: '#d46ab3', budget: 300  },
  { id: 'savings',       name: 'Savings',        color: '#4ec994', budget: 500  },
  { id: 'other',         name: 'Other',          color: '#888580', budget: 100  },
]

export const DEFAULT_STATE = {
  categories: DEFAULT_CATEGORIES,
  transactions: [
    { id: 't1', amount: 1150, description: 'Monthly rent', categoryId: 'housing',  date: new Date().toISOString().split('T')[0], note: '' },
    { id: 't2', amount: 85,   description: 'Grocery run',  categoryId: 'food',     date: new Date().toISOString().split('T')[0], note: '' },
    { id: 't3', amount: 42,   description: 'Uber rides',   categoryId: 'transport',date: new Date().toISOString().split('T')[0], note: '' },
    { id: 't4', amount: 68,   description: 'Dinner out',   categoryId: 'food',     date: new Date().toISOString().split('T')[0], note: '' },
    { id: 't5', amount: 120,  description: 'New sneakers', categoryId: 'shopping', date: new Date().toISOString().split('T')[0], note: '' },
  ],
  settings: {
    currency: 'USD',
    name: '',
  },
}

export function loadState() {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return DEFAULT_STATE
    return JSON.parse(raw)
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state))
  } catch {}
}

export function clearState() {
  localStorage.removeItem(KEY)
}
