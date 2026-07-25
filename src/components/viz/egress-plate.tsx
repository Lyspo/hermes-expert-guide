import { VizBox, VizEdge, VizNote, VizStage } from './stage'

const PROTECTS = [
  'key exfiltration from a prompt-injected sandbox',
  'a compromised dependency phoning home',
  'cloud metadata endpoints — 169.254.169.254',
  'DNS rebinding to a private address',
  'same-uid processes scraping the daemon',
  'a LAN peer spending your quota',
]

const DOES_NOT = [
  'a compromised host process',
  'CA key theft, or a hijacked proxy endpoint',
  'raw sockets that bypass HTTPS_PROXY',
  'credential files mounted into Docker',
  'exfiltration to an allowlisted host',
  'Bedrock SigV4 and Vertex service accounts',
  'in-memory secret recovery via /proc',
]

/**
 * VIZ-5 — where the credentials are.
 *
 * The egress documentation is unusually honest about its own limits, and a plate that
 * draws the protections and the gaps at *equal weight* is this guide's whole posture in
 * one image. So the two columns are the same type size, the same colour and the same
 * spacing, and the longer of the two is the one listing what the feature does not do.
 *
 * Signal marks the boundary and the substitution that happens at it — the one place a
 * token becomes a key — and nothing else. Deliberately not the gaps: they are facts
 * about scope, not errors, and colouring them as errors would be the editorialising
 * the equal-weight rule exists to prevent.
 */
export function EgressPlate() {
  const top = 176
  const pitch = 20

  return (
    <VizStage
      title="Where the credentials are"
      description="With the egress proxy enabled, a Docker sandbox holds only an opaque proxy token rather than a real API key. Outbound traffic crosses a trusted-proxy boundary into iron-proxy on the host, which terminates TLS using a locally generated certificate authority, swaps the token for the real credential, and forwards the request upstream to an allowlisted provider. It protects against six things: key exfiltration by a prompt-injected agent in the sandbox, a compromised dependency calling an arbitrary host, access to cloud metadata endpoints, DNS rebinding to private addresses, same-uid processes scraping the daemon's environment, and a LAN peer spending your quota with a leaked token. It does not protect against seven: a compromised host process, theft of the certificate authority key or hijacking of the proxy endpoint, sandbox code using raw sockets to bypass the proxy, credential files mounted directly into Docker, data exfiltration inside a request to an allowlisted host, providers using AWS SigV4 or Google service accounts whose credentials remain real inside the sandbox, and recovery of secrets from the daemon's memory. The feature is Docker-only; other backends receive no proxy configuration at all."
      width={720}
      height={400}
    >
      <text x={0} y={10} fill="var(--color-ice-faint)" fontSize={9}>
        ONE OUTBOUND REQUEST, AND WHERE THE REAL KEY ENTERS IT
      </text>

      <VizBox
        x={0}
        y={24}
        w={196}
        h={64}
        label="the sandbox"
        sublabel="an opaque token, and"
        tone="near"
      />
      <text x={10} y={76} fill="var(--color-ice-dim)" fontSize={10}>
        no real key at all
      </text>

      <VizEdge from={[196, 56]} to={[254, 56]} kind="change" arrow />

      <VizBox
        x={262}
        y={24}
        w={196}
        h={64}
        label="iron-proxy"
        sublabel="on the host — swaps the"
        tone="near"
      />
      <text x={272} y={76} fill="var(--color-ice-dim)" fontSize={10}>
        token for the real key
      </text>

      <VizEdge from={[458, 56]} to={[516, 56]} arrow />

      <VizBox
        x={524}
        y={24}
        w={192}
        h={64}
        label="the provider"
        sublabel="sees an ordinary"
      />
      <text x={534} y={76} fill="var(--color-ice-dim)" fontSize={10}>
        authenticated request
      </text>

      {/* The boundary the whole guarantee rests on. */}
      <line x1={228} y1={16} x2={228} y2={112} stroke="var(--color-signal)" strokeWidth={1} />
      <text x={228} y={126} fill="var(--color-signal)" fontSize={9} textAnchor="middle">
        the trusted proxy boundary
      </text>

      {/* Equal weight. Same size, same colour, same rhythm — and the right-hand
          column is the longer one. */}
      <text x={0} y={158} fill="var(--color-ice-faint)" fontSize={9}>
        WHAT IT PROTECTS AGAINST
      </text>
      <text x={370} y={158} fill="var(--color-ice-faint)" fontSize={9}>
        WHAT IT DOES NOT
      </text>

      {PROTECTS.map((item, index) => (
        <text key={item} x={0} y={top + index * pitch} fill="var(--color-ice-dim)" fontSize={10}>
          {item}
        </text>
      ))}

      {DOES_NOT.map((item, index) => (
        <text key={item} x={370} y={top + index * pitch} fill="var(--color-ice-dim)" fontSize={10}>
          {item}
        </text>
      ))}

      <line x1={0} y1={330} x2={720} y2={330} stroke="var(--color-ice-faint)" strokeWidth={1} />

      <VizNote x={0} y={350} width={340}>
        Docker only. Modal, Daytona, SSH and Singularity receive no proxy configuration,
        so a sandbox on those backends holds the real keys.
      </VizNote>
      <VizNote x={370} y={350} width={340}>
        Seven gaps, published by the feature’s own documentation. A control that states
        its limits this precisely is easier to deploy than one that does not.
      </VizNote>
    </VizStage>
  )
}
