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

interface IProps {
    data: ITrackTop[],
    title: string
}

const MainSlider = (props: IProps) => {
    const { data, title } = props
    // Thay vì dùng Button, dùng IconButton của MUI sẽ dễ làm hình tròn hơn
    const NextArrow = (props: any) => {
        const { className, onClick } = props;
        // Nếu react-slick gắn class 'slick-disabled', nút sẽ bị ẩn đi hoàn toàn
        if (className?.includes("slick-disabled")) return null;

        return (
            <IconButton
                onClick={onClick}
                sx={{
                    position: "absolute",
                    right: "-20px", // Đẩy nút ra giữa mép slider giống SoundCloud
                    top: "40%",
                    zIndex: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#fff",
                    border: "1px solid #333",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                    },
                    width: 40,
                    height: 40,
                }}
            >
                <ChevronRightIcon fontSize="large" />
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
                    left: "-20px",
                    top: "40%",
                    zIndex: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                    color: "#fff",
                    border: "1px solid #333",
                    "&:hover": {
                        backgroundColor: "rgba(0, 0, 0, 0.9)",
                    },
                    width: 40,
                    height: 40,
                }}
            >
                <ChevronLeftIcon fontSize="large" />
            </IconButton>
        )
    }

    const settings: Settings = {
        infinite: false, // BẮT BUỘC: Đổi thành false để kích hoạt tính năng chặn ở hai đầu
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 5,
        nextArrow: <NextArrow />,
        prevArrow: <PrevArrow />,
    };

    return (
        <Box
            sx={{
                margin: "20px 50px",
                position: "relative", // Cần thiết để các nút absolute căn chỉnh chuẩn theo Box này
                "& .track": {
                    padding: "0 10px",

                    "img": {
                        height: 200,
                        width: 200
                    }

                },
                "& h3": {
                    border: "1px solid #ccc",
                    padding: "20px",
                    height: "200px",
                }
            }}
        >
            <h2 style={{ marginBottom: "15px" }}> More of what you like </h2>

            <Slider {...settings}>
                {data.map(track => {
                    return (
                        <div className="track" key={track._id}>
                            <img src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${track.imgUrl}`} alt="imgTrack" />
                            <h4>{track.title}</h4>
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