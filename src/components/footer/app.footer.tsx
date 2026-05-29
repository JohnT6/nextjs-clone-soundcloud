'use client'
import { useHasMounted } from "@/utils/customHook";
import { AppBar, Container } from "@mui/material"
import { log } from "console";
import AudioPlayer from 'react-h5-audio-player';
//@ts-ignore
import 'react-h5-audio-player/lib/styles.css';


const AppFooter = () => {
    const hasMounted = useHasMounted();

    if (!hasMounted) return (<></>)

    return (
        <div style={{ marginTop: 50 }}>
            <AppBar position="fixed" color="primary"
                sx={{
                    top: 'auto',
                    bottom: 0,
                    backgroundColor: "#f2f2f2"
                }}>
                <Container
                    sx={{
                        display: "flex",
                        gap: 10
                    }}
                >
                    <AudioPlayer
                        src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/tracks/hoidanit.mp3`}
                        volume={0.5}
                        style={{
                            backgroundColor: "#f2f2f2",
                            boxShadow: "unset"
                        }}
                    // Try other props!
                    />
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "start",
                        justifyContent: "center",
                        minWidth: 100
                    }}>
                        <div style={{ color: "#ccc" }}>Genzo</div>
                        <div style={{ color: "black" }}>Who am i?</div>
                    </div>
                </Container>
            </AppBar>

        </div>
    )
}

export default AppFooter