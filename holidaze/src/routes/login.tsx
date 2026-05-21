import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { loginUser } from '#/services/auth.services'
import { z } from 'zod'

export const Route = createFileRoute('/login')({
  component: RouteLogin,
})

const fromSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function RouteLogin() {
  const navigate = useNavigate()

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      const res = await loginUser(value)
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data))
      window.dispatchEvent(new Event('storage'))
      navigate({ to: '/' })
    },
    validators: {
      onSubmit: fromSchema,
    },
  })

  return (
    <main className="h-screen">
      <div className="w-full h-screen flex">
        {/* Left half */}
        <div className="w-1/2 h-full flex flex-col bg-[#acac9a] items-center justify-center"></div>

        {/* Right half */}
        <div className="w-1/2 h-full bg-[#999292] flex flex-col p-20 justify-center">
          <div className="w-full flex flex-col max-w-450px mx-auto">
            <div className="w-full flex flex-col mb-10 text-white">
              <h3 className="text-4xl font-bold mb-2">Login</h3>
              <p className="text-lg mb-4">
                Welcome Back! Please enter your details.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSubmit()
              }}
              className="flex flex-col gap-4"
            >
              <Field name="email">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white font-medium">
                      Email
                    </label>
                    <input
                      type="email"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="student@stud.noroff.no"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
                    />
                  </div>
                )}
              </Field>
              <Field name="password">
                {(field) => (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm text-white font-medium">
                      Password
                    </label>
                    <input
                      type="password"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:border-white"
                    />
                  </div>
                )}
              </Field>
              <button
                type="submit"
                className="w-full py-3 mt-2 rounded-lg bg-white text-[#999292] font-semibold hover:bg-white/90 transition"
              >
                Login
              </button>
              <p className="text-sm text-white/70 text-center mt-2">
                Don't have an account?{' '}
                <Link to="/register" className="text-white underline">
                  Register
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
