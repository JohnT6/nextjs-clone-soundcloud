'use client'
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container, Box, Typography, IconButton } from "@mui/material"
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player';
//@ts-ignore
import 'react-h5-audio-player/lib/styles.css';

import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PersonAddAltIcon from '@mui/icons-material/PersonAddAlt';
import QueueMusicIcon from '@mui/icons-material/QueueMusic';
import { useTrackContext } from "@/app/lib/track.wrapper";
import { useRef } from "react";

const AppFooter = () => {
    const hasMounted = useHasMounted();
    const playerRef = useRef(null);
    if (!hasMounted) return (<></>)

    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;

    console.log("Check currentTrack", currentTrack);


    if (currentTrack.isPlaying) {
        //@ts-ignore
        playerRef?.current?.audio?.current?.play();

    } else {
        //@ts-ignore
        playerRef?.current?.audio?.current?.pause();
    }

    return (
        <div style={{ marginTop: 50 }}>
            <AppBar
                position="fixed"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    backgroundColor: "#f2f2f2", // Màu nền xám nhạt
                    borderTop: "1px solid #cecece",
                    boxShadow: "none"
                }}
            >
                <Container
                    sx={{
                        display: "flex",
                        alignItems: "center",
                        height: 50,
                        padding: "0 10px !important"
                    }}
                >
                    {/* 1. KHU VỰC AUDIO PLAYER */}
                    <Box sx={{
                        flexGrow: 1,

                        // TRẢ VỀ STYLE LIGHT THEME MẶC ĐỊNH
                        '& .rhap_container': {
                            backgroundColor: 'transparent',
                            boxShadow: 'none',
                            padding: '0 20px',
                        },
                        '& .rhap_time': {
                            color: '#666',
                            fontSize: '12px',
                            fontWeight: 500,
                        },

                        // --- 1. KHÓA CỤM NÚT BẤM (KHÔNG CHO PHÌNH TO) ---
                        '& .rhap_controls-section': {
                            flex: '0 0 auto ', // Chỉ to bằng đúng các nút bên trong
                            margin: "0 10px",
                            gap: "10px"
                        },

                        // --- 2. ÉP THANH TIẾN TRÌNH DÀI SANG TRÁI ---
                        '& .rhap_progress-section': {
                            flex: '1 1 auto ', // Giãn hết cỡ lấp đầy khoảng trống
                        },

                        '& .rhap_progress-bar': {
                            backgroundColor: '#ddd',
                        },
                        '& .rhap_progress-indicator': {
                            backgroundColor: '#f50', // Cục cam Soundcloud
                            boxShadow: 'none',
                        },
                        '& .rhap_progress-filled': {
                            backgroundColor: '#f50',
                        },
                        '& .rhap_main-controls-button': {
                            color: '#333',
                        },

                        // --- CHỈNH LẠI CỤM LOA ---
                        '& .rhap_volume-button': {
                            color: '#666',
                        },
                        '& .rhap_volume-container': {
                            marginLeft: '15px ', // Cách icon loa ra 15px

                        },
                        '& .rhap_volume-bar': {
                            background: '#ddd',
                        },
                        '& .rhap_volume-indicator': {
                            background: '#f50',
                            boxShadow: 'none',
                        },
                        '& .rhap_volume-filled': {
                            backgroundColor: '#f50',
                        }
                    }}>
                        <AudioPlayer
                            ref={playerRef}
                            src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/${currentTrack.trackUrl}`}
                            volume={0.5}
                            layout="horizontal-reverse"
                            customControlsSection={[
                                RHAP_UI.MAIN_CONTROLS,
                                RHAP_UI.ADDITIONAL_CONTROLS,
                            ]}
                            customProgressBarSection={[
                                RHAP_UI.CURRENT_TIME,
                                RHAP_UI.PROGRESS_BAR,
                                RHAP_UI.DURATION,
                                RHAP_UI.VOLUME,
                            ]}
                            onPlay={() => setCurrentTrack({ ...currentTrack, isPlaying: true })}
                            onPause={() => setCurrentTrack({ ...currentTrack, isPlaying: false })}
                        />
                    </Box>

                    {/* 2. KHU VỰC THÔNG TIN BÀI HÁT */}
                    <Box sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        minWidth: "280px",
                        paddingLeft: 2,
                        borderLeft: "1px solid #cecece"
                    }}>
                        {/* Ảnh Thumbnail */}
                        <Box sx={{
                            width: 32,
                            height: 32,
                            backgroundColor: "#ccc",
                            borderRadius: '2px',
                            overflow: 'hidden'
                        }}>
                        </Box>

                        {/* Text màu chữ tối */}
                        <Box sx={{ display: "flex", flexDirection: "column", flexGrow: 1, overflow: 'hidden' }}>
                            <Typography
                                variant="caption"
                                sx={{ color: "#666", lineHeight: 1.2, whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                            >
                                xpanchox
                            </Typography>
                            <Typography
                                variant="body2"
                                sx={{ color: "#333", fontSize: "13px", fontWeight: "bold", whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}
                            >
                                YG - Im Good
                            </Typography>
                        </Box>

                        {/* Các nút tương tác màu xám, hover lên đen */}
                        <Box sx={{ display: "flex", color: "#666" }}>
                            <IconButton size="small" color="inherit" sx={{ '&:hover': { color: 'black' } }}>
                                <FavoriteBorderIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="inherit" sx={{ '&:hover': { color: 'black' } }}>
                                <PersonAddAltIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" color="inherit" sx={{ '&:hover': { color: 'black' } }}>
                                <QueueMusicIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                </Container>
            </AppBar>
        </div>
    )
}

export default AppFooter