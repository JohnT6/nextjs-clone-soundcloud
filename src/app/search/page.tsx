// File: src/app/search/page.tsx
import Container from "@mui/material/Container";
import ClientSearch from "./components/client.search";
import { Suspense } from "react";

const SearchPage = () => {
    return (
        <Container>
            {/* Phải có Suspense bọc ngoài để Next.js không bị "tẩu hỏa nhập ma" lúc Build SSG */}
            <Suspense fallback={<div>Đang tải kết quả tìm kiếm...</div>}>
                <ClientSearch />
            </Suspense>
        </Container>
    )
}

export default SearchPage;