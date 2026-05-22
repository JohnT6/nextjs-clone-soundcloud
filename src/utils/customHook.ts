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


export const useWasesurfer = (containerRef: React.RefObject<HTMLDivElement>, options: Omit<WaveSurferOptions, 'container'>) => {
    const [waveSurfer, setWavesurfer] = useState<WaveSurfer | null>(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const ws = WaveSurfer.create({
            ...options,
            container: containerRef.current
        })

        setWavesurfer(ws);

        return () => {
            ws.destroy()
        }
    }, [options, containerRef])

    return waveSurfer
}