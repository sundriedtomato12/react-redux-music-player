import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useAppDispatch, useAppSelector } from '../../hooks'
import {
  songListSlice,
  songPlayTimeSlice,
  shuffleStateSlice,
  loopStateSlice,
  loopOneStateSlice,
} from '../music-player/redux/musicPlayerSlice'
import { RootState } from '../../store'
import { Box } from '@mui/material'
import TrackBar from './components/TrackBar'

export const MusicPlayer = () => {
  const shuffleState = useSelector((state: RootState) => state.shuffleState)

  return (
    <Box>
      <p>{shuffleState.toString()}</p>
    </Box>
  )
}
