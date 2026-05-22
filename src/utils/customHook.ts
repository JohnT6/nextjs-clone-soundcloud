import { useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js'
import { WaveSurferOptions } from 'wavesurfer.js'


export const useHasMounted = () => {
    const [hasMounted, setHasMounted] = useState<boolean>(false);
    useEffect(() => {
        setHasMounted(true);
    }, []);

    return hasMounted;
}


export const useWaveSurfer = (containerRef: React.RefObject<HTMLDivElement>, options: Omit<WaveSurferOptions, 'container'>) => {
    const [waveSurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

    // Initialize wavesurfer when the container mounts
    // or any of the props change
    useEffect(() => {
        if (!containerRef.current) return
        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current,
            renderFunction: (channels, ctx) => {
                const { width, height } = ctx.canvas;
                const barWidth = options.barWidth || 2;
                const barGap = options.barGap || 1;
                // Bỏ barRadius nếu muốn vuông vức giống SC chuẩn, hoặc để 1-2 nếu muốn bo nhẹ
                const barRadius = options.barRadius || 0;

                // Khe hở ở giữa chia cắt sóng trên và sóng dưới (SoundCloud vibe)
                const gapBetweenTopAndBottom = 0.5;

                const barCount = Math.floor(width / (barWidth + barGap));
                const step = Math.floor(channels[0].length / barCount);

                // Tỉ lệ SoundCloud: Sóng trên chiếm 70%, sóng dưới chiếm 30%
                const topPartHeight = height * 0.7;
                const bottomPartHeight = height * 0.3;

                // --- THÊM MỚI: Tạo 2 mảng để chứa tọa độ thay vì vẽ luôn ra Canvas ---
                const topRects: [number, number, number, number][] = [];
                const bottomRects: [number, number, number, number][] = [];
                // -------------------------------------------------------------------

                // --- SỬA: Đã xóa dòng ctx.beginPath() ở đây và dời xuống dưới cùng ---

                for (let i = 0; i < barCount; i++) {
                    let sumTop = 0;
                    let sumBottom = 0;

                    for (let j = 0; j < step; j++) {
                        const index = i * step + j;
                        const topValue = Math.abs(channels[0][index] || 0);
                        const bottomValue = Math.abs(channels[1]?.[index] || 0);

                        sumTop += topValue;
                        sumBottom += bottomValue;
                    }

                    const avgTop = sumTop / step;
                    const avgBottom = sumBottom / step;

                    // Khuếch đại biên độ sóng lên một chút cho đẹp (tùy file nhạc)
                    const barHeight = (avgTop + avgBottom) * 1.5;

                    // Tính toán chiều cao thực tế của thanh trên và thanh dưới
                    const drawTopHeight = barHeight * topPartHeight;
                    const drawBottomHeight = barHeight * bottomPartHeight;

                    // TOÁN HỌC ĐỂ VẼ THANH TRÊN VÀ THANH DƯỚI RỜI NHAU
                    const xPos = i * (barWidth + barGap);

                    // 1. Vẽ thanh nửa trên (Mọc từ dưới lên, chạm mốc topPartHeight)
                    // Tọa độ Y bắt đầu = Điểm giữa - Chiều cao thanh
                    // Chiều cao = drawTopHeight

                    // --- SỬA: Đổi ctx.rect thành đẩy tọa độ vào mảng topRects ---
                    topRects.push([
                        xPos,
                        topPartHeight - drawTopHeight - gapBetweenTopAndBottom,
                        barWidth,
                        drawTopHeight
                    ]);

                    // 2. Vẽ thanh nửa dưới - Bóng phản chiếu (Mọc từ trên xuống, bắt đầu từ topPartHeight)
                    // Tọa độ Y bắt đầu = Điểm giữa + Khe hở
                    // Chiều cao = drawBottomHeight

                    // --- SỬA: Đổi ctx.rect thành đẩy tọa độ vào mảng bottomRects ---
                    bottomRects.push([
                        xPos,
                        topPartHeight + gapBetweenTopAndBottom,
                        barWidth,
                        drawBottomHeight
                    ]);
                }

                // --- SỬA: Xóa ctx.fill() và ctx.closePath() cũ, thay bằng 2 nhịp vẽ độc lập ---

                // Nhịp 1: Vẽ toàn bộ nửa trên (Rõ nét 100%)
                ctx.globalAlpha = 0.5;
                ctx.beginPath();
                topRects.forEach(rect => ctx.rect(...rect));
                ctx.fill();
                ctx.closePath();

                // Nhịp 2: Vẽ toàn bộ nửa dưới (Giảm mờ còn 40% để làm bóng phản chiếu)
                ctx.globalAlpha = 0.7;
                ctx.beginPath();
                bottomRects.forEach(rect => ctx.rect(...rect));
                ctx.fill();
                ctx.closePath();

                // Khôi phục lại độ mờ mặc định để không ảnh hưởng đến các thành phần khác
                ctx.globalAlpha = 1.0;

                // ------------------------------------------------------------------------------
            },

        })

        setWavesurfer(ws);

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return waveSurfer
}