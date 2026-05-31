'use client'
import { useWaveSurfer } from '@/utils/customHook';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { WaveSurferOptions } from 'wavesurfer.js'
//@ts-ignore
import './wave.scss'
import { Pause, PauseCircle, PauseCircleOutline, PlayArrow } from '@mui/icons-material';
import { Tooltip } from '@mui/material';
import { sendRequest } from '@/utils/api';
import { useTrackContext } from '@/app/lib/track.wrapper';

interface IProps {
    track: ITrackTop | null
}

const WaveTrack = (props: IProps) => {
    const { track } = props
    const searchParams = useSearchParams()
    const fileName = searchParams.get('audio')
    // const id = searchParams.get('id')
    const containerRef = useRef<HTMLDivElement>(null);
    const hoverRef = useRef<HTMLDivElement>(null);
    const timeRef = useRef<HTMLDivElement>(null);
    const durationRef = useRef<HTMLDivElement>(null);
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;


    const optionsMemo = useMemo((): Omit<WaveSurferOptions, 'container'> => {


        let gradient, progressGradient;
        if (typeof window !== 'undefined') {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d')!;

            // Ngay đây off các cái màu trắng do bên custom hook đã cho gap giữa trên và dưới và #F6B094 off cái này ko biết vì sao để thì nó bị lỗi giao diện

            // Define the waveform gradient
            gradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.15)
            gradient.addColorStop(0, '#cecbc8') // Top color
            gradient.addColorStop((canvas.height * 0.7) / canvas.height, '#cecbc8') // Top color
            // gradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            // gradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            gradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#c0bebd') // Bottom color
            gradient.addColorStop(1, '#c0bebd') // Bottom color

            // Define the progress gradient
            progressGradient = ctx.createLinearGradient(0, 0, 0, canvas.height * 1.15)
            progressGradient.addColorStop(0, '#EE772F') // Top color
            progressGradient.addColorStop((canvas.height * 0.7) / canvas.height, '#EB4926') // Top color
            // progressGradient.addColorStop((canvas.height * 0.7 + 1) / canvas.height, '#ffffff') // White line
            // progressGradient.addColorStop((canvas.height * 0.7 + 2) / canvas.height, '#ffffff') // White line
            // progressGradient.addColorStop((canvas.height * 0.7 + 3) / canvas.height, '#F6B094') // Bottom color
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

        waveSurfer.setVolume(0);

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
            }),
            waveSurfer.on('click', () => {
                waveSurfer.play()
            }),
            // 2. BẮT SỰ KIỆN KHI USER CLICK VÀO SÓNG ÂM ĐỂ TUA
            waveSurfer.on('interaction', (newTime) => {
                // Cập nhật thời gian vừa tua lên Context để gửi cho Footer
                setCurrentTrack(prev => ({ ...prev, trackCurrentTime: newTime }));
            })

        ]

        return () => {
            subscriptions.forEach((unSub) => unSub());
        }
    }, [waveSurfer])

    useEffect(() => {
        if (track?._id === currentTrack._id && waveSurfer) {
            currentTrack.isPlaying ? waveSurfer.play() : waveSurfer.pause()
        }
    }, [currentTrack])

    useEffect(() => {
        // Chỉ chạy khi bác kéo Footer làm trackCurrentTime thay đổi
        if (waveSurfer && currentTrack.trackCurrentTime !== undefined) {
            const waveTime = waveSurfer.getCurrentTime();

            // Lọc nhiễu: Chỉ ép Sóng âm nhảy nếu thời gian lệch nhau rõ rệt (hơn 0.1 giây).
            // Việc này chặn đứng bug "Vòng lặp vô tận" (Footer gọi Sóng âm -> Sóng âm lại gọi Footer)
            if (Math.abs(waveTime - currentTrack.trackCurrentTime) > 0.1) {
                // Hàm mặc định của WaveSurfer để ép nó nhảy thời gian
                waveSurfer.setTime(currentTrack.trackCurrentTime);
            }

        }
    }, [currentTrack.trackCurrentTime, waveSurfer]);

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

    const arrComments = [
        {
            id: 1,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 10,
            user: "username 1",
            content: "just a comment1"
        },
        {
            id: 2,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 30,
            user: "username 2",
            content: "just a comment3"
        },
        {
            id: 3,
            avatar: "http://localhost:8000/images/chill1.png",
            moment: 50,
            user: "username 3",
            content: "just a comment3"
        },
    ]

    const calcLeft = (moment: number) => {
        const hashCodeTime = 199;
        const present = (moment / hashCodeTime) * 100;
        return `${present}%`
    }


    return (
        <div >
            <div
                style={{
                    display: "flex",
                    padding: 30,
                    height: 380,
                    // Đổi màu nền cho giống tone màu xám nâu của SC
                    background: "linear-gradient(135deg, #8b8076 0%, #5a514a 100%)",
                    color: "white"
                }}
            >
                {/* --- CỘT TRÁI (Chứa Info + Waveform) --- */}
                <div className="left"
                    style={{
                        width: "75%",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between", // Đẩy Info lên đầu, Waveform xuống đáy
                        paddingRight: 30
                    }}
                >
                    {/* KHỐI INFO (Play button + Text + Meta) */}
                    <div className="info" style={{ display: "flex", justifyContent: "space-between" }}>

                        <div style={{ display: "flex", gap: 20 }}>
                            {/* Nút Play (Đổi thành màu đen, to hơn) */}
                            <div
                                onClick={() => {
                                    onPlayClick()
                                    if (track && waveSurfer)
                                        setCurrentTrack({ ...track, isPlaying: waveSurfer.isPlaying(), trackCurrentTime: waveSurfer.getCurrentTime() })
                                }}
                                style={{
                                    borderRadius: "50%",
                                    background: "#111", // Đen chuẩn SC
                                    height: "60px",
                                    width: "60px",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    cursor: "pointer"
                                }}
                            >
                                {isPlaying === true ?
                                    <Pause sx={{ fontSize: 35, color: "white" }} />
                                    :
                                    <PlayArrow sx={{ fontSize: 35, color: "white" }} />
                                }
                            </div>

                            {/* Khối Title & Artist */}
                            <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
                                <div style={{
                                    padding: "4px 10px",
                                    background: "#111",
                                    fontSize: 24,
                                    width: "fit-content",
                                    color: "white",
                                    fontWeight: 500
                                }}>
                                    {track?.title}
                                </div>
                                <div style={{
                                    padding: "2px 8px",
                                    background: "#111",
                                    fontSize: 16,
                                    width: "fit-content",
                                    color: "#ccc"
                                }}>
                                    {track?.uploader.name}
                                </div>
                            </div>
                        </div>

                        {/* Thêm phần Meta Tag giả lập giống SC (11 years ago, #Hip Hop) */}
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 10 }}>
                            <span style={{ fontSize: 14, color: "#e5e5e5" }}>1 month ago</span>
                            <span style={{ background: "rgba(0,0,0,0.6)", padding: "4px 12px", borderRadius: 20, fontSize: 14 }}>
                                # Pop
                            </span>
                        </div>
                    </div>

                    {/* KHỐI WAVEFORM */}
                    <div ref={containerRef} className="wave-form-container" style={{ width: "100%", position: "relative" }}>
                        <div className="time" ref={timeRef}>00:00</div>
                        <div className="duration" ref={durationRef}>00:00</div>
                        <div ref={hoverRef} className="hover-wave"></div>
                        <div className='comments' style={{ position: "relative" }}>
                            {arrComments.map(item => {
                                return (
                                    <Tooltip title={item.content} arrow key={item.id}>
                                        <img
                                            onPointerMove={(e) => {
                                                const hover = hoverRef.current!;
                                                hover.style.width = calcLeft(item.moment); // Nếu muốn cái hover ra giữa thì + 3 thêm vào cái moment
                                            }}
                                            key={item.id}
                                            src={`http://localhost:8000/images/CHILL1.png`}
                                            alt="imgComment"
                                            style={{
                                                width: "20px",
                                                height: "20px",
                                                objectFit: "cover",
                                                position: "absolute",
                                                top: "71px",
                                                zIndex: "99",
                                                left: calcLeft(item.moment)
                                            }} />
                                    </Tooltip>
                                )
                            })}

                        </div>
                    </div>
                </div>

                {/* --- CỘT PHẢI (Chứa Ảnh Cover) --- */}
                <div className="right"
                    style={{
                        width: "25%",
                        display: "flex",
                        justifyContent: "flex-end", // Đẩy ảnh bám sát lề phải
                    }}
                >
                    <img
                        src={`http://localhost:8000/images/${track?.imgUrl}`} alt="imgTrack"
                        style={{
                            background: "#333", // Tạm thời để màu xám, sau này bạn nhét thẻ <img /> vào đây
                            width: 320,
                            height: 320,
                            boxShadow: "0 0 10px rgba(0,0,0,0.3)", // Thêm chút bóng đổ cho ảnh nổi bật
                            borderRadius: "3%",
                            objectFit: "cover",
                            overflow: "hidden"
                        }}>
                    </img>
                </div>
            </div>
        </div>
    )
}

export default WaveTrack