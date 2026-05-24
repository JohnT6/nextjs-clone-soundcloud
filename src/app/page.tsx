import MainSlider from "@/components/main/main.slider";
import Container from '@mui/material/Container';
import { sendRequest } from "@/utils/api";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./api/auth/[...nextauth]/route";

export default async function HomePage() {

  // Get session
  const session = await getServerSession(authOptions);
  console.log("Check session >>>>", session);


  const chills = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "CHILL", limit: 10 },
  })

  const workouts = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "WORKOUT", limit: 10 },
  })

  const party = await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: { category: "PARTY", limit: 10 },
  })


  return (
    <Container>
      <MainSlider
        title={"Top Chills"}
        data={chills?.data ?? []}
      />
      <MainSlider
        title={"Top Workouts"}
        data={workouts?.data ?? []}
      />
      <MainSlider
        title={"Top Party"}
        data={party?.data ?? []}
      />
    </Container>
  );
}
