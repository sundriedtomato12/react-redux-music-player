import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
  peekQueue,
  selectCurrentSong,
  SongInfo,
  turnLoopOn,
  turnLoopOff,
  turnLoopOneOn,
  turnLoopOneOff,
  turnShuffleOff,
  turnShuffleOn,
  pauseSong,
  playSong,
  rewindSong,
  fastForwardSong,
  playNextSong,
  playPreviousSong,
  restartSong,
  resetSongList,
  resetSongListShuffle,
} from '../music-player/redux/musicPlayerSlice'
import { RootState } from '../../store'
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Icon,
  Slider,
} from '@mui/material'
import RepeatIcon from '@mui/icons-material/Repeat'
import RepeatOnIcon from '@mui/icons-material/RepeatOn'
import RepeatOneIcon from '@mui/icons-material/RepeatOne'
import RepeatOneOnIcon from '@mui/icons-material/RepeatOneOn'
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import PauseIcon from '@mui/icons-material/Pause'
import SkipPreviousIcon from '@mui/icons-material/SkipPrevious'
import SkipNextIcon from '@mui/icons-material/SkipNext'
import ShuffleIcon from '@mui/icons-material/Shuffle'
import ShuffleOnIcon from '@mui/icons-material/ShuffleOn'
import TrackBar from './components/TrackBar'
import songLibrary from './library.json'
import { createSelector } from '@reduxjs/toolkit'

