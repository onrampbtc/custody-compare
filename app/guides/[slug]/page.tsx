import { Metadata } from 'next'
import Link from 'next/link'
import { getProviders } from '@/lib/providers'
import { rankProviders } from '@/lib/scoring'
import EmailCapture from '@/components/EmailCapture'
import { breadcrumbSchema } from '@/lib/seo'

interface GuideData {
  slug: string
  title: string
  description: string
  content: string
  relatedTypes: string[]
}

const GUIDES: GuideData[] = [
  {
    slug: 'what-is-bitcoin-custody',
    title: 'What is Bitcoin Custody?',
    description: 'Everything you need to know about securing your Bitcoin — from self-custody to institutional solutions.',
    content: `Bitcoin custody refers to how your Bitcoin private keys — and therefore your Bitcoin — are stored and secured. Whoever controls the private keys controls the Bitcoin. This fundamental concept drives every custody decision.

## Why Custody Matters

When you buy Bitcoin on an exchange, the exchange holds the private keys. This means you're trusting the exchange to safeguard your assets. History has shown this trust can be misplaced: Mt. Gox (2014), QuadrigaCX (2019), FTX (2022), and Celsius (2022) all resulted in users losing access to their Bitcoin.

## Types of Bitcoin Custody

There are six main approaches to Bitcoin custody, each with different tradeoffs between security, convenience, and control:

**Multi-Institution Custody** distributes your Bitcoin across multiple independent custodians. No single entity can compromise your holdings. This is the most resilient institutional model.

**Self-Custody** means you hold your own private keys, typically using hardware wallets and multisignature setups. Maximum sovereignty, maximum responsibility.

**Exchange Custody** is the simplest approach — you buy Bitcoin and leave it on the exchange. Convenient but introduces significant counterparty risk.

**Qualified Custodians** are regulated financial institutions meeting SEC requirements. They provide institutional-grade security, insurance, and compliance.

**Cold Storage** keeps your private keys on devices that never connect to the internet. Air-gapped security for long-term holdings.

**Collaborative Custody** splits keys between you and a service provider. You maintain control while having a professional backup.

## How to Choose

The right custody solution depends on your specific situation — how much Bitcoin you hold, your technical expertise, regulatory requirements, and how often you need access. Our interactive tools can help you decide.`,
    relatedTypes: ['multi-institution', 'self-custody', 'qualified-custodian'],
  },
  {
    slug: 'how-to-choose-a-custodian',
    title: 'How to Choose a Bitcoin Custodian',
    description: 'A framework for evaluating custody providers across security, insurance, fees, and regulatory compliance.',
    content: `Choosing a Bitcoin custodian is one of the most important decisions you'll make as a Bitcoin holder. The wrong choice can mean losing everything. Here's a systematic framework for evaluating providers.

## The 8 Criteria That Matter

We evaluate every custodian across eight weighted criteria:

**1. Security (20% weight)** — How are private keys managed? What physical and cyber security controls exist? Is there multi-signature or MPC technology?

**2. Insurance (15%)** — What coverage exists? Who is the carrier? What events are covered and what are the exclusions?

**3. Regulatory Compliance (15%)** — Is the custodian a qualified custodian? What licenses do they hold? In what jurisdictions?

**4. Track Record (15%)** — How long have they operated? Any security incidents? What is their reputation?

**5. Fee Transparency (10%)** — Are fees clearly published? Or do you need to "contact sales"? Opaque pricing is itself a red flag.

**6. Withdrawal Flexibility (10%)** — How quickly can you access your Bitcoin? Are there withdrawal limits or delays?

**7. Reporting & Audit (10%)** — SOC compliance? Regular audits? Quality of reporting for tax and compliance?

**8. Counterparty Diversification (5%)** — Is your Bitcoin with one entity or distributed across multiple?

## Red Flags to Watch For

- No published fee schedule
- No proof of reserves or audit
- Yield programs using your deposited Bitcoin
- No insurance or vague insurance claims
- Unregulated or offshore-only jurisdiction`,
    relatedTypes: ['qualified-custodian', 'multi-institution'],
  },
  {
    slug: 'multi-institution-custody-explained',
    title: 'Multi-Institution Custody Explained',
    description: 'Why distributing assets across multiple custodians eliminates single points of failure.',
    content: `Multi-institution custody is the practice of distributing your Bitcoin across multiple independent, regulated custodians rather than trusting a single entity. It emerged as a direct response to catastrophic single-custodian failures.

## The Problem with Single Custodians

When all your Bitcoin sits with one custodian, you face concentrated risk. If that custodian is hacked, goes bankrupt, freezes withdrawals, or is seized by regulators, you could lose everything. FTX held billions in customer assets — all gone overnight.

## How Multi-Institution Custody Works

Instead of depositing everything with one provider, multi-institution custody distributes your assets across multiple independent custodians. If one fails, the others remain unaffected. This is the same principle behind diversification in traditional finance.

## Key Benefits

- **No single point of failure** — One custodian compromised doesn't mean total loss
- **Aggregated insurance** — Combined coverage across custodians exceeds any single policy
- **Regulatory diversification** — Multiple regulated entities across jurisdictions
- **Reduced counterparty risk** — No single entity controls all your Bitcoin

## Who Should Consider It

Multi-institution custody is ideal for family offices, institutions, RIAs, and high-net-worth individuals who cannot afford single-custodian risk. If you have over $100K in Bitcoin, the added resilience is worth considering.`,
    relatedTypes: ['multi-institution'],
  },
  {
    slug: 'custody-after-ftx-celsius-lessons',
    title: 'Custody After FTX & Celsius — Lessons Learned',
    description: 'What the FTX and Celsius collapses teach us about Bitcoin custody and counterparty risk.',
    content: `The collapses of FTX and Celsius in 2022 were watershed moments for Bitcoin custody. Billions in customer assets vanished. The lessons are clear and permanent.

## What Happened

FTX, once valued at $32 billion, filed for bankruptcy in November 2022. Customer funds had been commingled with Alameda Research. Users who trusted FTX lost access to their assets. Celsius, a crypto lending platform, froze withdrawals in June 2022 and filed for bankruptcy shortly after. Both cases shared a common factor: users trusted a single entity with their Bitcoin.

## The Core Lesson

Counterparty risk is the single greatest threat to your Bitcoin. Not hacking, not market volatility — the risk that the entity holding your Bitcoin fails, steals, or mismanages it.

## What Changed

Post-FTX, the industry has shifted toward:
- **Proof of reserves** — Verifiable evidence that custodians hold what they claim
- **Segregated accounts** — Customer assets kept separate from company operations
- **Multi-custodian models** — Distributing across multiple independent entities
- **Self-custody growth** — Hardware wallet sales surged after FTX

## How to Protect Yourself

The safest approach combines regulatory oversight, insurance, and diversification. Whether you self-custody, use a qualified custodian, or choose multi-institution custody, the key is eliminating single points of failure.`,
    relatedTypes: ['multi-institution', 'self-custody', 'collaborative-custody'],
  },
  {
    slug: 'self-custody-vs-third-party',
    title: 'Self-Custody vs Third-Party Custody',
    description: 'Comparing the trade-offs between holding your own Bitcoin keys and using a professional custodian.',
    content: `The debate between self-custody and third-party custody is fundamental to Bitcoin. "Not your keys, not your coins" is a core Bitcoin principle — but is it always the right choice?

## Self-Custody: Maximum Sovereignty

Self-custody means you control your own private keys. Nobody can freeze your assets, deny withdrawals, or lose your Bitcoin through mismanagement. You are fully sovereign.

The tradeoff is responsibility. If you lose your keys or seed phrase, your Bitcoin is gone forever. There is no customer support to call. No recovery process. This responsibility is significant.

## Third-Party Custody: Professional Security

Third-party custodians — whether exchanges, qualified custodians, or multi-institution providers — manage your keys professionally. They offer insurance, regulatory compliance, and recovery processes.

The tradeoff is trust. You must trust the custodian to remain solvent, honest, and secure.

## The Middle Ground: Collaborative Custody

Collaborative custody bridges both worlds. In a 2-of-3 multisig setup, you hold 2 keys and the provider holds 1. You can always move funds independently, but the provider can assist with recovery.

## How to Decide

Consider your technical expertise, the amount of Bitcoin you hold, your need for regulatory compliance, and your risk tolerance. There is no universally correct answer.`,
    relatedTypes: ['self-custody', 'collaborative-custody', 'qualified-custodian'],
  },
  {
    slug: 'custody-for-family-offices',
    title: 'Bitcoin Custody for Family Offices',
    description: 'How family offices should approach Bitcoin custody — balancing security, compliance, and generational planning.',
    content: `Family offices managing Bitcoin face unique challenges: generational time horizons, complex governance structures, regulatory requirements, and the need for absolute security. Here's how to approach Bitcoin custody as a family office.

## Why Family Offices Need Different Solutions

Family offices aren't day-trading. They're preserving wealth across generations. This means custody solutions must be resilient to: custodian bankruptcy, key person risk, regulatory changes, and technological obsolescence.

## Multi-Institution Custody for Family Offices

Multi-institution custody is increasingly popular among family offices because it eliminates single-custodian risk while maintaining institutional-grade compliance. Assets are distributed across multiple regulated custodians.

## Key Considerations

- **Governance** — Multi-signature setups can require multiple family members or advisors to authorize transactions
- **Inheritance** — Custody solutions must support clean generational transfer
- **Reporting** — Family offices need consolidated reporting across custodians
- **Insurance** — Coverage should scale with holdings
- **Regulatory** — Some family offices require qualified custodians for fiduciary compliance

## Recommended Approach

Most family offices benefit from either multi-institution custody (for passive holding) or a qualified custodian with strong governance features. The minimum recommended holdings for institutional custody solutions typically start at $100K–$500K.`,
    relatedTypes: ['multi-institution', 'qualified-custodian'],
  },
  {
    slug: 'custody-for-rias-and-advisors',
    title: 'Bitcoin Custody for RIAs and Financial Advisors',
    description: 'Regulatory requirements and best practices for RIAs custodying Bitcoin on behalf of clients.',
    content: `Registered Investment Advisors (RIAs) face specific regulatory requirements when custodying Bitcoin for clients. Understanding these requirements is essential for compliant Bitcoin allocation.

## The Qualified Custodian Requirement

Under the SEC's Custody Rule, RIAs with custody of client assets must use a qualified custodian. This applies to Bitcoin and other digital assets. A qualified custodian is typically a bank, broker-dealer, or trust company.

## Which Custodians Qualify

Not all Bitcoin custody providers are qualified custodians. Key qualified custodians for Bitcoin include: Fidelity Digital Assets, Coinbase Custody, Anchorage Digital, BitGo Trust, and Gemini Custody. Each holds relevant state or federal charters.

## Multi-Institution Considerations

Some RIAs are exploring multi-institution custody to reduce single-custodian risk for client assets. This approach distributes Bitcoin across multiple qualified custodians, aligning with fiduciary duty to minimize risk.

## Practical Steps for RIAs

1. Verify your chosen custodian meets qualified custodian requirements
2. Ensure adequate insurance coverage
3. Establish clear custody agreements and SLAs
4. Implement reporting workflows for client statements
5. Consider multi-custodian diversification for large allocations`,
    relatedTypes: ['qualified-custodian', 'multi-institution'],
  },
  {
    slug: 'bitcoin-custody-insurance-explained',
    title: 'Bitcoin Custody Insurance Explained',
    description: 'How custody insurance works, what it covers, and why coverage amounts matter.',
    content: `Insurance is one of the most important — and least understood — aspects of Bitcoin custody. Not all insurance is created equal, and the details matter enormously.

## What Custody Insurance Covers

Typical custody insurance covers loss of Bitcoin due to: external theft (hacking), internal theft (employee malfeasance), and sometimes physical security breaches. It generally does not cover market losses, regulatory actions, or losses from user error.

## Coverage Amounts

Coverage varies dramatically across providers. Some examples: BitGo carries a $250M policy through Lloyd's of London. Fidelity Digital Assets reportedly has up to $1B in coverage. Coinbase has significant coverage but doesn't publicly disclose exact amounts.

## Key Questions to Ask

- What is the total policy limit?
- Is coverage per-client or aggregate across all clients?
- What specific events are covered?
- Who is the insurance carrier?
- Are there exclusions for certain types of loss?

## Why Multi-Institution Custody Improves Insurance

When Bitcoin is distributed across multiple custodians, insurance is aggregated. Each custodian's policy covers the portion they hold. Total coverage often exceeds what any single custodian offers.`,
    relatedTypes: ['qualified-custodian', 'multi-institution'],
  },
  {
    slug: 'hardware-wallets-vs-institutional-custody',
    title: 'Hardware Wallets vs Institutional Custody',
    description: 'When to use hardware wallets and when to graduate to institutional custody solutions.',
    content: `Hardware wallets and institutional custody serve different needs. Understanding when to use each — or both — is key to protecting your Bitcoin.

## Hardware Wallets: The Starting Point

Hardware wallets (Ledger, Trezor, Coldcard, etc.) are physical devices that store your private keys offline. They're the gold standard for individual self-custody. For holdings under $100K, a hardware wallet with a proper seed phrase backup is often sufficient.

## When to Consider Institutional Custody

As your Bitcoin holdings grow, the risk profile changes. Consider institutional custody when: your holdings exceed $100K, you need regulatory compliance, inheritance planning becomes important, or you want professional insurance coverage.

## The Comparison

**Hardware Wallets:** Low cost, full control, no counterparty risk, but no insurance, no recovery if keys lost, inheritance is complex.

**Institutional Custody:** Insurance coverage, regulatory compliance, professional security, recovery processes, but counterparty risk, ongoing fees, less direct control.

## The Hybrid Approach

Many sophisticated holders use both: hardware wallets for a portion they want to control directly, and institutional or collaborative custody for the bulk of their holdings.`,
    relatedTypes: ['cold-storage', 'self-custody', 'qualified-custodian'],
  },
  {
    slug: 'bitcoin-inheritance-planning',
    title: 'Bitcoin Inheritance Planning',
    description: 'How to ensure your Bitcoin can be passed to heirs without losing access.',
    content: `Bitcoin inheritance is one of the hardest problems in cryptocurrency. If your heirs don't know how to access your Bitcoin — or even that it exists — it could be lost forever.

## The Problem

Unlike traditional assets, Bitcoin doesn't have a bank that can transfer ownership when you die. If your private keys die with you, your Bitcoin is permanently inaccessible. An estimated 3-4 million Bitcoin are already lost this way.

## Solutions by Custody Type

**Self-Custody:** Store seed phrases in a secure location with detailed instructions. Consider using a multisig setup where your estate attorney holds one key. Some users store instructions in safety deposit boxes or with trusted family members.

**Collaborative Custody:** Services like Unchained and Casa offer inheritance-specific features. Casa's Covenant protocol is designed specifically for this. Unchained can assist beneficiaries with key recovery.

**Institutional Custody:** Qualified custodians handle inheritance through standard estate processes. This is the simplest approach for heirs who aren't technically savvy.

## Best Practices

1. Document your custody setup thoroughly
2. Ensure at least two trusted people know Bitcoin exists
3. Use a custody solution with inheritance features
4. Update your estate plan to include digital assets
5. Test the inheritance process with your executor`,
    relatedTypes: ['collaborative-custody', 'self-custody', 'qualified-custodian'],
  },
  {
    slug: 'qualified-custodian-requirements',
    title: 'Qualified Custodian Requirements for Bitcoin',
    description: 'What makes a custodian "qualified" under SEC rules and why it matters for institutions.',
    content: `The term "qualified custodian" has specific legal meaning under SEC regulations. Understanding these requirements is critical for institutions, RIAs, and funds holding Bitcoin.

## Legal Definition

Under the SEC's Custody Rule (Rule 206(4)-2 of the Investment Advisers Act), a qualified custodian is: a bank or savings association, a registered broker-dealer, a registered futures commission merchant, or a foreign financial institution that customarily holds financial assets for its customers.

## Why It Matters

RIAs with custody of client assets must use a qualified custodian. This is a regulatory requirement, not a preference. Using a non-qualified custodian can result in regulatory action.

## Bitcoin Qualified Custodians

Several Bitcoin custodians have achieved qualified custodian status: Fidelity Digital Assets (OCC national trust charter), Coinbase Custody (NY Trust Charter), Anchorage Digital (OCC national trust charter), BitGo Trust (SD Trust Charter), Gemini Custody (NY Trust Charter), and Bakkt Trust (NY Trust Charter).

## Multi-Institution and Qualified Custodian Status

Multi-institution custody providers like Onramp achieve qualified custodian status through their underlying custodian partnerships, with each custodian independently regulated.`,
    relatedTypes: ['qualified-custodian', 'multi-institution'],
  },
  {
    slug: 'bitcoin-custody-fees-explained',
    title: 'Bitcoin Custody Fees Explained',
    description: 'A breakdown of custody fee structures — annual fees, setup costs, transaction fees, and hidden costs.',
    content: `Understanding custody fees is essential for choosing the right provider. Fee structures vary dramatically, and the cheapest option isn't always the best value.

## Common Fee Types

**Setup Fees:** One-time charges for onboarding. Range from free (Unchained basic) to $10,000+ (Coinbase Custody).

**Annual Custody Fees:** Ongoing charges for holding your Bitcoin. Typically 0.10% to 1.2% of AUM annually. Some providers charge flat fees instead (e.g., Unchained at $250-1,200/year).

**Transaction Fees:** Charges for buying, selling, or moving Bitcoin. Range from network fees only (self-custody) to 1%+ spreads (retail exchanges).

**Withdrawal Fees:** Charges for moving Bitcoin out. Usually network fees plus a processing fee.

## Fee Transparency as a Signal

Providers who publish their fees demonstrate confidence in their pricing. "Contact for pricing" often means: higher than you expect, negotiable based on AUM, or complex fee structures with hidden costs. We consider fee transparency one of our eight scoring criteria.

## Comparing Total Cost of Ownership

Use our Fee Calculator tool to compare total Year 1 costs across all providers based on your specific AUM.`,
    relatedTypes: ['qualified-custodian', 'collaborative-custody'],
  },
]

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = GUIDES.find((g) => g.slug === slug)
  if (!guide) return { title: 'Guide Not Found' }
  return {
    title: guide.title,
    description: guide.description,
  }
}

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = GUIDES.find((g) => g.slug === slug)
  if (!guide) return <div className="container-main py-12">Guide not found.</div>

  const allProviders = getProviders()
  const relatedProviders = rankProviders(
    allProviders.filter((p) => guide.relatedTypes.includes(p.custodyType))
  ).slice(0, 3)

  const paragraphs = guide.content.split('\n\n')

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema([
              { name: 'Home', url: '/' },
              { name: 'Guides', url: '/guides/what-is-bitcoin-custody' },
              { name: guide.title, url: `/guides/${guide.slug}` },
            ])
          ),
        }}
      />

      <article className="py-12">
        <div className="container-main max-w-3xl">
          <nav className="mb-6 text-sm text-gray-500">
            <Link href="/" className="hover:text-btc-orange">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-text-heading">Guides</span>
          </nav>

          <h1 className="text-3xl font-extrabold sm:text-4xl">{guide.title}</h1>
          <p className="mt-3 text-lg text-text-body">{guide.description}</p>

          <div className="prose prose-slate mt-10 max-w-none">
            {paragraphs.map((p, i) => {
              if (p.startsWith('## ')) {
                return <h2 key={i} className="mb-4 mt-10 text-xl font-bold text-text-heading">{p.replace('## ', '')}</h2>
              }
              if (p.startsWith('**') && p.includes(':**')) {
                return <p key={i} className="mb-4 leading-relaxed text-text-body" dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
              }
              if (p.startsWith('- ')) {
                const items = p.split('\n').filter((l) => l.startsWith('- '))
                return (
                  <ul key={i} className="mb-4 list-disc space-y-1 pl-6 text-text-body">
                    {items.map((item, j) => (
                      <li key={j} dangerouslySetInnerHTML={{ __html: item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
                    ))}
                  </ul>
                )
              }
              if (/^\d+\./.test(p)) {
                const items = p.split('\n').filter((l) => /^\d+\./.test(l))
                return (
                  <ol key={i} className="mb-4 list-decimal space-y-1 pl-6 text-text-body">
                    {items.map((item, j) => (
                      <li key={j}>{item.replace(/^\d+\.\s*/, '')}</li>
                    ))}
                  </ol>
                )
              }
              return <p key={i} className="mb-4 leading-relaxed text-text-body" dangerouslySetInnerHTML={{ __html: p.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') }} />
            })}
          </div>

          {/* Related Providers */}
          {relatedProviders.length > 0 && (
            <div className="mt-12 rounded-xl bg-bg-light p-6">
              <h3 className="font-bold text-text-heading">Related Providers</h3>
              <div className="mt-4 space-y-2">
                {relatedProviders.map((p) => (
                  <Link key={p.id} href={`/custodian/${p.slug}`} className="block text-sm font-medium text-btc-orange hover:underline">
                    {p.name} — Custody Score: {p.custodyScore}/10 →
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Other Guides */}
          <div className="mt-8">
            <h3 className="font-bold text-text-heading">More Guides</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              {GUIDES.filter((g) => g.slug !== slug)
                .slice(0, 4)
                .map((g) => (
                  <Link key={g.slug} href={`/guides/${g.slug}`} className="text-sm font-medium text-btc-orange hover:underline">
                    {g.title} →
                  </Link>
                ))}
            </div>
          </div>

          {/* Email Capture */}
          <div className="mt-12">
            <EmailCapture />
          </div>
        </div>
      </article>
    </>
  )
}
