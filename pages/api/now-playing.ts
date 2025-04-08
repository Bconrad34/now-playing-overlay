import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import SpotifyWebApi from "spotify-web-api-node";
import { NowPlayingTrack } from '../../types';

export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse<NowPlayingTrack | { error: string, isPlaying: boolean }>
) {
  const session = await getServerSession(req, res, authOptions);
  
  if (!session || !session.accessToken) {
    return res.status(401).json({ error: "Not authenticated", isPlaying: false });
  }

  const spotifyApi = new SpotifyWebApi({
    clientId: process.env.SPOTIFY_CLIENT_ID,
    clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  });
  
  spotifyApi.setAccessToken(session.accessToken);
  
  try {
    const response = await spotifyApi.getMyCurrentPlayingTrack();
    
    if (response.body && response.body.item) {
      const { item } = response.body;
      const isPlaying = response.body.is_playing;
      
      // Check if it's a track (has artists) or an episode (from podcast)
      if ('artists' in item) {
        // It's a track
        return res.status(200).json({
          isPlaying,
          title: item.name,
          artist: item.artists.map(artist => artist.name).join(", "),
          album: item.album.name,
          albumArt: item.album.images[0]?.url,
          songUrl: item.external_urls.spotify,
        });
      } else {
        // It's a podcast episode
        return res.status(200).json({
          isPlaying,
          title: item.name,
          artist: item.show?.name || "Podcast",
          albumArt: item.images[0]?.url,
          songUrl: item.external_urls.spotify,
        });
      }
    } else {
      return res.status(200).json({ isPlaying: false });
    }
  } catch (error) {
    console.error("Error fetching now playing:", error);
    return res.status(500).json({ error: "Error fetching now playing", isPlaying: false });
  }
}