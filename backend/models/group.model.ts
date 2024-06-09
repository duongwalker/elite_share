export interface Group {
  group_id: number
  group_name: string
  created_by: number // FK to Users
}

