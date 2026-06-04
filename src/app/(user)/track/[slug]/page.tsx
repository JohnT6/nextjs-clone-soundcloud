
import WaveTrack from '@/components/track/wave.track'
import { sendRequest } from '@/utils/api'
import Container from '@mui/material/Container'
import { useSearchParams } from 'next/navigation'


import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${(await params).slug}`,
        method: "GET",
    })

    return {
        title: res.data?.title,
        description: res.data?.description,
    }
}

const TrackDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    // Gọi api ở server slide rendering để fetch data nhanh hơn
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `http://localhost:8000/api/v1/tracks/${(await params).slug}`,
        method: "GET",
        // Tắt cache hoàn toàn, luôn gọi API để lấy dữ liệu mới nhất từ server mỗi khi load trang (chuẩn SSR).
        nextOption: { cache: "no-store" }
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