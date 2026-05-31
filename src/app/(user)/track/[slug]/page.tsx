
import WaveTrack from '@/components/track/wave.track'
import { sendRequest } from '@/utils/api'
import Container from '@mui/material/Container'
import { useSearchParams } from 'next/navigation'


const TrackDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    // Gọi api ở server slide rendering để fetch data nhanh hơn
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${(await params).slug}`,
        method: "GET",
    })

    return (
        <Container>
            <div>
                <WaveTrack
                    track={res?.data || null}
                />
            </div>
        </Container>
    )
}

export default TrackDetailPage