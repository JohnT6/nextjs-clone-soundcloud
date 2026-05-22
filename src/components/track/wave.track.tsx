'use client'
import { useWaveSurfer } from '@/utils/customHook';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WaveSurferOptions } from 'wavesurfer.js'
import './wave.scss'


const WaveTrack = () => {
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef<HTMLDivElement>(null);


    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {


        let gradient, progressGradient;
        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;


            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.15)
            gradient.addColorStop(0, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#656666') // Top color
            gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#B1B1B1') // Bottom color
            gradient.addColorStop(1, '#B1B1B1') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.15)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
            progressGradient.addColorStop(1, '#F6B094') // Bottom color
        }
        return {
            // waveColor: 'rgb(200, 0, 200)',
            // progressColor: 'rgb(100, 0, 100)',
            waveColor: gradient,
            progressColor: progressGradient,
            height: 100,
            barWidth: 3,
            url: `/api?audio=${fileName}`,
        }
    }, [fileName])


    const waveSurfer = useWaveSurfer(containerRef, optionsMemo)

    const [isPlaying, setIsPlaying] = useState<boolean>(false);


    useEffect(() => {
        if (!waveSurfer) return

        setIsPlaying(false)
        const timeEl = timeRef.current!
        const durationEl = durationRef.current!

        const hover = hoverRef.current!
        const waveform = containerRef.current!
        //@ts-ignore
        waveform.addEventListener('pointermove', (e) => (hover.style.width = `${e.offsetX}px`))

        const subscriptions = [
            waveSurfer.on('play', () => setIsPlaying(true)),
            waveSurfer.on('pause', () => setIsPlaying(false)),
            waveSurfer.on('decode', (duration) => {
                // SỬA LẠI: Dùng .textContent để ép thẻ div hiển thị chữ mới
                if (durationRef.current) {
                    durationRef.current.textContent = formatTime(duration);
                }
            }),

            waveSurfer.on('timeupdate', (currentTime) => {
                // SỬA LẠI: Dùng .textContent để thời gian chạy mượt mà trên màn hình
                if (timeRef.current) {
                    timeRef.current.textContent = formatTime(currentTime);
                }
            })
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

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60)
        const secondsRemainder = Math.round(seconds) % 60
        const paddedSeconds = `0${secondsRemainder}`.slice(-2)
        return `${minutes}:${paddedSeconds}`
    }

    return (
        <div>
            <div ref={containerRef} className='wave-form-container'>
                Wave Track
                <div className='time' ref={timeRef}>0:00</div>
                <div className='duration' ref={durationRef}>0:00</div>
                <div ref={hoverRef} className="hover-wave"></div>
                {/* <div className="overlay"
                    style={{
                        position: "absolute",
                        height: "30px",
                        width: "100%",
                        bottom: "0",
                        background: "#ccc"
                    }}
                ></div> */}
            </div>
            <button onClick={() => onPlayClick()}>{isPlaying ? 'Pause' : "Play"}</button>
        </div>
    )
}

export default WaveTrack