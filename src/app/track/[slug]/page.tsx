'use client'

import WaveTrack from '@/components/track/wave.track'
import { useSearchParams } from 'next/navigation'

const TrackDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const searchParams = useSearchParams()

    const audio = searchParams.get('audio')
    console.log("Check params and search", params, audio);

    return (
        <div>
            Track Detail Page
            <div>
                <WaveTrack />
            </div>
        </div>
    )
}

export default TrackDetailPage