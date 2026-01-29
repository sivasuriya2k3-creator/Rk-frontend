const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002'

export const apiClient = {
  async get(endpoint: string) {
    const response = await fetch(`${API_URL}/api${endpoint}`)
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  },

  async post(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  },

  async put(endpoint: string, data: any) {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  },

  async delete(endpoint: string) {
    const response = await fetch(`${API_URL}/api${endpoint}`, {
      method: 'DELETE'
    })
    if (!response.ok) throw new Error(`API Error: ${response.statusText}`)
    return response.json()
  }
}