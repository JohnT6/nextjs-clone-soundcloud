'use client'
import { useWasesurfer } from '@/utils/customHook';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'




const WaveTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')

    const optionsMemo = useMemo(() => {
        return {
            waveColor: 'rgb(200, 0, 200)',
            progressColor: 'rgb(100, 0, 100)',
            url: `/api?audio=${fileName}`,
        }
    }, [])


    const waveSurfer = useWasesurfer(containerRef, optionsMemo)

    const [isPlaying, setIsPlaying] = useState<boolean>(false);

    // cần coi lại cái này vào ngày mai nếu ko có cái useEffect này thì nó ko chuyển play/pause liên quan gì tới đồng bộ á
    useEffect(() => {
        if (!waveSurfer) return

        setIsPlaying(false)

        const subscriptions = [
            waveSurfer.on('play', () => setIsPlaying(true)),
            waveSurfer.on('pause', () => setIsPlaying(false))
        ]

        return () => {
            subscriptions.forEach((unSub) => unSub());
        }
    }, [waveSurfer])

    const onPlayClick = useCallback(() => {
        if (waveSurfer) {
            waveSurfer.isPlaying() ? waveSurfer.pause() : waveSurfer.play();
        }
    }, [waveSurfer])

    return (
        <div>
            <div ref={containerRef}>
                Wave Track
            </div>
            <button onClick={() => onPlayClick()}>{isPlaying ? 'Pause' : "Play"}</button>
        </div>
    )
}

export default WaveTrack