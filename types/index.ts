export type Message = {
  id: string
  role: 'user' | 'assistant'
  content: string
}

export type User = {
  email: string
  id: string
}
