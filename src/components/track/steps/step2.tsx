import { Box, Button, Grid, LinearProgress, LinearProgressProps, MenuItem, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { ITrackUpload } from "../upload.tabs";
import { useSession } from "next-auth/react"
import axios from "axios";
import { sendRequest } from "@/utils/api";
import { useToast } from "@/utils/toast";

function LinearProgressWithLabel(props: LinearProgressProps & { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" {...props} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(
                    props.value,
                )}%`}</Typography>
            </Box>
        </Box>
    );
}

function LinearWithValueLabel(props: IProps) {



    return (
        <Box sx={{ width: '100%' }}>
            <LinearProgressWithLabel value={props.trackUpload.percent} />
        </Box>
    );
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

interface IUploadImages {
    info: INewTrack,
    setInfo: (v: INewTrack) => void
}

function InputFileUpload(props: IUploadImages) {
    const { data: session } = useSession()
    const handleUpload = async (image: File) => {
        const formData = new FormData();
        formData.append("fileUpload", image);
        try {
            const res = await axios.post("http://localhost:8000/api/v1/files/upload", formData, {
                headers: {
                    Authorization: `Bearer ${session?.access_token}`,
                    "target_type": "images",
                    // delay: 5000
                },

            })
            props.setInfo({
                ...props.info,
                imgUrl: res?.data.data.fileName
            })
            // console.log("Check res", res);
            // console.log("Check filename", res?.data.data.fileName);

        } catch (error) {
            //@ts-ignore
            console.log("Check err:", error?.response?.data);
            //@ts-ignore
            alert(error?.response?.data.message)
        }
    }

    return (
        <Button
            onChange={(e) => {
                const event = e.target as HTMLInputElement
                if (event.files) {
                    handleUpload(event.files[0])
                }
            }

            }
            // onClick={(e) => e.preventDefault()}
            component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

interface IProps {
    trackUpload: ITrackUpload,
    setValue: (v: number) => void
}

interface INewTrack {
    title: string,
    description: string,
    trackUrl: string,
    imgUrl: string,
    category: string,
}

const Step2 = (props: IProps) => {
    const { data: session } = useSession()

    const { trackUpload } = props

    const toast = useToast()

    const [info, setInfo] = useState<INewTrack>({
        title: "",
        description: "",
        trackUrl: "",
        imgUrl: "",
        category: "",
    });
    console.log("Check trackUpload", trackUpload);

    useEffect(() => {
        if (trackUpload && trackUpload.uploadedTrackName) {
            setInfo({
                ...info,
                trackUrl: trackUpload.uploadedTrackName
            })
        }
    }, [trackUpload])

    const category = [
        {
            value: 'CHILL',
            label: 'CHILL',
        },
        {
            value: 'WORKOUT',
            label: 'WORKOUT',
        },
        {
            value: 'PARTY',
            label: 'PARTY',
        }
    ];

    const handleSubmitUpload = async () => {
        const res = await sendRequest<IBackendRes<ITrackTop[]>>({
            url: "http://localhost:8000/api/v1/tracks",
            method: "POST",
            body: {
                title: info.title,
                description: info.description,
                trackUrl: info.trackUrl,
                imgUrl: info.imgUrl,
                category: info.category,
            },
            headers: {
                Authorization: `Bearer ${session?.access_token}`,
            },
        })
        if (res.data) {
            toast.success("Create a new track success!")
            props.setValue(0)
            // alert("Create Success")
        } else {
            toast.error(res.message)
            // alert(res.message)
        }
    }




    return (
        <>
            <div>
                <div>
                    Your uploading track: {props.trackUpload.fileName}
                </div>
                <LinearWithValueLabel
                    trackUpload={trackUpload}
                    setValue={props.setValue}
                />
            </div>

            <Grid container spacing={2} mt={5}>
                <Grid item xs={6} md={4}
                    sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "column",
                        gap: "10px"
                    }}
                >
                    <div style={{ height: 250, width: 250, background: "#ccc" }}>
                        <div>
                            {info.imgUrl && <img style={{ height: 250, width: 250, background: "#ccc", objectFit: "cover" }} src={`${process.env.NEXT_PUBLIC_BACKEND_URL}/images/${info.imgUrl}`} />}
                        </div>

                    </div>
                    <div >
                        <InputFileUpload
                            info={info}
                            setInfo={setInfo}
                        />
                    </div>

                </Grid>
                <Grid item xs={6} md={8}>
                    <TextField
                        value={info.title}
                        onChange={(e) => setInfo({
                            ...info,
                            title: e.target.value
                        })}
                        label="Title"
                        variant="standard"
                        fullWidth
                        margin="dense" />
                    <TextField
                        value={info.description}
                        onChange={(e) => setInfo({
                            ...info,
                            description: e.target.value
                        })}
                        label="Description"
                        variant="standard"
                        fullWidth
                        margin="dense" />
                    <TextField
                        sx={{
                            mt: 3
                        }}
                        value={info.category}
                        onChange={(e) => setInfo({
                            ...info,
                            category: e.target.value
                        })}
                        select
                        label="Category"
                        fullWidth
                        variant="standard"
                    //   defaultValue="EUR"
                    >
                        {category.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <Button
                        variant="outlined"
                        sx={{
                            mt: 5
                        }}
                        onClick={() => handleSubmitUpload()}
                    >
                        Save
                    </Button>
                </Grid>
            </Grid>
        </>


    )
}

export default Step2