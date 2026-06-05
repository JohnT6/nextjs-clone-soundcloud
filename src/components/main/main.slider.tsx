'use client'
// @ts-ignore
import "slick-carousel/slick/slick.css";
// @ts-ignore
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { Settings } from "react-slick";
import { Box } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Divider from '@mui/material/Divider';
import Link from "next/link";
import { convertSlugUrl } from "@/utils/api";
import Image from "next/image";

// Nhớ import interface ITrackTop của bạn ở đây nếu cần

interface IProps {
    data: ITrackTop[],
    title: string
}

const MainSlider = (props: IProps) => {
    const { data, title } = props

    const NextArrow = (props: any) => {
        const { className, onClick } = props;
        if (className?.includes("slick-disabled")) return null;

        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    right: "-15px",
                    top: "35%", // Đẩy lên 35% để nằm ngay tâm bức ảnh thay vì tâm cả cục slide
                    zIndex: 2,
                    backgroundColor: "rgba(17, 17, 17, 0.8)", // Màu đen mờ chuẩn SC
                    color: "#fff",
                    // Bỏ border đi cho nút liền mạch giống SoundCloud
                    "&:hover": {
                        backgroundColor: "rgba(17, 17, 17, 1)", // Hover thì đen đặc lại
                    },
                    width: 36,
                    height: 36,
                }}
            >
                <ChevronRightIcon />
            </IconButton>
        )
    }

    const PrevArrow = (props: any) => {
        const { className, onClick } = props;
        if (className?.includes("slick-disabled")) return null;

        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    left: "-15px",
                    top: "35%",
                    zIndex: 2,
                    backgroundColor: "rgba(17, 17, 17, 0.8)",
                    color: "#fff",
                    "&:hover": {
                        backgroundColor: "rgba(17, 17, 17, 1)",
                    },
                    width: 36,
                    height: 36,
                }}
            >
                <ChevronLeftIcon />
            </IconButton>
        )
    }

    const settings: Settings = {
        infinite: false,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 600,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                    initialSlide: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1
                }
            }
        ]

    };

    return (
        <Box
            sx={{
                margin: "0 50px",
                position: "relative",
                paddingTop: "20px",

                // STYLE CHO TỪNG TRACK
                "& .track": {
                    padding: "0 10px",
                    cursor: "pointer", // Trỏ chuột vào biến thành bàn tay

                    "img": {
                        width: "100%",          // Tự co giãn theo cột của slider
                        aspectRatio: "1/1",     // Ép thành hình vuông
                        objectFit: "cover",     // Ảnh không bị méo
                        borderRadius: "4px"     // Bo góc nhẹ giống SoundCloud
                    }
                },

                // STYLE CHO TIÊU ĐỀ (TÊN BÀI HÁT)
                "& h4": {
                    marginTop: "8px",
                    marginBottom: "4px",
                    fontSize: "15px",
                    fontWeight: "600",
                    // Cụm 3 dòng dưới giúp tạo dấu 3 chấm (...) nếu tên quá dài
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                },

                // STYLE CHO TÊN TÁC GIẢ
                "& h5": {
                    margin: 0,
                    fontSize: "13px",
                    color: "#999999", // Màu xám nhạt
                    fontWeight: "normal",
                    // Cắt chữ dài thành 3 chấm
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    "&:hover": {
                        color: "#ccc", // Hover vào sáng lên tí
                    }
                }
            }}
        >
            <h2 style={{ marginBottom: "15px", paddingLeft: "10px" }}> {title} </h2>

            <Slider {...settings}>
                {data.map(track => {
                    return (
                        <div className="track" key={track._id}>
                            <Link href={`/track/${convertSlugUrl(track.title)}-${track._id}.html?audio=${track.trackUrl}`}>
                                {/* <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt="imgTrack" /> */}
                                {/* ĐÂY LÀ CHÌA KHÓA: Bọc ảnh vào một cái hộp vuông (1/1) có position relative */}
                                <div style={{ position: "relative", width: "100%", aspectRatio: "1/1", marginBottom: "10px" }}>
                                    <Image
                                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`}
                                        alt={track.title}
                                        fill // Giờ nó chỉ fill đúng cái div bọc ngoài này thôi
                                        style={{
                                            objectFit: "cover", // Sửa thành cover để ảnh lấp đầy mà không bị méo
                                            borderRadius: "4px"
                                        }}
                                    />
                                </div>
                                <h4>{track.title}</h4>
                            </Link>
                            <h5>{track.uploader.name}</h5>
                        </div>
                    )
                })}
            </Slider>
            <Divider sx={{ marginTop: "30px", backgroundColor: "#333" }} />
        </Box>
    );
}

export default MainSlider;