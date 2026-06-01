'use client'
import { Box, Button, Typography } from "@mui/material";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { sendRequest } from "@/utils/api";

interface IProps {
    track: ITrackTop | null
}

const LikeTrack = (props: IProps) => {
    const { data: session } = useSession()
    const router = useRouter();
    const { track } = props;

    // State lưu danh sách các track user đã like
    const [trackLikes, setTrackLikes] = useState<ITrackLike[] | null>(null);

    // KIỂM TRA TRẠNG THÁI: Quét xem track hiện tại có nằm trong mảng đã like không
    const isLiked = trackLikes?.some(t => t._id === track?._id) || false;

    // 1. Hàm lấy danh sách Like của User
    const fetchData = async () => {
        if (session?.access_token) {
            // Đã sửa lại URL thành /likes thay vì /comments
            const res2 = await sendRequest<IBackendRes<IModelPaginate<ITrackLike>>>({
                url: `http://localhost:8000/api/v1/likes`,
                method: "GET",
                queryParams: {
                    current: 1,
                    pageSize: 100,
                    sort: "-createdAt"
                },
                headers: {
                    Authorization: `Bearer ${session.access_token}`,
                }
            })
            if (res2.data?.result) {
                setTrackLikes(res2?.data?.result)
            }
        }
    }

    // Tự động fetch data khi có session (người dùng đã đăng nhập)
    useEffect(() => {
        fetchData();
    }, [session])

    // 2. Hàm xử lý khi click nút Like
    const handleLikeTrack = async () => {
        // Chặn nếu chưa đăng nhập
        if (!session?.access_token) {
            alert("Vui lòng đăng nhập để thả tim bài hát!");
            return;
        }

        // Đã like rồi bấm phát nữa là Unlike (-1), chưa like thì Like (1)
        const quantity = isLiked ? -1 : 1;

        await sendRequest<IBackendRes<ITrackLike>>({
            url: `http://localhost:8000/api/v1/likes`,
            method: "POST",
            body: {
                track: track?._id,
                quantity: quantity
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            }
        })

        // Cập nhật lại UI sau khi call API thành công
        fetchData();
        router.refresh(); // Gọi next.js fetch lại dữ liệu bài hát (lượt like, lượt play)
    }

    return (
        <Box sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 2,
            pb: 2,
            borderBottom: "1px solid #e5e5e5"
        }}>

            {/* --- BÊN TRÁI: NÚT THẢ TIM --- */}
            <Button
                variant="outlined"
                onClick={handleLikeTrack} // GẮN HÀM XỬ LÝ VÀO ĐÂY
                sx={{
                    minWidth: "40px",
                    height: "32px",
                    padding: "0 10px",
                    borderColor: isLiked ? "#f50" : "#e5e5e5",
                    color: isLiked ? "#f50" : "#333",
                    bgcolor: "white",
                    borderRadius: "3px",
                    boxShadow: "none",
                    '&:hover': {
                        borderColor: isLiked ? "#f50" : "#ccc",
                        backgroundColor: "white"
                    }
                }}
            >
                {/* Icon đổi linh hoạt dựa vào biến isLiked tính toán tự động */}
                {isLiked ? <FavoriteIcon fontSize="small" /> : <FavoriteBorderIcon fontSize="small" />}
            </Button>

            {/* --- BÊN PHẢI: THỐNG KÊ LƯỢT NGHE & TIM --- */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 3, color: "#999" }}>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <PlayArrowIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#666" }}>
                        {track?.countPlay}
                    </Typography>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                    <FavoriteIcon sx={{ fontSize: 16 }} />
                    <Typography variant="body2" sx={{ fontWeight: 500, color: "#666" }}>
                        {track?.countLike}
                    </Typography>
                </Box>

            </Box>

        </Box>
    )
}

export default LikeTrack