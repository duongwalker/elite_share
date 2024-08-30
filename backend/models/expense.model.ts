export interface ExpenseShare {
  user_id: number;
  amount: number;
}

export interface Expense {
  expense_id?: number
  group_id: number | null
  name?: string
  created_by: number
  amount: number
  description: string
  date: Date
  shares?: ExpenseShare[];
}
