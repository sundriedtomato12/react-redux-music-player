import { connect } from 'react-redux'
import { Typography, LinearProgress } from '@mui/material'

const TrackBar = ({
  duration,
  currentTime,
}: {
  duration: number
  currentTime: number
}) => {
  const calculatePercentage = () => {
    if (currentTime && duration) {
      return (currentTime / duration) * 100
    } else {
      return 0
    }
  }

  return (
    <div>
      <Typography>{formatTime(currentTime)}</Typography>
      <LinearProgress variant="determinate" value={calculatePercentage()} />
      <Typography>{formatTime(duration)}</Typography>
    </div>
  )
}

const formatTime = (timeInSeconds: number) => {
  const minutes = Math.floor(timeInSeconds / 60)
  const seconds = Math.floor(timeInSeconds % 60)
  return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`
}

const mapStateToProps = (state: any) => ({
  currentTime: state.musicPlayer.currentTime,
  duration: state.musicPlayer.duration,
})

export default connect(mapStateToProps)(TrackBar)
