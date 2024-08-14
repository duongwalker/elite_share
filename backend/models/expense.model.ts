export interface ExpenseShare {
  expense_id?: number;
  user_id: number;
  amount: number;
}

export interface Expense {
  expense_id?: number
  group_id: number | null
  created_by: number
  amount: number
  description: string
  date: Date
  shares?: ExpenseShare[];
}
