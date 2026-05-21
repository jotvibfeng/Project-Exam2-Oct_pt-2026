interface Loginaction {
  email: string
  password: string
}

interface Registeraction {
  name: string
  email: string
  password: string
  venueManager?: boolean
}

const API_KEY = import.meta.env.VITE_API_KEY

interface AuthResponse {
  data: {
    name: string
    email: string
    accessToken: string
    venueManager: boolean
  }
}

export async function loginUser(
  credentials: Loginaction,
): Promise<AuthResponse> {
  const response = await fetch('https://v2.api.noroff.dev/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message ?? 'Failed to log in')
  }

  return response.json()
}

export async function registerUser(
  details: Registeraction,
): Promise<AuthResponse> {
  const response = await fetch('https://v2.api.noroff.dev/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Noroff-API-Key': API_KEY,
    },
    body: JSON.stringify(details),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.errors?.[0]?.message ?? 'Failed to register')
  }

  return response.json()
}
