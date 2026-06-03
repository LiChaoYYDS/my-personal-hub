'use client'
import { useState } from 'react'
import { LifeFeed } from '@/features/life/LifeFeed'
import { LifeTimeline } from '@/features/life/LifeTimeline'
import type { LifeRecord } from '@/types'

export function LifeClientLayout() {
  const [records, setRecords] = useState<LifeRecord[]>([])
  return (
    <>
      <main className="flex-1 min-w-0">
        <LifeFeed onRecordsLoad={setRecords} />
      </main>
      <LifeTimeline records={records} />
    </>
  )
}
