'use client';

import React, { createContext, useContext, useState } from "react";

const TrackContext = createContext<ITrackContext | null>(null)

export const TrackContextProvider = ({ children }: { children: React.ReactNode }) => {
    const initValue = {
        _id: "",
        title: "",
        description: "",
        category: "",
        imgUrl: "",
        trackUrl: "",
        countLike: 0,
        countPlay: 0,
        uploader: {
            _id: "",
            email: "",
            name: "",
            role: "",
            type: ""
        },
        isDeleted: false,
        createdAt: "",
        updatedAt: "",
        isPlaying: false,
        // dùng lấy tgian của bài nhạc đang phát
        trackCurrentTime: 0
    }
    const [currentTrack, setCurrentTrack] = useState<IShareTrack>(initValue);

    return (
        <TrackContext.Provider value={{ currentTrack, setCurrentTrack }}>
            {children}
        </TrackContext.Provider>
    )
};

export const useTrackContext = () => useContext(TrackContext);