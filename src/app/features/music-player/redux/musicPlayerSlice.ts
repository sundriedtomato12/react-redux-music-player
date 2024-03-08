import { createSelector, type PayloadAction } from '@reduxjs/toolkit'
import type { AppThunk, RootState } from '../../../store'
import { createAppSlice } from '../../../createAppSlice'
import songLibrary from '../library.json'
import { useSelector } from 'react-redux'

export interface SongState {
  playing: boolean
  // time in seconds
  currentTime: number
}

export interface SongInfo {
  id: string
  name: string
  artist: string
  imagePath: string
  audioPath: string
  totalDuration: number
}

const initialShuffleState: boolean = false
const initialLoopState: boolean = false
const initialLoopOneState: boolean = false

const initialSongList: SongInfo[] = sortSongsAlphabetically(songLibrary)

const initialSongState: SongState = {
  playing: false,
  currentTime: 0,
}

function shuffleSongs(songs: SongInfo[]) {
  for (let i = songs.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const temp = songs[j]
    songs[j] = songs[i]
    songs[i] = temp
  }
  return songs
}

function sortSongsAlphabetically(songs: SongInfo[]) {
  return songs.sort((a, b) => {
    const nameA = a.name.toUpperCase()
    const nameB = b.name.toUpperCase()

    if (nameA < nameB) {
      return -1
    }
    if (nameA > nameB) {
      return 1
    }
    return 0
  })
}

export const songListSlice = createAppSlice({
  name: 'songList',
  initialState: {
    songs: initialSongList,
    currentSongIndex: 0,
  },
  reducers: create => ({
    // when user clicks on song from list
    resetSongList: create.reducer((state, action: PayloadAction<string>) => {
      // if shuffle toggle is OFF
      const songSelectedIndex = songLibrary.findIndex(
        song => song.id == action.payload,
      )
      return {
        songs: [
          ...songLibrary.slice(songSelectedIndex, songLibrary.length),
          ...songLibrary.slice(0, songSelectedIndex),
        ],
        currentSongIndex: 0,
      }
    }),
    resetSongListShuffle: create.reducer(
      (state, action: PayloadAction<string>) => {
        // else if shuffle toggle is ON
        const songSelectedIndex = songLibrary.findIndex(
          song => song.id == action.payload,
        )
        return {
          songs: [
            songLibrary[songSelectedIndex],
            ...shuffleSongs([
              ...songLibrary.filter(song => song.id !== action.payload),
            ]),
          ],
          currentSongIndex: 0,
        }
      },
    ),
    playNextSong: create.reducer(state => {
      const nextIndex = state.currentSongIndex + 1
      if (nextIndex < state.songs.length) {
        state.currentSongIndex = nextIndex
      } else {
        state.currentSongIndex = 0
      }
    }),
    playPreviousSong: create.reducer(state => {
      const prevIndex = state.currentSongIndex - 1
      if (prevIndex >= 0) {
        state.currentSongIndex = prevIndex
      } else {
        state.currentSongIndex = state.songs.length - 1
      }
    }),
  }),
  selectors: {
    selectCurrentSong: state => state.songs[state.currentSongIndex],
    peekQueue: createSelector(
      songList => songList,
      songList => songList.songs.slice(songList.currentSongIndex),
    ),
  },
})

export const shuffleStateSlice = createAppSlice({
  name: 'shuffleState',
  initialState: initialShuffleState,
  reducers: create => ({
    turnShuffleOff: create.reducer(() => false),
    turnShuffleOn: create.reducer(() => true),
  }),
})

export const loopStateSlice = createAppSlice({
  name: 'loopState',
  initialState: initialLoopState,
  reducers: create => ({
    turnLoopOff: create.reducer(() => false),
    turnLoopOn: create.reducer(() => true),
  }),
})

export const loopOneStateSlice = createAppSlice({
  name: 'loopOneState',
  initialState: initialLoopOneState,
  reducers: create => ({
    turnLoopOneOff: create.reducer(() => false),
    turnLoopOneOn: create.reducer(() => true),
  }),
})

export const songPlayTimeSlice = createAppSlice({
  name: 'songPlayState',
  initialState: initialSongState,
  reducers: create => ({
    playSong: create.reducer(state => {
      state.playing = true
      state.currentTime += 1
    }),
    pauseSong: create.reducer(state => {
      state.playing = false
    }),
    restartSong: create.reducer(state => {
      state.currentTime = 0
    }),
    fastForwardSong: create.reducer((state, action: PayloadAction<number>) => {
      state.currentTime += action.payload
    }),
    rewindSong: create.reducer((state, action: PayloadAction<number>) => {
      state.currentTime -= action.payload
    }),
  }),
})

export const {
  resetSongList,
  resetSongListShuffle,
  playNextSong,
  playPreviousSong,
} = songListSlice.actions

export const { selectCurrentSong, peekQueue } = songListSlice.selectors

export const { turnShuffleOff, turnShuffleOn } = shuffleStateSlice.actions

export const { turnLoopOff, turnLoopOn } = loopStateSlice.actions

export const { turnLoopOneOff, turnLoopOneOn } = loopOneStateSlice.actions

export const { playSong, pauseSong, restartSong, fastForwardSong, rewindSong } =
  songPlayTimeSlice.actions
