
import WaveTrack from '@/components/track/wave.track'
import { sendRequest } from '@/utils/api'
import Container from '@mui/material/Container'
import { useSearchParams } from 'next/navigation'
import { notFound } from 'next/navigation'


import type { Metadata, ResolvingMetadata } from 'next'

type Props = {
    params: Promise<{ slug: string }>
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export async function generateMetadata(
    { params, searchParams }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const temp = (await params)?.slug?.split(".html") ?? [];

    const temp1 = temp[0].split("-") ?? []
    const id = temp1[temp1.length - 1]

    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
    })

    return {
        title: res.data?.title,
        description: res.data?.description,
        openGraph: {
            title: 'Genzo',
            description: 'Music',
            type: 'website',
            images: [`https://raw.githubusercontent.com/hoidanit/images-hosting/master/eric.png`],
        },

    }
}

const TrackDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const temp = (await params)?.slug?.split(".html") ?? [];

    const temp1 = temp[0].split("-") ?? []
    const id = temp1[temp1.length - 1]

    // Gọi api ở server slide rendering để fetch data nhanh hơn
    const res = await sendRequest<IBackendRes<ITrackTop>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/${id}`,
        method: "GET",
        // Tắt cache hoàn toàn, luôn gọi API để lấy dữ liệu mới nhất từ server mỗi khi load trang (chuẩn SSR).
        nextOption: { cache: "no-store" }
    })

    const res1 = await sendRequest<IBackendRes<IModelPaginate<ITrackComment>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/comments`,
        method: "POST",
        queryParams: {
            current: 1,
            pageSize: 10,
            trackId: id,
            sort: "-createdAt"
        }
    })

    if (!res.data) {
        notFound()
    }

    await new Promise(resolve => setTimeout(resolve, 3000))

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