import {
  Howl
} from 'howler';
import audioCompleteLevel from '../audio/audioCompleteLevel.mp3'
import audioFireFlowerShot from '../audio/audioFireFlowerShot.mp3'
import audioDescend from '../audio/audioDescend.mp3'
import audioDie from '../audio/audioDie.mp3'
import audioFirerworkBurst from '../audio/audioFireworkBurst.mp3'
import audioFirerworkWhistle from '../audio/audioFireworkWhistle.mp3'
import audioGameOver from '../audio/audioGameOver.mp3'
import audioJump from '../audio/audioJump.mp3'
import audioLosePowerUp from '../audio/audioLosePowerUp.mp3'
import audioObtainPowerUp from '../audio/audioWinLevel.mp3'
import GoombaSquash from '../audio/GoombaSquash.mp3'

import audioMusicLevel1 from '../audio/audioMusicLevel1.mp3'
import audioMusicLevel2 from '../audio/audioMusicLevel2.mp3'
import audioMusicLevel3 from '../audio/audioMusicLevel3.mp3'
import audioMusicLevel4 from '../audio/audioMusicLevel4.mp3'
import audioMusicLevel5 from '../audio/audioMusicLevel5.mp3'
import audioOutro from '../audio/audioOutro.mp3'


export const audio = {
  completeLevel: new Howl({
    src: [audioCompleteLevel],
    volume: 0.1
  }),
  fireFlowerShot: new Howl({
    src: [audioFireFlowerShot],
    volume: 0.1
  }),
  descend: new Howl({
    src: [audioDescend],
    volume: 0.1
  }),
  die: new Howl({
    src: [audioDie],
    volume: 0.1
  }),
  fireworkBurst: new Howl({
    src: [audioFirerworkBurst],
    volume: 0.1
  }),
  fireworkWhistle: new Howl({
    src: [audioFirerworkWhistle],
    volume: 0.1
  }),
  gameOver: new Howl({
    src: [audioGameOver],
    volume: 0.1
  }),
  jump: new Howl({
    src: [audioJump],
    volume: 0.1
  }),
  losePowerUp: new Howl({
    src: [audioLosePowerUp],
    volume: 0.1
  }),
  obtainPowerUp: new Howl({
    src: [audioObtainPowerUp],
    volume: 0.1
  }),
  goombaSquash: new Howl({
    src: [GoombaSquash],
    volume: 0.1
  }),
  musicLevel1: new Howl({
    src: [audioMusicLevel1],
    volume: 0.1,
    loop: true,
    autoplay: true
  }),
  musicLevel2: new Howl({
    src: [audioMusicLevel2],
    volume: 0.1,
    loop: true,
    // autoplay: false

  }),
  musicLevel3: new Howl({
    src: [audioMusicLevel3],
    volume: 0.1,
    loop: true,
    // autoplay: false

  }),
  musicLevel4: new Howl({
    src: [audioMusicLevel4],
    volume: 0.1,
    loop: true,
    // autoplay: false

  }),
  musicLevel5: new Howl({
    src: [audioMusicLevel5],
    volume: 0.1,
    loop: true,
    // autoplay: false

  }),
  musicLevelOutro: new Howl({
    src: [audioOutro],
    volume: 0.1,
    loop: true,
    // autoplay: false
  })


}
