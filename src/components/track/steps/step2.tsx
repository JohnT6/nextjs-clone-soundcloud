import { Box, Button, Grid, LinearProgress, LinearProgressProps, MenuItem, TextField, Typography } from "@mui/material"
import React, { useEffect, useState } from "react";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { styled } from '@mui/material/styles';
import { ITrackUpload } from "../upload.tabs";

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


function InputFileUpload() {
    return (
        <Button
            onClick={(e) => e.preventDefault()}
            component="label" variant="contained" startIcon={<CloudUploadIcon />}>
            Upload file
            <VisuallyHiddenInput type="file" />
        </Button>
    );
}

interface IProps {
    trackUpload: ITrackUpload
}

interface INewTrack {
    title: string,
    description: string,
    trackUrl: string,
    imgUrl: string,
    category: string,
}

const Step2 = (props: IProps) => {
    const { trackUpload } = props

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

    // Mai coi lại các phần của track upload và đang có bug cái process tự về 0%
    console.log("Check info", info);


    return (
        <>
            <div>
                <div>
                    Your uploading track: {props.trackUpload.fileName}
                </div>
                <LinearWithValueLabel
                    trackUpload={trackUpload}
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

                        </div>

                    </div>
                    <div >
                        <InputFileUpload />
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
                        }}>Save</Button>
                </Grid>
            </Grid>
        </>


    )
}

export default Step2