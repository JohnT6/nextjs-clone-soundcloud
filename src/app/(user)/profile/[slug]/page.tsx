import ProfileTracks from "@/components/header/profile.track";
import { sendRequest } from "@/utils/api"
import { Container } from "@mui/material";
import Grid from '@mui/material/Grid';


const ProfilePage = async ({ params, }: { params: { slug: string } }) => {
    const tracks = await sendRequest<IBackendRes<IModelPaginate<ITrackTop>>>({
        url: "http://localhost:8000/api/v1/tracks/users?current=1&pageSize=10",
        method: "POST",
        body: { id: params.slug },
    })
    console.log("Check tracks", tracks);

    const data = tracks?.data?.result ?? []
    return (

        <Container sx={{ my: 5 }}>
            <Grid container spacing={5}>
                {data.map((item: any, index: number) => {
                    return (
                        <Grid item xs={12} md={6} key={index}>
                            <ProfileTracks data={item} />
                        </Grid>
                    )
                })}
            </Grid>
        </Container>

    )

}

export default ProfilePage