export const MusicPlayer = () => {
  const dispatch = useAppDispatch()
  const isShuffle = useSelector((state: RootState) => state.shuffleState)
  const isLoop = useSelector((state: RootState) => state.loopState)
  const isLoopOne = useSelector((state: RootState) => state.loopOneState)
  const songList = useSelector((state: RootState) => state.songList)
  const currentSong = useAppSelector(selectCurrentSong)
  const currentSongState = useSelector(
    (state: RootState) => state.songPlayState,
  )
  const songQueue = useAppSelector(peekQueue)
  const audioRef = useRef<HTMLAudioElement>(null)

  function isSongOver() {
    return currentSongState.currentTime === currentSong.totalDuration
  }

  function isLastSong() {
    return songList.currentSongIndex === songList.songs.length - 1
  }

  function toggleLoopModes() {
    if (!isLoop && !isLoopOne) {
      dispatch(turnLoopOn())
    } else if (isLoop && !isLoopOne) {
      dispatch(turnLoopOff())
      dispatch(turnLoopOneOn())
    } else if (!isLoop && isLoopOne) {
      dispatch(turnLoopOneOff())
    }
  }

  function toggleShuffleMode() {
    if (isShuffle) {
      dispatch(turnShuffleOff())
    } else {
      dispatch(turnShuffleOn())
    }
  }

  function changeSong(songUuid: string) {
    if (isShuffle) {
      dispatch(resetSongListShuffle(songUuid))
    } else {
      dispatch(resetSongList(songUuid))
    }
    dispatch(playSong())
    dispatch(restartSong())
  }

  function executeEndOfSongAction(): void {
    if ((!isLastSong() && !isLoopOne) || (isLastSong() && isLoop)) {
      dispatch(playNextSong())
      dispatch(restartSong())
    } else if (isLastSong() && !isLoop) {
      dispatch(pauseSong())
    } else if (isLoopOne) {
      dispatch(restartSong())
    }
  }

  useEffect(() => {
    if (isSongOver()) {
      executeEndOfSongAction()
    }
  }, [currentSongState.currentTime])

  useEffect(() => {
    let intervalId: any
    const audio = audioRef.current

    if (!audio) {
      return
    }

    if (currentSongState.playing) {
      audio.play()
      intervalId = setInterval(() => {
        dispatch(playSong()) // Assuming you have an action creator for playing the song
      }, 1000) // Increment every second (1000 milliseconds)
    } else {
      audio.pause()
    }

    return () => clearInterval(intervalId)
  }, [currentSongState.playing, currentSong])

  return (
    <>
      <audio ref={audioRef} src={currentSong.audioPath} />
      <Box>
        <Box
          sx={{
            height: '250vh',
            width: 'auto',
            maxHeight: 250,
            overflow: 'hidden',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%">
            <image
              xlinkHref={currentSong.imagePath}
              height="100%"
              width="100%"
            />
            <title>
              Image for {currentSong.name} by {currentSong.artist}
            </title>
          </svg>
        </Box>
        <Typography fontSize={22} sx={{ marginTop: '6px' }}>
          {currentSong.name}
        </Typography>
        <Typography fontSize={16}>{currentSong.artist}</Typography>
        <Box display="flex" justifyContent="center">
          <Slider
            sx={{ maxWidth: '320px', width: '80vw' }}
            value={currentSongState.currentTime}
            max={currentSong.totalDuration}
            onChange={(event, newValue) => {
              const audio = audioRef.current
              if (!audio) return
              if (Number(newValue) < currentSongState.currentTime) {
                dispatch(
                  rewindSong(currentSongState.currentTime - Number(newValue)),
                )
              } else {
                dispatch(
                  fastForwardSong(
                    Number(newValue) - currentSongState.currentTime,
                  ),
                )
              }
              audio.currentTime = Number(newValue)
            }}
            aria-label="trackbar"
          />
        </Box>
        <Box display="flex" justifyContent="center">
          <IconButton
            size="medium"
            onClick={toggleLoopModes}
            aria-label="loop-or-loop-one"
          >
            {!isLoop && !isLoopOne ? (
              <RepeatIcon style={{ fontSize: '1.8rem' }} />
            ) : isLoop ? (
              <RepeatOnIcon style={{ fontSize: '1.8rem' }} />
            ) : (
              <RepeatOneOnIcon style={{ fontSize: '1.8rem' }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              if (currentSongState.currentTime > 1) {
                dispatch(restartSong())
              } else {
                dispatch(playPreviousSong())
                dispatch(restartSong())
              }
            }}
            size="medium"
          >
            <SkipPreviousIcon style={{ fontSize: '1.8rem' }} />
          </IconButton>
          <IconButton
            size="medium"
            onClick={() => {
              if (currentSongState.playing) {
                dispatch(pauseSong())
              } else {
                dispatch(playSong())
              }
            }}
          >
            {!currentSongState.playing ? (
              <PlayArrowIcon style={{ fontSize: '1.8rem' }} />
            ) : (
              <PauseIcon style={{ fontSize: '1.8rem' }} />
            )}
          </IconButton>
          <IconButton
            onClick={() => {
              if (!isLoopOne && !isShuffle) {
                dispatch(playNextSong())
                dispatch(restartSong())
              } else {
                dispatch(
                  resetSongListShuffle(
                    songList.songs[songList.currentSongIndex + 1].id,
                  ),
                )
                dispatch(restartSong())
              }
            }}
            size="medium"
          >
            <SkipNextIcon style={{ fontSize: '1.8rem' }} />
          </IconButton>
          <IconButton size="medium" onClick={toggleShuffleMode}>
            {isShuffle ? (
              <ShuffleOnIcon style={{ fontSize: '1.8rem' }} />
            ) : (
              <ShuffleIcon style={{ fontSize: '1.8rem' }} />
            )}
          </IconButton>
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <List
          sx={{ width: '200vw', maxWidth: '500px' }}
          component="nav"
          aria-label="song-list"
        >
          {songList.songs.map((song: SongInfo) => (
            <ListItemButton
              key={`${song.id}`}
              selected={currentSong.id === song.id}
              onClick={() => changeSong(song.id)}
            >
              <ListItemIcon>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="50px"
                  width="50px"
                >
                  <image
                    xlinkHref={song.imagePath}
                    height="50px"
                    width="50px"
                  />
                </svg>
              </ListItemIcon>
              <ListItemText
                sx={{ marginLeft: '4px' }}
                primary={`${song.name} by ${song.artist}`}
              />
            </ListItemButton>
          ))}
        </List>
      </Box>
    </>
  )
}
