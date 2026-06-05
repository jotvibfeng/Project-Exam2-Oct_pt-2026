import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useForm } from '@tanstack/react-form'
import { registerUser } from '#/services/auth.services'
import { z } from 'zod'

const formSchema = z.object({
  name: z
    .string()
    .min(1)
    .regex(/^\w+$/, { message: 'Name must contain only letters and numbers' }),
  email: z.string().email().endsWith('@stud.noroff.no', {
    message: 'The email must have a @stud.noroff.no',
  }),
  password: z
    .string()
    .min(8, { message: 'Must have minimum 8 characters' })
    .regex(/[!@#$%^&*]/, {
      message: 'Must contain at least one symbol (!@#$%^&*)',
    }),
  venueManager: z.boolean(),
})

export const Route = createFileRoute('/register')({
  component: RegisterComponent,
})

function RegisterComponent() {
  const navigate = useNavigate()

  const { Field, handleSubmit } = useForm({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      venueManager: false,
    },
    onSubmit: async ({ value }) => {
      await registerUser(value)
      navigate({ to: '/profile' })
      const res = await registerUser(value)
      localStorage.setItem('token', res.data.accessToken)
      localStorage.setItem('user', JSON.stringify(res.data))
    },
    validators: {
      onSubmit: formSchema,
    },
  })

  return (
    <main className="page-wrap px-4 py-12">
      <h1 className="island-headline mb-4 text-center">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          handleSubmit()
        }}
        className="max-w-md mx-auto flex flex-col gap-4"
      >
        <Field
          name="name"
          validators={{
            onChange: ({ value }) => {
              if (value.length > 0 && value.length < 5) {
                return 'Must have minimum 5 characters'
              }
            },
          }}
          children={(field) => (
            <div>
              <label htmlFor="name" className="block text-sm font-medium">
                Name
              </label>
              <input
                type="text"
                id="name"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  {(field.state.meta.errors[0] as any)?.message ??
                    String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />
        <Field
          name="email"
          validators={{
            onChange: ({ value }) => {
              if (!value.endsWith('@stud.noroff.no')) {
                return 'The email must have a @stud.noroff.no'
              }
            },
          }}
          children={(field) => (
            <div>
              <label htmlFor="email" className="block text-sm font-medium">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                placeholder="student@stud.noroff.no"
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />
        <Field
          name="password"
          validators={{
            onChange: ({ value }) => {
              if (value.length > 0 && value.length < 8) {
                return 'Must have minimum 8 characters'
              }
              if (!/[!@#$%^&*]/.test(value)) {
                return 'Must contain at least one symbol (!@#$%^&*)'
              }
            },
          }}
          children={(field) => (
            <div>
              <label htmlFor="password" className="block text-sm font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                required
                className="mt-1 block w-full rounded-md border px-3 py-2"
              />
              {field.state.meta.errors.length > 0 && (
                <p className="text-sm text-red-600 mt-1">
                  {String(field.state.meta.errors[0])}
                </p>
              )}
            </div>
          )}
        />
        <Field
          name="venueManager"
          children={(field) => (
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={field.state.value}
                onChange={(e) => field.handleChange(e.target.checked)}
              />
              Register as Venue Manager
            </label>
          )}
        />

        <button
          type="submit"
          className="w-full py-2 px-4 rounded-md text-white bg-[#2f4858] hover:bg-[#4e6c7f] transition text-center"
        >
          Register
        </button>
      </form>
    </main>
  )
}
