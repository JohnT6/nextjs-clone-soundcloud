'use client'
import { Box, Avatar, Typography, Button, InputBase } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/People';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchDefaultImages, sendRequest } from "@/utils/api";
import { useSession } from "next-auth/react";
import { formatTime, formatTimeAgo } from "@/utils/customHook";
import { useState } from "react";
import { useRouter } from "next/navigation";
import WaveSurfer from 'wavesurfer.js';
import { useTrackContext } from "@/app/lib/track.wrapper";
import LikeTrack from "./like.track";


interface IProps {
    track: ITrackTop | null
    trackComment: ITrackComment[]
    // Khai báo kiểu cho waveSurfer, có thể null lúc ban đầu chưa load xong
    waveSurfer: WaveSurfer | null;
}


const CommentTrack = (props: IProps) => {
    const router = useRouter();

    const { data: session } = useSession()
    const { track, trackComment, waveSurfer } = props

    const [yourComment, setYourComment] = useState("");
    const { currentTrack, setCurrentTrack } = useTrackContext() as ITrackContext;


    const handleSubmit = async () => {
        const res = await sendRequest<IBackendRes<ITrackComment>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/comments`,
            method: "POST",
            body: {
                content: yourComment,
                moment: Math.round(waveSurfer?.getCurrentTime() ?? 0),
                track: track?._id
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })
        if (res.data) {
            setYourComment("");
            router.refresh();
        }

    }

    const handleJumpTrack = (moment: number) => {
        // Do dùng context để cập nhật Duration bên footer và waveSurfer nên ko cần các waveSurfer này
        // if (waveSurfer) {
        //     const duration = waveSurfer.getDuration();
        //     waveSurfer.seekTo(moment / duration);
        //     waveSurfer.play()
        // }
        // Cập nhật Context: Ép cả Sóng âm và Footer phải nhảy theo
        setCurrentTrack(prev => ({
            ...prev,
            isPlaying: true,            // Đã bấm vào số giây thì cho nhạc tự động phát luôn
            trackCurrentTime: moment    // Bắn số giây vào đây để Footer và Sóng âm cùng nhận lệnh
        }));
    }

    return (
        <Box sx={{
            bgcolor: "#ffffff", // Trả về nền trắng sáng
            color: "#333", // Chữ đổi sang màu tối
            // p: 3,
            mt: 2,
            fontFamily: "Inter, sans-serif"
        }}>

            {/* === PHẦN 1: THANH NHẬP BÌNH LUẬN === */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Avatar src={fetchDefaultImages(session?.user.type!)} sx={{ width: 40, height: 40 }} />
                <InputBase
                    placeholder="Write a comment"
                    value={yourComment}
                    onChange={(e) => setYourComment(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") handleSubmit() }}
                    sx={{
                        flex: 1,
                        bgcolor: "#f2f2f2", // Khung chat màu xám nhạt
                        color: "#333",
                        px: 2,
                        py: 0.5,
                        borderRadius: 1,
                        fontSize: "14px",
                        border: "1px solid #e5e5e5",
                        transition: "all 0.2s ease-in-out", // Thêm cái này để lúc đổi màu nó mượt mà, không bị giật cục

                        // ĐÂY CHÍNH LÀ CHỖ XỬ LÝ KHI CLICK VÀO Ô INPUT
                        '&.Mui-focused': {
                            border: "1px solid #f50", // Đổi viền thành màu cam
                            bgcolor: "#fff", // Đổi nền thành màu trắng cho nó nổi bật chữ
                        }
                    }}
                />
            </Box>

            <div>
                <LikeTrack
                    track={track}
                />
            </div>

            {/* === PHẦN 2: MAIN LAYOUT (CHIA 2 CỘT) === */}
            <Box sx={{ display: "flex", gap: 5 }}>

                {/* --- CỘT TRÁI: THÔNG TIN UPLOADER --- */}
                <Box sx={{ width: "200px", display: "flex", flexDirection: "column", alignItems: "center" }}>
                    <Avatar
                        src={fetchDefaultImages(track?.uploader.type!)}
                        sx={{ width: 120, height: 120, mb: 2 }}
                    />
                    <Typography variant="body1" fontWeight="bold" sx={{ mb: 1, color: "#333" }}>
                        {track?.uploader.name}
                    </Typography>

                    {/* Thống kê (Followers & Tracks) */}
                    <Box sx={{ display: "flex", gap: 2, color: "#999", mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <PeopleIcon sx={{ fontSize: 16 }} />
                            <Typography variant="caption">99</Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LibraryMusicIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption">4</Typography>
                        </Box>
                    </Box>

                    {/* Nút hành động mang bản sắc SoundCloud */}
                    <Button
                        variant="contained"
                        fullWidth
                        sx={{
                            bgcolor: "#f50", // Màu cam đặc trưng của SC Light Mode
                            color: "white",
                            textTransform: "none",
                            fontWeight: "bold",
                            borderRadius: 1,
                            mb: 1,
                            boxShadow: "none",
                            '&:hover': { bgcolor: "#d44000", boxShadow: "none" }
                        }}
                    >
                        Follow
                    </Button>
                    <Button
                        variant="text"
                        fullWidth
                        sx={{
                            color: "#999",
                            textTransform: "none",
                            justifyContent: "flex-start",
                            '&:hover': { color: "#333" } // Hover hiện rõ chữ màu đen
                        }}
                    >
                        Report
                    </Button>
                </Box>

                {/* --- CỘT PHẢI: DANH SÁCH BÌNH LUẬN --- */}
                <Box sx={{ flex: 1 }}>
                    {/* Header: Số lượng bình luận & Nút Filter */}
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #e5e5e5", pb: 2, mb: 3 }}>
                        <Typography sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: "bold", color: "#999" }}>
                            <span style={{ color: "#333" }}>{trackComment.length} comments</span>
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, cursor: "pointer", color: "#666", '&:hover': { color: "#333" } }}>
                            <Typography variant="body2">Sorted by: <span style={{ color: "#333", fontWeight: "bold" }}>Newest</span></Typography>
                            <KeyboardArrowDownIcon fontSize="small" />
                        </Box>
                    </Box>

                    {/* Render List Bình Luận */}
                    {trackComment.map((comment) => (
                        <Box key={comment._id} sx={{ display: "flex", gap: 2, mb: 4 }}>
                            <Avatar src={fetchDefaultImages(comment.user.type)} sx={{ width: 40, height: 40 }} />

                            <Box sx={{ flex: 1, display: "flex", flexDirection: "column", gap: 0.5 }}>
                                {/* Tên + Thời gian */}
                                <Box sx={{ display: "flex", alignItems: "baseline", gap: 1 }}>
                                    <Typography variant="body2" sx={{ fontWeight: "bold", color: "#999", '&:hover': { color: "#333", cursor: "pointer" } }}>
                                        {comment.user.name}
                                    </Typography>
                                    {/* Cần coi lại khúc này do cái footer và cái waveSurfer ko đồng bộ */}
                                    <Typography variant="caption" sx={{ color: "#999" }} onClick={() => handleJumpTrack(comment.moment)}>
                                        at {formatTime(comment.moment)}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: "#999" }}>
                                        • {formatTimeAgo(comment.createdAt)}
                                    </Typography>
                                </Box>

                                {/* Nội dung bình luận */}
                                <Typography variant="body2" sx={{ color: "#333" }}>
                                    {comment.content}
                                </Typography>

                                {/* Nút Reply */}
                                <Typography
                                    variant="caption"
                                    sx={{
                                        color: "#999",
                                        mt: 0.5,
                                        cursor: "pointer",
                                        width: "fit-content",
                                        border: "1px solid transparent",
                                        padding: "2px 8px",
                                        borderRadius: "3px",
                                        marginLeft: "-8px", // Bù lề cho cân đối
                                        '&:hover': { color: "#333", border: "1px solid #e5e5e5" }
                                    }}
                                >
                                    Reply
                                </Typography>
                            </Box>

                            {/* Cột Tương tác (Thả tim) */}
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", minWidth: "30px" }}>
                                <FavoriteBorderIcon sx={{ fontSize: 16, color: "#999", cursor: "pointer", '&:hover': { color: "#f50" } }} />

                                <Typography variant="caption" sx={{ color: "#999", mt: 0.5 }}>
                                    0
                                </Typography>
                                {/* {comment.likes > 0 && (
                                    
                                )} */}
                            </Box>
                        </Box>
                    ))}

                </Box>
            </Box>

        </Box>
    )
}

export default CommentTrack