import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center px-4 py-16">
      <h1 className="text-4xl font-extrabold text-text-heading">404</h1>
      <p className="mt-2 text-lg text-text-body">Page not found.</p>
      <Link href="/" className="btn-primary mt-6">
        Back to Home
      </Link>
    </div>
  )
}
