import { sendRequest } from "@/utils/api";
import Container from "@mui/material/Container";


const TestA = async () => {
    const res = await sendRequest<any>({
        url: `http://localhost:3000/api/test`,
        method: "GET",
        nextOption: {
            // cache: "no-store" => mỗi lần f5 -> fetch data mới
            // cache: "no-store"

            // => chờ hết thời gian trên (có thể tắt máy :v)
            // => khi gửi request mới (nextjs trigger re-render) => request tiếp theo mới nhận kết quả mới
            // next: { revalidate: 10 }


            next: { tags: ["genzo-validate"] }
        }
    })
    return (
        <Container sx={{ mt: 5 }}>
            <div>Test random:</div>
            <div>
                {JSON.stringify(res)}
            </div>
        </Container>
    )
}


export default TestA;