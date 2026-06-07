import Container from "@mui/material/Container";


export async function generateStaticParams() {


    return [
        { slug: "1" },
        { slug: "12" },
        { slug: "123" },
    ]
}



const TestGenerateStaticParams = async ({ params }: { params: Promise<{ slug: string }> }) => {
    const { slug } = await params

    // Cái này dùng để test cái cái SSG Static Site Generation khác với SSR Server Site Rendering như thế nào
    await new Promise(resolve => setTimeout(resolve, 5000))

    return (
        <div>
            <Container>
                test slug = {slug}
            </Container>
        </div>
    )
}

export default TestGenerateStaticParams;