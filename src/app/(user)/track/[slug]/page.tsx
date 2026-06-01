
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

    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `http://localhost:8000/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: (await params).slug,
            sort: "-createdAt"
        }
    })

    return (
        <Container>
            <div>
                <WaveTrack
                    track={res?.data || null}
                    trackComment={res1?.data?.result || []}
                />
            </div>
        </Container>
    )
}

export default TrackDetailPage