'use client'
import { Box, Avatar, Typography, Button, InputBase } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import PeopleIcon from '@mui/icons-material/People';
import LibraryMusicIcon from '@mui/icons-material/LibraryMusic';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { fetchDefaultImages } from "@/utils/api";
import { useSession } from "next-auth/react";
import { formatTime, formatTimeAgo } from "@/utils/customHook";
import { useState } from "react";

// Mock data giả lập giống hệt trong ảnh
const mockComments = [
    {
        id: 1,
        user: "flywiththebirds",
        avatar: "http://localhost:8000/images/chill1.png",
        atTime: "2:39",
        ago: "4 months ago",
        content: "mustard onnat beat hi",
        likes: 0
    },
    {
        id: 2,
        user: "ImnotTylerjones",
        avatar: "http://localhost:8000/images/chill1.png",
        atTime: "0:00",
        ago: "6 months ago",
        content: "I bet nobody hear in 2025 lol",
        likes: 2
    },
    {
        id: 3,
        user: "InesqueVR",
        avatar: "http://localhost:8000/images/chill1.png",
        atTime: "0:00",
        ago: "4 months ago",
        content: "@imnottylerjones: You right we here in 2026",
        likes: 0
    }
]

interface IProps {
    track: ITrackTop | null
    trackComment: ITrackComment[]
}


const CommentTrack = (props: IProps) => {
    const { data: session } = useSession()
    const { track, trackComment } = props

    const [yourComment, setYourComment] = useState("");


    const handleSubmit = () => {
        console.log(yourComment);

    }

    return (
        <Box sx={{
            bgcolor: "#ffffff", // Trả về nền trắng sáng
            color: "#333", // Chữ đổi sang màu tối
            p: 3,
            mt: 2,
            fontFamily: "Inter, sans-serif"
        }}>

            {/* === PHẦN 1: THANH NHẬP BÌNH LUẬN === */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 5 }}>
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
                                    <Typography variant="caption" sx={{ color: "#999" }}>
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