'use client'
import { useWasesurfer } from '@/utils/customHook';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WaveSurferOptions } from 'wavesurfer.js'



const WaveTrack = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')

    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d')!;

        // Define the waveform gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
        gradient.addColorStop(0, '#656666') // Top color
        gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
        gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
        gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
        gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
        gradient.addColorStop(1, '#B1B1B1') // Bottom color

        // Define the progress gradient
        const progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.35)
        progressGradient.addColorStop(0, '#EE772F') // Top color
        progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
        progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
        progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
        progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
        progressGradient.addColorStop(1, '#F6B094') // Bottom color

        return {
            // waveColor: 'rgb(200, 0, 200)',
            // progressColor: 'rgb(100, 0, 100)',
            waveColor: gradient,
            progressColor: progressGradient,
            height: 150,
            barWidth: 2,
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