export interface Expense {
  expense_id: number
  group_id: number | null
  created_by: number
  amount: number
  description: string
}
