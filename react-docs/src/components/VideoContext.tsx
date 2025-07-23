import { createContext, useContext } from "react";

export type VideoContextType = {
	currentTime: React.RefObject<number>;
	updateCurrentTime: (time: number) => void;
};

export const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function useVideoContext() {
	const videContext = useContext(VideoContext);

	if (videContext === undefined) {
		throw new Error("useVideoContext must be used within a VideoContext");
	}

	return videContext;
}
