import type { SimScript } from '@/lib/sim/script'

/**
 * SIM-6 — default deny, watched from both ends.
 *
 * Readers disbelieve default-deny until they see a colleague get refused, which is
 * the whole reason this replay exists rather than a paragraph.
 *
 * The gateway half is quoted: startup lines, the pairing block, the approval CLI.
 * The messaging half has no published source at all — the documentation references
 * screenshots whose content was never fetched — so this replay deliberately does
 * **not** draw a Telegram interface. Where a chat bubble would go, it says what
 * happened in plain words and marks the frames it cannot quote. An imitation of a
 * messaging client would be the one dishonest thing in an otherwise sourced guide,
 * and it would also be the most convincing, which is exactly the problem.
 */
export const script: SimScript = {
  id: 'letting-someone-else-in',
  title: 'Letting someone else in',
  premise:
    'A colleague messages the bot and does not get an answer. Watch what they get instead, and what it costs you to change that.',
  fidelity: 'reconstructed',
  source:
    'Gateway startup lines, the pairing-code block, the pairing CLI and the published limits are quoted from the messaging and gateway documentation, v0.19.0. The messaging side is described rather than drawn: no screenshot content exists in the corpus, so no chat interface is reproduced and the colleague\'s wording is illustrative.',
  hermesVersion: 'v0.19.0',
  events: [
    { t: 'marker', id: 'up', label: 'The gateway comes up' },
    { t: 'user', text: 'hermes gateway' },
    {
      t: 'result',
      name: 'terminal',
      output: `[Gateway] Starting Hermes Gateway...
[Gateway] Telegram adapter connected
[Gateway] Cron scheduler started (tick every 60s)`,
      ms: 1100,
    },
    {
      t: 'note',
      text: 'Three lines, and the third is worth noticing here rather than in the cron lesson: the scheduler lives inside this daemon. Stop the gateway and you have also stopped every scheduled job.',
    },

    { t: 'marker', id: 'stranger', label: 'Someone you have not authorised' },
    {
      t: 'note',
      text: 'A colleague finds the bot and messages it. This replay does not draw that exchange — the documentation publishes no transcript of one, so there is nothing to quote and a plausible-looking chat window would be invention. What can be quoted is what the bot sends back.',
    },
    {
      t: 'result',
      name: 'telegram',
      output: `🔐 Pairing code: XKGH5N7P
Send this code to the bot owner for approval.`,
      ms: 900,
    },
    {
      t: 'note',
      text: 'Not an answer, and not silence either. The default is deny, and the deny has a door in it — which is the design worth understanding. Set unauthorized_dm_behavior to ignore and the door closes: unknown senders get nothing at all.',
    },

    { t: 'marker', id: 'approve', label: 'The owner decides' },
    {
      t: 'note',
      text: 'The code reaches you out of band — your colleague reads it to you, or pastes it into a channel you already share. That detour is the point: approval travels over a path the bot does not control.',
    },
    { t: 'user', text: 'hermes pairing approve telegram XKGH5N7P' },
    {
      t: 'memory',
      layer: 'user',
      note: 'The pairing is written under ~/.hermes/pairing/, per platform, mode 0600. It is a record as well as a permission — which is the argument for pairing over hardcoded ids in the config.',
    },
    {
      t: 'note',
      text: 'Codes expire after an hour, a user may request one every ten minutes, three may be pending per platform, and five failed approval attempts lock the platform out for an hour. Those limits are the rate-limiting story as much as the onboarding one.',
    },

    { t: 'marker', id: 'answered', label: 'And now they are in' },
    {
      t: 'note',
      text: 'The same person sends the same message again and this time it is answered. The reply below is illustrative — its wording is not quoted from anywhere, only its plainness is: a messaging reply is the agent\'s markdown-stripped text, not a rendered panel.',
    },
    {
      t: 'say',
      text: 'The deploy finished at 14:02 and the health check is green.',
    },
    {
      t: 'note',
      text: 'What this chain authorised is a sender. It said nothing about what that sender may then ask the agent to do — they now reach the same tools, the same memory and the same terminal you do. Pairing is authentication; it is not authorisation in any narrower sense.',
    },
  ],
}
