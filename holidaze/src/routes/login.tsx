import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { loginUser } from '#/services/auth.services'
import { z } from 'zod'
import ErrorMessage from '#/components/errorHandel'
import { useMutation } from '@tanstack/react-query'

export const Route = createFileRoute('/login')({
  component: RouteLogin,
})

const fromSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
})

function RouteLogin() {
  const navigate = useNavigate()

  const { mutate, isPending, isError, error } = useMutation({
    mutationFn: loginUser,
    onSuccess: (res) => {
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data))
      window.dispatchEvent(new Event('storage'))
      navigate({ to: '/' })
    },
  })

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      mutate(value)
    },
    validators: {
      onSubmit: fromSchema,
    },
  })

  return (
    <main className="min-h-[calc(100vh-73px)]">
      <div className="flex min-h-[calc(100vh-73px)] flex-col md:flex-row">
        <div className="relative h-56 w-full sm:h-72 md:h-auto md:w-1/2">
          <img
            src="/pexels-asadphoto-9470485.jpg"
            alt="Holidaze"
            className="h-full w-full object-cover"
          />
          <h1 className="absolute inset-0 flex items-center justify-center px-4 text-center text-3xl font-bold text-white sm:text-4xl md:text-5xl">
            Welcome to Holidaze
          </h1>
        </div>

        <div className="flex w-full flex-1 flex-col justify-center bg-[#999292] p-6 sm:p-10 md:w-1/2 md:p-20">
          <div className="mx-auto flex w-full max-w-md flex-col">
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
              <ErrorMessage message={isError ? error.message : undefined} />
              <button
                type="submit"
                disabled={isPending}
                className="w-full py-3 mt-2 rounded-lg bg-white text-[#999292] font-semibold hover:bg-white/90 transition"
              >
                {isPending ? 'Logging in...' : 'Login'}
              </button>
              <p className="text-sm text-white/90 text-center mt-2">
                Don't have an account?{' '}
                <Link
                  to="/register"
                  className="underline hover:opacity-70 transition"
                  style={{ color: 'white' }}
                >
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
