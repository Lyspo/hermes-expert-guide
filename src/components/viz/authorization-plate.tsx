import { VizBarrier, VizEdge, VizNote, VizStage } from './stage'

/** The checks, in the order they run. The last one is not a check. */
const GATES = [
  { label: 'per-platform allow-all flag', note: 'off unless you set it' },
  { label: 'DM-pairing approved list', note: 'codes you approved by hand' },
  { label: 'platform allowlist', note: 'TELEGRAM_ALLOWED_USERS, etc.' },
  { label: 'global allowlist', note: 'GATEWAY_ALLOWED_USERS' },
  { label: 'global allow-all', note: 'GATEWAY_ALLOW_ALL_USERS' },
]

/**
 * VIZ-6 — the authorization chain.
 *
 * The smallest plate in the guide, and the map is right that the chain also reads
 * well as an ordered list. What a list cannot do is make the *terminus* feel like a
 * decision: five checks, each of which can admit, and then a floor that is reached
 * by falling rather than by failing. Default deny is not the sixth check. It is what
 * happens when there were no checks to pass.
 *
 * So the five gates are drawn as openings in a wall and the terminus is drawn as
 * ground — solid, in signal, with nothing below it. An unconfigured install has five
 * closed gates and every visitor lands on the floor, which is the sentence the
 * documentation prints in bold and readers still manage to be surprised by.
 */
export function AuthorizationPlate() {
  const top = 60
  const pitch = 46

  return (
    <VizStage
      title="The authorization chain"
      description="An inbound message from a messaging platform passes five checks in a fixed order, and any one of them can admit it. First a per-platform allow-all flag, then the DM-pairing approved list, then the platform-specific allowlist such as TELEGRAM_ALLOWED_USERS, then the global allowlist GATEWAY_ALLOWED_USERS, then the global allow-all flag. If none of the five admits the sender, the message is denied. That default is what an unconfigured install does: with no allowlists configured and no allow-all flag set, every user is denied. Denial is therefore not a failure state but the resting state, and every one of the five ways past it is something a person switched on deliberately."
      width={720}
      height={400}
    >
      <text x={0} y={10} fill="var(--color-ice-faint)" fontSize={9}>
        AN INBOUND MESSAGE, AND THE FIVE THINGS THAT COULD LET IT THROUGH
      </text>

      <text x={0} y={32} fill="var(--color-ice)" fontSize={12}>
        a message arrives
      </text>

      {GATES.map((gate, index) => {
        const y = top + index * pitch
        return (
          <g key={gate.label}>
            {/* Each check is a wall with one opening. Passing is the exception. */}
            <VizBarrier x={0} y={y} w={230} door={[96, 134]} />
            <text x={246} y={y + 8} fill="var(--color-ice-dim)" fontSize={10}>
              {`${index + 1}. ${gate.label}`}
            </text>
            <text x={468} y={y + 8} fill="var(--color-ice-faint)" fontSize={9}>
              {gate.note}
            </text>
          </g>
        )
      })}

      {/* The fall-through. It is not dashed: nothing is conditional about it. */}
      <VizEdge from={[115, 40]} to={[115, 282]} arrow />

      {/* The terminus, drawn as ground rather than as a sixth check. */}
      <rect x={0} y={288} width={230} height={4} fill="var(--color-signal)" />
      <text x={246} y={296} fill="var(--color-signal)" fontSize={10}>
        6. denied — and this is the default
      </text>

      <VizNote x={246} y={318} width={464}>
        “If no allowlists are configured and GATEWAY_ALLOW_ALL_USERS is not set, all
        users are denied.” Every route past this floor is something a person switched
        on, one at a time.
      </VizNote>

      <VizNote x={0} y={318} width={230}>
        Nothing below the line. Denial is where a message lands, not a check it failed.
      </VizNote>
    </VizStage>
  )
}
