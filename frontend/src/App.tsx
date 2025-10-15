import React, { useEffect, useMemo, useState } from 'react'

type Todo = {
  id: number
  title: string
  completed: boolean
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([])
  const [title, setTitle] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const baseUrl = useMemo(() => API_URL.replace(/\/$/, ''), [])

  async function fetchTodos() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/api/todos`)
      if (!res.ok) throw new Error('Failed to load todos')
      const data: Todo[] = await res.json()
      setTodos(data)
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = title.trim()
    if (!trimmed) return
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/api/todos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: trimmed })
      })
      if (!res.ok) throw new Error('Failed to add todo')
      const created: Todo = await res.json()
      setTodos(prev => [created, ...prev])
      setTitle('')
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    }
  }

  async function toggleTodo(todo: Todo) {
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed: !todo.completed })
      })
      if (!res.ok) throw new Error('Failed to update todo')
      const updated: Todo = await res.json()
      setTodos(prev => prev.map(t => (t.id === updated.id ? updated : t)))
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    }
  }

  async function deleteTodo(id: number) {
    setError(null)
    try {
      const res = await fetch(`${baseUrl}/api/todos/${id}`, { method: 'DELETE' })
      if (!res.ok && res.status !== 204) throw new Error('Failed to delete todo')
      setTodos(prev => prev.filter(t => t.id !== id))
    } catch (e: any) {
      setError(e.message || 'Unknown error')
    }
  }

  useEffect(() => {
    fetchTodos()
  }, [])

  return (
    <div style={{ maxWidth: 560, margin: '40px auto', padding: 16, fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial' }}>
      <h1>Todo List</h1>
      <form onSubmit={addTodo} style={{ display: 'flex', gap: 8 }}>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Add a task"
          style={{ flex: 1, padding: 10, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: '10px 14px' }}>Add</button>
      </form>
      {error && <div style={{ color: 'crimson', marginTop: 8 }}>{error}</div>}
      {loading ? (
        <div style={{ marginTop: 16 }}>Loading…</div>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0, marginTop: 16 }}>
          {todos.map(t => (
            <li key={t.id} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 0', borderBottom: '1px solid #eee' }}>
              <input type="checkbox" checked={t.completed} onChange={() => toggleTodo(t)} />
              <span style={{ textDecoration: t.completed ? 'line-through' : 'none', flex: 1 }}>{t.title}</span>
              <button onClick={() => deleteTodo(t.id)} style={{ padding: '6px 10px' }}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}


