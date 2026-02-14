import Link from 'next/link'
import { getCustodyTypes, getMeta } from '@/lib/providers'
import EmailCapture from '@/components/EmailCapture'

export default function Footer() {
  const types = getCustodyTypes()
  const meta = getMeta()

  return (
    <footer className="bg-navy-dark text-gray-400">
      <div className="container-main pb-8 pt-16">
        <div className="grid gap-10 md:grid-cols-4">
          <div>
            <Link href="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
                <svg className="h-4 w-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-lg font-extrabold text-white">
                Custody<span className="text-brand-light">Compare</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-gray-500">
              Independent Bitcoin custody comparison. Transparent scoring methodology. Zero bias.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">Custody Types</h4>
            <ul className="space-y-2.5">
              {types.map((t) => (
                <li key={t.id}>
                  <Link href={`/custody-type/${t.id}`} className="text-sm transition-colors hover:text-brand-light">{t.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">Tools</h4>
            <ul className="space-y-2.5">
              <li><Link href="/tools/fee-calculator" className="text-sm transition-colors hover:text-brand-light">Fee Calculator</Link></li>
              <li><Link href="/tools/risk-score" className="text-sm transition-colors hover:text-brand-light">Custody Risk Quiz</Link></li>
              <li><Link href="/tools/compare" className="text-sm transition-colors hover:text-brand-light">Head-to-Head Comparator</Link></li>
              <li><Link href="/tools/decision-tree" className="text-sm transition-colors hover:text-brand-light">Decision Tree</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-xs font-bold uppercase tracking-[0.15em] text-gray-300">Resources</h4>
            <ul className="space-y-2.5">
              <li><Link href="/guides/what-is-bitcoin-custody" className="text-sm transition-colors hover:text-brand-light">What is Bitcoin Custody?</Link></li>
              <li><Link href="/guides/how-to-choose-a-custodian" className="text-sm transition-colors hover:text-brand-light">How to Choose a Custodian</Link></li>
              <li><Link href="/guides/multi-institution-custody-explained" className="text-sm transition-colors hover:text-brand-light">Multi-Institution Custody</Link></li>
            </ul>
          </div>
        </div>

        {/* Email Capture */}
        <div className="mt-12 border-t border-white/5 pt-10">
          <div className="mx-auto max-w-sm">
            <EmailCapture variant="dark" />
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center gap-4 border-t border-white/5 pt-8 sm:flex-row sm:justify-between">
          <p className="text-xs text-gray-600">
            &copy; {new Date().getFullYear()} CustodyCompare. For informational purposes only. Not financial advice.
          </p>
          <p className="text-xs text-gray-600">
            Tracking <span className="font-medium text-gray-400">{meta.totalProviders}</span> custodians &middot; <span className="font-medium text-gray-400">8</span> criteria &middot; Updated <span className="font-medium text-gray-400">{meta.lastUpdated}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
