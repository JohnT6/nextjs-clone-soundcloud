import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Typography from '@mui/material/Typography';
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Image from "next/image";
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import type { Metadata } from 'next';

// 1. CẤU HÌNH SEO CHO TRANG
export const metadata: Metadata = {
    title: 'Bài hát đã thích',
    description: 'Danh sách các bài hát bạn đã thả tim',
}

const LikePage = async () => {
    // 2. LẤY SESSION ĐỂ CÓ TOKEN GỌI API
    const session = await getServerSession(authOptions);

    // 3. FETCH DATA VỚI CƠ CHẾ REVALIDATE BẰNG TAGS
    const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/likes`,
        method: "GET",
        queryParams: { current: 1, pageSize: 100 },
        headers: {
            Authorization: `Bearer ${session?.access_token}`,
        },
        nextOption: {
            next: { tags: ['liked-by-user'] } // <--- Gắn tag ở đây cực chuẩn
        }
    });

    const likes = res?.data?.result ?? [];

    return (
        <Container sx={{ mt: 3, p: 3, background: "#f3f6f9", borderRadius: "3px" }}>

            {/* --- PHẦN HEADER TIÊU ĐỀ --- */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, color: "#333" }}>
                    Bài hát bạn đã thích
                </Typography>
                <Typography variant="body2" sx={{ color: "#666" }}>
                    {likes.length} bài hát
                </Typography>
            </Box>

            <Divider variant="middle" sx={{ mb: 3 }} />

            {/* --- PHẦN LƯỚI HIỂN THỊ DANH SÁCH BÀI HÁT (GRID) --- */}
            <Box sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", // Tự động co giãn chia cột, mỗi cột tối thiểu 180px
                gap: 3 // Khoảng cách giữa các bài hát
            }}>
                {likes.map((track) => {
                    return (
                        <Box key={track._id} sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 1,
                            transition: "all 0.2s",
                            cursor: "pointer",
                            "&:hover": {
                                opacity: 0.8 // Hover vào thì ảnh hơi mờ đi 1 chút
                            }
                        }}>

                            {/* KHỐI CHỨA ẢNH BO GÓC TỶ LỆ 1:1 */}
                            <Link href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                <Box sx={{ position: "relative", width: "100%", aspectRatio: "1/1" }}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                        alt={track.title}
                                        fill
                                        style={{
                                            objectFit: "cover",
                                            borderRadius: "4px", // Bo góc nhẹ cho giống SoundCloud
                                            border: "1px solid #e5e5e5"
                                        }}
                                    />
                                </Box>
                            </Link>

                            {/* TEXT TÊN BÀI HÁT & TÊN TÁC GIẢ */}
                            <Box sx={{ overflow: "hidden", px: 0.5 }}>
                                <Link
                                    href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Typography sx={{
                                        fontSize: "14px",
                                        fontWeight: 600,
                                        color: "#333",
                                        whiteSpace: "nowrap",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis" // Quá dài thì ...
                                    }}>
                                        {track.title}
                                    </Typography>
                                </Link>

                                <Typography sx={{
                                    fontSize: "13px",
                                    color: "#999",
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis"
                                }}>
                                    {track.uploader?.name ?? "Unknown"}
                                </Typography>
                            </Box>

                        </Box>
                    )
                })}
            </Box>

            {/* TRƯỜNG HỢP CHƯA LIKE BÀI NÀO */}
            {likes.length === 0 && (
                <Box sx={{ textAlign: "center", py: 5, color: "#999" }}>
                    <Typography variant="body1">
                        Bạn chưa thả tim bài hát nào cả. Khám phá thêm nhạc đi!
                    </Typography>
                </Box>
            )}

        </Container>
    )
}

export default LikePage;