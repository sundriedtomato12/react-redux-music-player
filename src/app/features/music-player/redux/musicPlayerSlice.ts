import type { PayloadAction } from '@reduxjs/toolkit'
import type { AppThunk } from '../../../store'
import { createAppSlice } from '../../../createAppSlice'

export interface SongPlayTimeState {
  // time in seconds
  currentTime: number
  totalTime: number
}

export interface SongInfo {
  name: string
  artist: string
  imagePath: string
  audioPath: string
  totalDuration: number
}

const initialShuffleState: boolean = false
const initialLoopState: boolean = false
const initialLoopOneState: boolean = false

const initialSongList: SongInfo[] = [
  {
    name: 'Destination',
    artist: 'Crash Adams',
    imagePath: 'public/images/destination_by_crash_adams.svg',
    audioPath: 'public/audio/destination_by_crash_adams.mp3',
    totalDuration: 163,
  },
  {
    name: 'Feather',
    artist: 'Sabrina Carpenter',
    imagePath: 'public/images/feather_by_sabrina_carpenter.svg',
    audioPath: 'public/audio/feather_by_sabrina_carpenter.mp3',
    totalDuration: 185,
  },
  {
    name: 'Give Me A Kiss',
    artist: 'Crash Adams',
    imagePath: 'public/images/give_me_a_kiss_by_crash_adams.svg',
    audioPath: 'public/audio/give_me_a_kiss_by_crash_adams.mp3',
    totalDuration: 171,
  },
  {
    name: 'Good Side',
    artist: 'Crash Adams',
    imagePath: 'public/images/good_side_by_crash_adams.svg',
    audioPath: 'public/audio/good_side_by_crash_adams.mp3',
    totalDuration: 163,
  },
  {
    name: 'Vampire',
    artist: 'Olivia Rodrigo',
    imagePath: 'public/images/vampire_by_olivia_rodrigo.svg',
    audioPath: 'public/audio/vampire_by_olivia_rodrigo.mp3',
    totalDuration: 219,
  },
]

const initialSongState: SongPlayTimeState = {
  currentTime: 0,
  totalTime: 100,
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

export const songListSlice = createAppSlice({
  name: 'songList',
  initialState: initialSongList,
  reducers: create => ({
    // when user clicks on song from list
    reset: create.reducer((state, action: PayloadAction<SongInfo>) => {
      // if shuffle toggle is OFF
      return [
        action.payload,
        ...state.filter(song => song.name !== action.payload.name),
      ]
    }),
    resetShuffle: create.reducer((state, action: PayloadAction<SongInfo>) => {
      // else if shuffle toggle is ON
      return [
        action.payload,
        ...shuffleSongs(
          state.filter(song => song.name !== action.payload.name),
        ),
      ]
    }),
  }),
  selectors: {
    selectCurrentSongList: songList => songList,
    selectCurrentSong: songList => songList[0],
    selectNextSong: songList => songList[1],
    selectNextSongs: songList => songList.slice(1),
  },
})

export const shuffleStateSlice = createAppSlice({
  name: 'shuffleState',
  initialState: initialShuffleState,
  reducers: create => ({
    turnOff: create.reducer(() => false),
    turnOn: create.reducer(() => true),
  }),
})

export const loopStateSlice = createAppSlice({
  name: 'loopState',
  initialState: initialLoopState,
  reducers: create => ({
    turnOff: create.reducer(() => false),
    turnOn: create.reducer(() => true),
  }),
})

export const loopOneStateSlice = createAppSlice({
  name: 'loopOneState',
  initialState: initialLoopOneState,
  reducers: create => ({
    turnOff: create.reducer(() => false),
    turnOn: create.reducer(() => true),
  }),
})

export const songPlayTimeSlice = createAppSlice({
  name: 'songPlayTime',
  initialState: initialSongState,
  reducers: create => ({
    increase: create.reducer(state => {
      state.currentTime += 1
    }),
    increaseByAmount: create.reducer((state, action: PayloadAction<number>) => {
      state.currentTime += action.payload
    }),
    decreaseByAmount: create.reducer((state, action: PayloadAction<number>) => {
      state.currentTime -= action.payload
    }),
  }),
  selectors: {
    selectCurrentPlayTime: songPlayTime => songPlayTime.currentTime,
    selectSongFinishedStatus: songPlayTime =>
      songPlayTime.currentTime === songPlayTime.totalTime,
  },
})
