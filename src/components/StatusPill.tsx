import type { Status } from '../data/types'

const TEXT: Record<Status, string> = {
  open: 'Open',
  new: 'New 2025–26',
  announced: 'Announced · unconfirmed',
}

export function StatusPill({ status }: { status: Status }) {
  return <span className={`pill pill-${status}`}>{TEXT[status]}</span>
}
