'use client'

import WaveTrack from '@/components/track/wave.track'
import Container from '@mui/material/Container'
import { useSearchParams } from 'next/navigation'


const TrackDetailPage = ({ params }: { params: Promise<{ slug: string }> }) => {
    const searchParams = useSearchParams()

    const audio = searchParams.get('audio')
    console.log("Check params and search", params, audio);

    return (
        <Container>
            <div>
                <WaveTrack />
            </div>
        </Container>
    )
}

export default TrackDetailPage