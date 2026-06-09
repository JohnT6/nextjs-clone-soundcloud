'use client'

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { sendRequest, convertSlugUrl } from '@/utils/api';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Image from 'next/image';
import Link from 'next/link';

const ClientSearch = () => {
    // 1. Chộp lấy tham số 'q' từ trên thanh URL
    const searchParams = useSearchParams();
    const query = searchParams.get('q');

    // State lưu trữ kết quả tìm kiếm
    const [tracks, setTracks] = useState<ITrackTop[]>([]);

    // 2. Hàm gọi API tìm kiếm
    const fetchData = async (searchQuery: string) => {
        const res = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
            url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/tracks/search`,
            method: "POST",
            body: {
                current: 1,
                pageSize: 10,
                title: searchQuery
            }
        });

        if (res.data?.result) {
            setTracks(res.data.result);
        } else {
            setTracks([]);
        }
    };

    // 3. Theo dõi sự thay đổi của query
    useEffect(() => {
        if (query) {
            // Cập nhật thẻ title của trình duyệt
            document.title = `Kết quả tìm kiếm cho "${query}"`;
            fetchData(query);
        } else {
            document.title = "Tìm kiếm bài hát";
            setTracks([]);
        }
    }, [query]);

    return (
        <Box sx={{ mt: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: "#333", fontWeight: 500 }}>
                Kết quả tìm kiếm cho: <b>{query}</b>
            </Typography>
            <Divider sx={{ mb: 3 }} />

            {/* Hiển thị danh sách kết quả */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {tracks.length > 0 ? (
                    tracks.map((track) => (
                        <Box key={track._id} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <Link href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                <Box sx={{ position: "relative", width: 60, height: 60 }}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                        alt={track.title}
                                        fill
                                        style={{ objectFit: "cover", borderRadius: "4px" }}
                                    />
                                </Box>
                            </Link>
                            <Box>
                                <Link
                                    href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}
                                    style={{ textDecoration: 'none', color: 'unset' }}
                                >
                                    <Typography sx={{ fontWeight: 600, fontSize: "16px", '&:hover': { color: '#f50' } }}>
                                        {track.title}
                                    </Typography>
                                </Link>
                                <Typography sx={{ color: "#999", fontSize: "13px" }}>
                                    {track.uploader?.name ?? "Unknown"}
                                </Typography>
                            </Box>
                        </Box>
                    ))
                ) : (
                    // Nếu gõ tào lao không ra bài nào thì hiện cái này
                    <Typography sx={{ color: "#999", fontStyle: "italic" }}>
                        Không tìm thấy bài hát nào khớp với từ khóa của bạn.
                    </Typography>
                )}
            </Box>
        </Box>
    );
};

export default ClientSearch;