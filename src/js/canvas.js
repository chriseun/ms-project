import gsap from 'gsap'
import {
  isOnTopOfPlatform,
  collisionTop,
  isOnTopOfPlatformCircle,
  createImage,
  createImageAsync,
  hitBottomOfPlatform,
  hitSideOfPlatform,
  objectsTouch
} from './utils.js'

import platform from '../img/platform.png'
import hills from '../img/hills.png'
import background from '../img/background.png'
import platformSmallTall from '../img/platformSmallTall.png'
import block from '../img/block.png'
import blockTri from '../img/blockTri.png'

import mdPlatform from '../img/mdPlatform.png'
import lgPlatform from '../img/lgPlatform.png'
import tPlatform from '../img/tPlatform.png'
import xtPlatform from '../img/xtPlatform.png'
import flagPoleSprite from '../img/flagPole.png'


import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'

import spriteMarioRunLeft from '../img/spriteMarioRunLeft.png'
import spriteMarioRunRight from '../img/spriteMarioRunRight.png'
import spriteMarioStandLeft from '../img/spriteMarioStandLeft.png'
import spriteMarioStandRight from '../img/spriteMarioStandRight.png'

import spriteFireFlowerRunLeft from '../img/spriteFireFlowerRunLeft.png'
import spriteFireFlowerRunRight from '../img/spriteFireFlowerRunRight.png'
import spriteFireFlowerStandLeft from '../img/spriteFireFlowerStandLeft.png'
import spriteFireFlowerStandRight from '../img/spriteFireFlowerStandRight.png'


import spriteMarioJumpLeft from '../img/spriteMarioJumpLeft.png'
import spriteMarioJumpRight from '../img/spriteMarioJumpRight.png'

import spriteFireFlowerJumpLeft from '../img/spriteFireFlowerJumpLeft.png'
import spriteFireFlowerJumpRight from '../img/spriteFireFlowerJumpRight.png'

import spriteFireFlower from '../img/spriteFireFlower.png'

import spriteGoomba from '../img/spriteGoomba.png'
import {
  audio
} from './audio.js'
import {
  images
} from './images.js'
console.log(images)



const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576


let gravity = 1.5
class Player {
  constructor() {
    this.shooting = false
    this.speed = 10
    this.position = {
      x: 100,
      y: 100
    }
    this.velocity = {
      x: 0,
      y: 0
    }

    this.scale = 0.3
    this.width = 398 * this.scale
    this.height = 353 * this.scale

    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprites = {
      stand: {
        right: createImage(spriteMarioStandRight),
        left: createImage(spriteMarioStandLeft),
        fireFlower: {
          right: createImage(spriteFireFlowerStandRight),
          left: createImage(spriteFireFlowerStandLeft)
        }
      },
      run: {
        right: createImage(spriteMarioRunRight),
        left: createImage(spriteMarioRunLeft),
        fireFlower: {
          right: createImage(spriteFireFlowerRunRight),
          left: createImage(spriteFireFlowerRunLeft)
        }

      },
      jump: {
        right: createImage(spriteMarioJumpRight),
        left: createImage(spriteMarioJumpLeft),
        fireFlower: {
          right: createImage(spriteFireFlowerJumpRight),
          left: createImage(spriteFireFlowerJumpLeft)
        }

      },
      shoot: {
        fireFlower: {
          right: createImage(images.mario.shoot.fireFlower.right),
          left: createImage(images.mario.shoot.fireFlower.left)
        }
      }
    }

    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 398
    this.powerUps = {
      fireFlower: false
    }
    this.invincible = false
    this.opacity = 1
  }

  draw() {
    c.save(
      c.globalAlpha = this.opacity
    )
    //Opacity for Mario
    // c.fillStyle = 'rgba(255, 0, 0, 0.2)'
    c.fillStyle = 'rgba(0, 0, 0, 0)'
    c.fillRect(this.position.x, this.position.y, this.width, this.height)
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      this.currentCropWidth,
      353,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
    c.restore()
  }

  update() {
    this.frames++
    const {
      currentSprite,
      sprites
    } = this


    if (
      this.frames > 58 &&
      (currentSprite === sprites.stand.right ||
        currentSprite === sprites.stand.left ||
        currentSprite === sprites.stand.fireFlower.right ||
        currentSprite === sprites.stand.fireFlower.left)
    )
      this.frames = 0
    else if (
      this.frames > 28 &&
      (currentSprite === sprites.run.right ||
        currentSprite === sprites.run.left ||
        currentSprite === sprites.run.fireFlower.right ||
        currentSprite === sprites.run.fireFlower.left)
    )
      this.frames = 0
    else if (
      (currentSprite === sprites.jump.right ||
        currentSprite === sprites.jump.left ||
        currentSprite === sprites.jump.fireFlower.right ||
        currentSprite === sprites.jump.fireFlower.left ||
        currentSprite === sprites.shoot.fireFlower.left ||
        currentSprite === sprites.shoot.fireFlower.right
      )
    )
      this.frames = 0


    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity
    }
    if (this.invincible) {
      if (this.opacity === 1) this.opacity = 0
      else this.opacity = 1
    } else this.opacity = 1
    // else {
    //   this.velocity.y = 0
    // }
  }
}

class Platform {
  constructor({
    x,
    y,
    image,
    block,
    text
  }) {
    this.position = {
      x,
      y
    }

    this.velocity = {
      x: 0
    }

    this.image = image
    this.width = image.width
    this.height = image.height
    this.block = block
    this.text = text


  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
    if (this.text) {
      c.font = '20px Arial'
      c.fillStyle = 'red'
      c.fillText(this.text, this.position.x, this.position.y)
    }
    // c.fillStyle = 'blue'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
  }


}

class GenericObject {
  constructor({
    x,
    y,
    image
  }) {
    this.position = {
      x,
      y
    }

    this.velocity = {
      x: 0
    }

    this.image = image
    this.width = image.width
    this.height = image.height


  }
  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)

    //c.fillStyle = 'blue'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)
  }

  update() {
    this.draw()
    this.position.x += this.velocity.x
  }
}


//enemy
class Goomba {
  constructor({
    position,
    velocity,
    distance = {
      limit: 50,
      traveled: 0
    }
  }) {
    this.position = {
      x: position.x,
      y: position.y,
    }

    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }

    this.width = 43.33
    this.height = 50

    this.image = createImage(spriteGoomba)
    this.frames = 0

    this.distance = distance
  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.drawImage(
      this.image,
      130 * this.frames,
      0,
      130,
      150,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
  update() {
    this.frames++
    if (this.frames >= 58) this.frames = 0
    this.draw()

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity

      // walk the goomba back and forth
      this.distance.traveled += Math.abs(this.velocity.x)

      if (this.distance.traveled > this.distance.limit) {
        this.distance.traveled = 0
        this.velocity.x = -this.velocity.x
      }
      // console.log(this.distance.traveled)
    }
  }

}


class FireFlower {
  constructor({
    position,
    velocity
  }) {
    this.position = {
      x: position.x,
      y: position.y
    }

    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }

    this.width = 56
    this.height = 60

    this.image = createImage(spriteFireFlower)
    this.frames = 0


  }

  draw() {
    // c.fillStyle = 'red'
    // c.fillRect(this.position.x, this.position.y, this.width, this.height)

    c.drawImage(
      this.image,
      56 * this.frames,
      0,
      56,
      60,
      this.position.x,
      this.position.y,
      this.width,
      this.height
    )
  }
  update() {
    this.frames++
    if (this.frames >= 75) this.frames = 0
    this.draw()

    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.height + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity


    }
  }

}


class Particle {
  constructor({
    position,
    velocity,
    radius,
    color = '#654428',
    fireball = false,
    fades = false
  }) {
    this.position = {
      x: position.x,
      y: position.y
    }
    this.velocity = {
      x: velocity.x,
      y: velocity.y
    }

    this.radius = radius
    //time to live -ttl
    this.ttl = 300
    this.color = color
    this.fireball = fireball
    this.opacity = 1
    this.fades = fades
  }

  draw() {
    c.save()
    c.globalAlpha = this.opacity
    c.beginPath()
    c.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false)
    c.fillStyle = this.color
    c.fill()
    c.closePath()
    c.restore()
  }

  update() {
    this.ttl--
    this.draw()
    this.position.x += this.velocity.x
    this.position.y += this.velocity.y

    if (this.position.y + this.radius + this.velocity.y <= canvas.height) {
      this.velocity.y += gravity * 0.4

      if (this.fades && this.opacity > 0) {
        this.opacity -= 0.01
      }

      if (this.opacity < 0) this.opacity = 0
    }
  }
}




let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)
let blockTriImage
let blockImage
let lgPlatformImage
let tPlatformImage
let xtPlatformImage

let player = new Player()
let platforms = []
let GenericObjects = []
let goombas = []
let particles = []
let fireFlowers = []

let lastKey
let keys

let scrollOffset
let flagPole
let flagPoleImage
let game
let currentLevel = 1

// win condition
// if (platformImage && scrollOffset + 400 + player.width > 6968 + 300) {
//   console.log('you win')
// }

//level switch function
function selectLevel(currentLevel) {

  switch (currentLevel) {
    case 1:
      init()
      break
    case 2:
      initLevel2()
      audio.musicLevel1.stop()
      // if (!audio.musicLevel1.playing()) audio.musicLevel2.play()
      // audio.musicLevel2.autoplay = true
      audio.musicLevel2.play()
      break
    case 3:
      initLevel3()
      audio.musicLevel3.play()
      break

    case 4:
      initLevel4()
      audio.musicLevel4.play()

      break
    case 5:
      initLevel5()
      audio.musicLevel5.play()

      break
    case 6:
      audio.musicLevel5.stop()
      // audio.musicLevelOutro.play()
      setTimeout(() => {
        audio.musicLevelOutro.play()
      }, 3000)

      break
  }
}

async function init() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }
  platformImage = await createImageAsync(platform)
  platformSmallTallImage = await createImageAsync(platformSmallTall)
  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  lgPlatformImage = await createImageAsync(lgPlatform)
  tPlatformImage = await createImageAsync(tPlatform)
  xtPlatformImage = await createImageAsync(xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  flagPole = new GenericObject({
    // x: 500,
    x: 6968 + 600,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 400,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ]

  player = new Player()

  const goombaWidth = 43.33
  goombas = [
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3249 + lgPlatformImage.width - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5135 + xtPlatformImage.width / 2 + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6968,
        y: 0,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    })

  ]

  particles = []

  platforms = [
    new Platform({
      x: 908 + 100,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 908 + 100 + blockImage.width,
      y: 100,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 1991 + lgPlatformImage.width - tPlatformImage.width,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height,
      image: tPlatformImage,
      block: false
    }),
    new Platform({
      x: 1991 + lgPlatformImage.width - tPlatformImage.width - 100,
      y: canvas.height - lgPlatformImage.height - tPlatformImage.height + blockImage.height,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 5712 + xtPlatformImage.width + 175,
      y: canvas.height - xtPlatformImage.height,
      image: blockImage,
      block: true,
      text: 5712 + xtPlatformImage.width + 175
    }),
    new Platform({
      x: 6116 + 175,
      y: canvas.height - xtPlatformImage.height,
      image: blockImage,
      block: true,

    }),
    new Platform({
      x: 6116 + 175 * 2,
      y: canvas.height - xtPlatformImage.height,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 6116 + 175 * 3,
      y: canvas.height - xtPlatformImage.height - 100,
      image: blockImage,
      block: true,
    }),
    new Platform({
      x: 6116 + 175 * 4,
      y: canvas.height - xtPlatformImage.height - 175,
      image: blockTriImage,
      block: true,
    }),
    new Platform({
      x: 6116 + 175 * 4 + blockTriImage.width,
      y: canvas.height - xtPlatformImage.height - 175,
      image: blockTriImage,
      block: true,
      text: 6116 + 175 * 4 + blockTriImage.width
    }),
    new Platform({
      x: 6968 + 300,
      y: canvas.height - lgPlatformImage.height,
      image: lgPlatformImage,
      block: true,
      text: 6968 + 300
    }),

  ]

  GenericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(background)
    }),
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(hills)
    })
  ]


  scrollOffset = 0

  const platformsMap = ['lg', 'lg', 'gap', 'lg', 'gap', 'gap', 'lg', 'gap', 't', 'gap', 'xt', 'gap', 'xt', 'gap', 'gap', 'xt']

  let platformDistance = 0

  platformsMap.forEach(symbol => {
    switch (symbol) {
      case 'lg':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += lgPlatformImage.width - 2

        break

      case 'gap':
        platformDistance += 175

        break;

      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }))

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += xtPlatformImage.width - 2

        break
    }
  })
}

async function initLevel2() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }

  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  lgPlatformImage = await createImageAsync(images.levels[2].lgPlatform)
  tPlatformImage = await createImageAsync(tPlatform)
  xtPlatformImage = await createImageAsync(xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  const mountains = await createImageAsync(images.levels[2].mountains)
  const mdPlatformImage = await createImageAsync(images.levels[2].mdPlatform)
  flagPole = new GenericObject({
    // x: 500,
    x: 7680,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 4734 - 28,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ]

  player = new Player()

  const goombaWidth = 43.33
  goombas = [
    new Goomba({
      // single block goomba
      position: {
        x: 903 + mdPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -2,
        y: 0
      },
      distance: {
        limit: 700,
        traveled: 0
      }
    }),
    new Goomba({
      // single block goomba
      position: {
        x: 1878 +
          lgPlatformImage.width +
          155 +
          200 +
          200 +
          200 +
          blockImage.width / 2 -
          goombaWidth / 2,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      },
      distance: {
        limit: 0,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3831 + lgPlatformImage.width - goombaWidth,
        y: 100
      },
      velocity: {
        x: -1,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    }),

    new Goomba({
      position: {
        x: 4734,
        y: 100
      },
      velocity: {
        x: 1,
        y: 0
      },
      distance: {
        limit: lgPlatformImage.width - goombaWidth,
        traveled: 0
      }
    })

  ]

  particles = []

  platforms = [
    new Platform({
      x: 903 + mdPlatformImage.width + 115,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 903 + mdPlatformImage.width + 115 + blockTriImage.width,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 1878 + lgPlatformImage.width + 175,
      y: 360,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 1878 + lgPlatformImage.width + 155 + 200,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 1878 + lgPlatformImage.width + 155 + 200 + 200,
      y: 330,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 1878 + lgPlatformImage.width + 155 + 200 + 200 + 200,
      y: 240,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 4734 - mdPlatformImage.width / 2,
      y: canvas.height - lgPlatformImage.height - mdPlatformImage.height,
      image: mdPlatformImage
    }),
    new Platform({
      x: 5987,
      y: canvas.height - lgPlatformImage.height - mdPlatformImage.height,
      image: mdPlatformImage
    }),
    new Platform({
      x: 5987,
      y: canvas.height - lgPlatformImage.height - mdPlatformImage.height * 2,
      image: mdPlatformImage
    }),
    new Platform({
      x: 6787,
      y: canvas.height - lgPlatformImage.height - mdPlatformImage.height,
      image: mdPlatformImage
    }),
    new Platform({
      x: 6787,
      y: canvas.height - lgPlatformImage.height - mdPlatformImage.height * 2,
      image: mdPlatformImage
    }),
    new Platform({
      x: 6787,
      y: canvas.height - lgPlatformImage.height - mdPlatformImage.height * 3,
      image: mdPlatformImage
    })

  ]

  GenericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[2].background)
    }),
    new GenericObject({
      x: -1,
      y: canvas.height - mountains.height,
      image: mountains
    })
  ]


  scrollOffset = 0

  const platformsMap = [
    'lg',
    'md',
    'gap',
    'gap',
    'gap',
    'lg',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg',
    'lg',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'lg'
  ]

  let platformDistance = 0

  platformsMap.forEach((symbol) => {
    switch (symbol) {
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += mdPlatformImage.width - 3

        break


      case 'lg':
        platforms.push(new Platform({
          x: platformDistance - 2,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += lgPlatformImage.width - 3

        break

      case 'gap':
        platformDistance += 175

        break;

      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }))

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += xtPlatformImage.width - 2

        break
    }
  })
}

async function initLevel3() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }

  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  // mdPlatformImage = await createImageAsync(images.levels[3].mdPlatform)
  lgPlatformImage = await createImageAsync(images.levels[3].lgPlatform)
  tPlatformImage = await createImageAsync(images.levels[3].tPlatform)
  xtPlatformImage = await createImageAsync(images.levels[3].xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  // const mountains = await createImageAsync(images.levels[2].mountains)
  const mdPlatformImage = await createImageAsync(images.levels[3].mdPlatform)
  flagPole = new GenericObject({
    // x: 500,
    x: 7700,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 4734 - 28,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ]

  player = new Player()

  const goombaWidth = 43.33
  goombas = [
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 3249 + lgPlatformImage.width - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),

    new Goomba({
      position: {
        x: 5135 + xtPlatformImage.width / 2 + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5135 + xtPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5135 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6968,
        y: 0,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    })



  ]

  particles = []

  platforms = [
    new Platform({
      x: 500 + mdPlatformImage.width + 115,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 1400 + mdPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 2300 + mdPlatformImage.width + 115 + blockImage.width,
      y: 25,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 3031 + xtPlatformImage.width + 115 + blockImage.width,
      y: 100,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 3031 + xtPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + xtPlatformImage.width * 2 + blockImage.width * 2,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + lgPlatformImage.width + 115 + blockImage.width * 3,
      y: 500,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + mdPlatformImage.width + 115 + blockImage.width * 5,
      y: 400,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 6189 + lgPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockTriImage,
      block: true
    }),

  ]

  GenericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[3].background)
    }),


    new GenericObject({
      x: 300,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 700,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 780,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 1300,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 1600,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 1680,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 2220,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 2300,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 2800,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 3500,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 3580,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 4000,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 4400,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 4480,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 5000,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),
    new GenericObject({
      x: 5500,
      y: 200,
      image: createImage(images.levels[3].hills)
    }),



  ]


  scrollOffset = 0

  const platformsMap = [
    'md',
    'gap',
    'md',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'xt',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'md',
    'gap',
    'lg',
    'gap',
    'lg',
    'gap',
    'gap',
    'gap',
    'lg'
  ]

  let platformDistance = 0

  platformsMap.forEach((symbol) => {

    switch (symbol) {
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += mdPlatformImage.width - 3

        break
      case 'gap':
        platformDistance += 175

        break;

      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }))

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += xtPlatformImage.width - 2

        break

      case 'lg':
        platforms.push(new Platform({
          x: platformDistance - 2,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += lgPlatformImage.width - 3

        break



    }
  })
}


async function initLevel4() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }

  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  // mdPlatformImage = await createImageAsync(images.levels[3].mdPlatform)
  lgPlatformImage = await createImageAsync(images.levels[4].lgPlatform)
  tPlatformImage = await createImageAsync(images.levels[4].tPlatform)
  xtPlatformImage = await createImageAsync(images.levels[4].xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  // const mountains = await createImageAsync(images.levels[2].mountains)
  const mdPlatformImage = await createImageAsync(images.levels[4].mdPlatform)
  flagPole = new GenericObject({
    // x: 500,
    x: 7700,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 4734 - 28,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ]

  player = new Player()

  const goombaWidth = 43.33
  goombas = [
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4400 + xtPlatformImage.width / 2 + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),

    new Goomba({
      position: {
        x: 5135 + xtPlatformImage.width / 2 + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5135 + xtPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5135 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5650 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5800 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6000 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6300 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6968,
        y: 0,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    })



  ]

  particles = []

  platforms = [
    new Platform({
      x: 500 + mdPlatformImage.width + 115,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 1400 + mdPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 2300 + mdPlatformImage.width + 115 + blockImage.width,
      y: 25,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 3031 + xtPlatformImage.width + 115 + blockImage.width,
      y: 100,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 3031 + xtPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + xtPlatformImage.width * 2 + blockImage.width * 2,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + lgPlatformImage.width + 115 + blockImage.width * 3,
      y: 500,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + mdPlatformImage.width + 115 + blockImage.width * 5,
      y: 400,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 4000 + lgPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 4400 + lgPlatformImage.width + 115 + blockImage.width,
      y: 200,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 4650 + lgPlatformImage.width + 115 + blockImage.width,
      y: 500,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 6000 + lgPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 6189 + lgPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockTriImage,
      block: true
    })


  ]

  GenericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[4].background)
    }),


    new GenericObject({
      x: 300,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 700,
      y: 300,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 780,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 1300,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 1600,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 1680,
      y: 300,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 2220,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 2300,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 2800,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 3500,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 3580,
      y: 300,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 4000,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 4400,
      y: 300,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 4480,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 5000,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),
    new GenericObject({
      x: 5500,
      y: 200,
      image: createImage(images.levels[4].tree)
    }),



  ]


  scrollOffset = 0

  const platformsMap = [
    'md',
    'gap',
    'md',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'xt',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg'
  ]

  let platformDistance = 0

  platformsMap.forEach((symbol) => {

    switch (symbol) {
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += mdPlatformImage.width - 3

        break
      case 'gap':
        platformDistance += 175

        break;

      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }))

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += xtPlatformImage.width - 2

        break

      case 'lg':
        platforms.push(new Platform({
          x: platformDistance - 2,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += lgPlatformImage.width - 3

        break



    }
  })
}



async function initLevel5() {
  player = new Player()
  keys = {
    right: {
      pressed: false
    },
    left: {
      pressed: false
    }
  }
  scrollOffset = 0

  game = {
    disableUserInput: false
  }

  blockTriImage = await createImageAsync(blockTri)
  blockImage = await createImageAsync(block)
  // mdPlatformImage = await createImageAsync(images.levels[3].mdPlatform)
  lgPlatformImage = await createImageAsync(images.levels[5].lgPlatform)
  tPlatformImage = await createImageAsync(images.levels[5].tPlatform)
  xtPlatformImage = await createImageAsync(images.levels[5].xtPlatform)
  flagPoleImage = await createImageAsync(flagPoleSprite)

  // const mountains = await createImageAsync(images.levels[2].mountains)
  const mdPlatformImage = await createImageAsync(images.levels[5].mdPlatform)
  flagPole = new GenericObject({
    // x: 500,
    x: 7700,
    y: canvas.height - lgPlatformImage.height - flagPoleImage.height,
    image: flagPoleImage
  })

  fireFlowers = [
    new FireFlower({
      position: {
        x: 4734 - 28,
        y: 100
      },
      velocity: {
        x: 0,
        y: 0
      }
    })
  ]

  player = new Player()

  const goombaWidth = 43.33
  goombas = [
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 908 + lgPlatformImage.width - goombaWidth - goombaWidth - goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 400,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 4400 + xtPlatformImage.width / 2 + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),

    new Goomba({
      position: {
        x: 5135 + xtPlatformImage.width / 2 + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5135 + xtPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5135 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5650 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 5800 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6000 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6300 + mdPlatformImage.width + goombaWidth,
        y: 100,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    }),
    new Goomba({
      position: {
        x: 6968,
        y: 0,
      },
      velocity: {
        x: -0.3,
        y: 0,
      },
      distance: {
        limit: 100,
        traveled: 0
      }
    })



  ]

  particles = []

  platforms = [
    new Platform({
      x: 500 + mdPlatformImage.width + 115,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 1400 + mdPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 2300 + mdPlatformImage.width + 115 + blockImage.width,
      y: 25,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 3031 + xtPlatformImage.width + 115 + blockImage.width,
      y: 100,
      image: blockImage,
      block: true
    }),

    new Platform({
      x: 3031 + xtPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + xtPlatformImage.width * 2 + blockImage.width * 2,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + lgPlatformImage.width + 115 + blockImage.width * 3,
      y: 500,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 3031 + mdPlatformImage.width + 115 + blockImage.width * 5,
      y: 400,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 4000 + lgPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockTriImage,
      block: true
    }),
    new Platform({
      x: 4400 + lgPlatformImage.width + 115 + blockImage.width,
      y: 200,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 4650 + lgPlatformImage.width + 115 + blockImage.width,
      y: 500,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 6000 + lgPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockImage,
      block: true
    }),
    new Platform({
      x: 6189 + lgPlatformImage.width + 115 + blockImage.width,
      y: 300,
      image: blockTriImage,
      block: true
    })


  ]

  GenericObjects = [
    new GenericObject({
      x: -1,
      y: -1,
      image: createImage(images.levels[5].background)
    }),


    new GenericObject({
      x: 300,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 700,
      y: 300,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 780,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 1300,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 1600,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 1680,
      y: 300,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 2220,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 2300,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 2800,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 3500,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 3580,
      y: 300,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 4000,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 4400,
      y: 300,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 4480,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 5000,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 5400,
      y: 200,
      image: createImage(images.levels[5].tree)
    }),
    new GenericObject({
      x: 5450,
      y: 225,
      image: createImage(images.levels[5].snowMan)
    }),



  ]


  scrollOffset = 0

  const platformsMap = [
    'md',
    'gap',
    'md',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'gap',
    'xt',
    'gap',
    't',
    'gap',
    'xt',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'md',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg',
    'gap',
    'gap',
    'gap',
    'gap',
    'lg'
  ]

  let platformDistance = 0

  platformsMap.forEach((symbol) => {

    switch (symbol) {
      case 'md':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - mdPlatformImage.height,
          image: mdPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += mdPlatformImage.width - 3

        break
      case 'gap':
        platformDistance += 175

        break;

      case 't':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - tPlatformImage.height,
          image: tPlatformImage,
          block: true
        }))

        platformDistance += tPlatformImage.width - 2

        break

      case 'xt':
        platforms.push(new Platform({
          x: platformDistance,
          y: canvas.height - xtPlatformImage.height,
          image: xtPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += xtPlatformImage.width - 2

        break

      case 'lg':
        platforms.push(new Platform({
          x: platformDistance - 2,
          y: canvas.height - lgPlatformImage.height,
          image: lgPlatformImage,
          block: true,
          text: platformDistance
        }))

        platformDistance += lgPlatformImage.width - 3

        break



    }
  })
}



function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)


  GenericObjects.forEach(GenericObject => {
    GenericObject.update()
    GenericObject.velocity.x = 0
  })

  particles.forEach((particle, i) => {
    particle.update()

    if (particle.fireball &&
      (particle.position.x - particle.radius >= canvas.width ||
        particle.position.x + particle.radius <= 0)
    )
      setTimeout(() => {
        particles.splice(i, 1)
      }, 0)
  })

  platforms.forEach((platform) => {
    platform.update()
    platform.velocity.x = 0
  })

  // mario touches flagpole
  if (flagPole) {
    flagPole.update()
    flagPole.velocity.x = 0

    //mario touches flagpole
    //win condition
    // complete level
    if (!game.disableUserInput &&
      objectsTouch({
        object1: player,
        object2: flagPole

      })) {
      audio.completeLevel.play()
      audio.musicLevel1.stop()
      audio.musicLevel2.stop()
      audio.musicLevel3.stop()
      audio.musicLevel4.stop()
      audio.musicLevel5.stop()

      game.disableUserInput = true
      player.velocity.x = 0
      player.velocity.y = 0
      gravity = 0

      player.currentSprite = player.sprites.stand.right
      console.log('you win!')

      if (player.powerUps.fireFlower)
        player.currentSprite = player.sprites.stand.fireFlower.right

      gsap.to(player.position, {
        y: canvas.height - lgPlatformImage.height - player.height,
        duration: 1,
        onComplete() {
          player.currentSprite = player.sprites.run.right

          if (player.powerUps.fireFlower)
            player.currentSprite = player.sprites.run.fireFlower.right
        }
      })

      //flagpole slide
      setTimeout(() => {
        audio.descend.play()
      }, 200)
      gsap.to(player.position, {
        delay: 1,
        x: canvas.width,
        duration: 2,
        ease: 'power1.in'
      })

      //fireworks
      const particleCount = 300
      const radians = Math.PI * 2 / particleCount
      const power = 8
      let increment = 1

      const intervalId = setInterval(() => {
        for (let i = 0; i < particleCount; i++) {
          particles.push(
            new Particle({
              position: {
                x: canvas.width / 4 * increment,
                y: canvas.height / 2
              },
              velocity: {
                x: Math.cos(radians * i) * power * Math.random(),
                y: Math.sin(radians * i) * power * Math.random()
              },
              radius: 3 * Math.random(),
              color: `hsl(${Math.random() * 200}, 50%, 50%)`,
              fades: true

            })
          )
        }

        audio.fireworkBurst.play()
        audio.fireworkWhistle.play()

        if (increment === 3) clearInterval(intervalId)
        increment++
      }, 1000)

      //switch to the next level
      setTimeout(() => {
        currentLevel++
        gravity = 1.5
        selectLevel(currentLevel)
      }, 8000)
    }
  }
  //mario obtains powerup
  fireFlowers.forEach((fireFlower, i) => {
    if (objectsTouch({
        object1: player,
        object2: fireFlower
      })) {
      audio.obtainPowerUp.play()
      player.powerUps.fireFlower = true
      setTimeout(() => {
        fireFlowers.splice(i, 1)
      }, 0)

    } else fireFlower.update()
  })



  goombas.forEach((goomba, index) => {
    goomba.update()

    //remove goomba on fireball hit
    particles.forEach((particle, particleIndex) => {
      if (
        particle.fireball &&
        particle.position.x + particle.radius >= goomba.position.x &&
        particle.position.y + particle.radius >= goomba.position.y &&
        particle.position.x - particle.radius <=
        goomba.position.x + goomba.width &&
        particle.position.y - particle.radius <=
        goomba.position.y + goomba.height
      ) {
        for (let i = 0; i < 50; i++) {
          particles.push(
            new Particle({
              position: {
                x: goomba.position.x + goomba.width / 2,
                y: goomba.position.y + goomba.height / 2
              },
              velocity: {
                x: (Math.random() - 0.5) * 7,
                y: (Math.random() - 0.5) * 15
              },
              radius: Math.random() * 3
            })
          )

        }
        setTimeout(() => {
          goombas.splice(index, 1)
          particles.splice(particleIndex, 1)
        }, 0)
      }
    })

    //goomba stomp squish //squash
    if (collisionTop({
        object1: player,
        object2: goomba
      })) {
      audio.goombaSquash.play()
      for (let i = 0; i < 50; i++) {
        particles.push(
          new Particle({
            position: {
              x: goomba.position.x + goomba.width / 2,
              y: goomba.position.y + goomba.height / 2,
            },
            velocity: {
              x: (Math.random() - 0.5) * 7,
              y: (Math.random() - 0.5) * 15
            },
            radius: Math.random() * 3
          })
        )
      }
      player.velocity.y -= 40
      setTimeout(() => {
        goombas.splice(index, 1)
      }, 0)
    } else if (
      player.position.x + player.width >= goomba.position.x &&
      player.position.y + player.height >= goomba.position.y &&
      player.position.x <= goomba.position.x + goomba.width
    ) {
      //player hits goomba
      //lose fireflower /lose powerups
      if (player.powerUps.fireFlower) {
        player.invincible = true
        player.powerUps.fireFlower = false
        audio.losePowerUp.play()

        setTimeout(() => {
          player.invincible = false
        }, 1000)
      } else if (!player.invincible) {
        audio.die.play()
        // selectLevel(currentLevel)
        init()
      }
    }
  })


  player.update()

  if (game.disableUserInput) return

  // scrolling code starts
  let hitSide = false

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  } else if ((keys.left.pressed && player.position.x > 100) || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
    player.velocity.x = -player.speed
  } else {

    player.velocity.x = 0

    //scrolling code
    if (keys.right.pressed) {

      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        platform.velocity.x = -player.speed

        if (platform.block && hitSideOfPlatform({
            object: player,
            platform
          })) {
          platforms.forEach((platform) => {
            platform.velocity.x = 0
          })

          hitSide = true
          break
        }
      }


      //scrolling code left and right
      if (!hitSide) {
        scrollOffset += player.speed
        flagPole.velocity.x = -player.speed

        GenericObjects.forEach(GenericObject => {
          GenericObject.velocity.x = -player.speed * 0.66
        })

        goombas.forEach((goomba) => {
          goomba.position.x -= player.speed
        })

        fireFlowers.forEach((fireFlower) => {
          fireFlower.position.x -= player.speed
        })

        particles.forEach((particle) => {
          particle.position.x -= player.speed
        })
      }

    } else if (keys.left.pressed && scrollOffset > 0) {


      for (let i = 0; i < platforms.length; i++) {
        const platform = platforms[i]
        platform.velocity.x = player.speed

        if (platform.block && hitSideOfPlatform({
            object: player,
            platform
          })) {
          platforms.forEach((platform) => {
            platform.velocity.x = 0
          })

          hitSide = true
          break
        }
      }

      if (!hitSide) {
        scrollOffset -= player.speed
        flagPole.velocity.x = player.speed

        GenericObjects.forEach(GenericObject => {
          GenericObject.velocity.x = player.speed * 0.66
        })

        goombas.forEach((goomba) => {
          goomba.position.x += player.speed
        })


        fireFlowers.forEach((fireFlower) => {
          fireFlower.position.x += player.speed
        })


        particles.forEach((particle) => {
          particle.position.x += player.speed
        })
      }
    }
  }

  // console.log(scrollOffset)

  //platform collision detection
  platforms.forEach((platform) => {
    if (
      isOnTopOfPlatform({
        object: player,
        platform: platform
      })
    ) {
      player.velocity.y = 0
    }

    if (platform.block && hitBottomOfPlatform({
        object: player,
        platform
      })) {
      player.velocity.y = -player.velocity.y
    }

    if (platform.block && hitSideOfPlatform({
        object: player,
        platform
      })) {
      player.velocity.x = 0
    }

    //particles bounce
    particles.forEach((particle, index) => {
      if (isOnTopOfPlatformCircle({
          object: particle,
          platform: platform
        })) {
        const bounce = 0.9
        particle.velocity.y = -particle.velocity.y * .99
        if (particle.radius - 0.4 < 0) {
          particles.splice(
            index, 1)
        } else
          particle.radius -= 0.4
      }

      if (particle.ttl < 0) particles.splice(index, 1)
    })


    goombas.forEach(goomba => {
      if (isOnTopOfPlatform({
          object: goomba,
          platform: platform
        }))
        goomba.velocity.y = 0
    })


    fireFlowers.forEach(fireFlower => {
      if (isOnTopOfPlatform({
          object: fireFlower,
          platform: platform
        }))
        fireFlower.velocity.y = 0
    })

  })




  //lose condition
  if (player.position.y > canvas.height) {
    audio.die.play()
    // selectLevel(1)
    init()
  }

  //sprite switching
  if (player.shooting) {
    player.currentSprite = player.sprites.shoot.fireFlower.right

    if (lastKey === 'left')
      player.currentSprite = player.sprites.shoot.fireFlower.left

    return
  }

  //sprite jump
  if (player.velocity.y !== 0) return

  if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right) {
    player.currentSprite = player.sprites.run.right
  } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left
  } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left
  } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right
  }

  //fireflower sprites
  if (!player.powerUps.fireFlower) return

  if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.fireFlower.right) {
    player.currentSprite = player.sprites.run.fireFlower.right
  } else if (keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.run.fireFlower.left) {
    player.currentSprite = player.sprites.run.fireFlower.left
  } else if (!keys.left.pressed && lastKey === 'left' && player.currentSprite !== player.sprites.stand.fireFlower.left) {
    player.currentSprite = player.sprites.stand.fireFlower.left
  } else if (!keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.stand.fireFlower.right) {
    player.currentSprite = player.sprites.stand.fireFlower.right
  }

}
//end animation loop

// selectLevel(5)
init()
// initLevel2()
animate()

window.addEventListener('keydown', ({
  keyCode
}) => {
  if (game.disableUserInput) return

  switch (keyCode) {
    case 65:
      console.log('left')
      keys.left.pressed = true;
      lastKey = 'left'
      break

    case 83:
      console.log('down')

      break
    case 68:
      console.log('right')
      keys.right.pressed = true;
      lastKey = 'right'
      break
    case 87:
      console.log('up')
      player.velocity.y -= 25

      audio.jump.play()

      if (lastKey === 'right')
        player.currentSprite = player.sprites.jump.right
      else
        player.currentSprite = player.sprites.jump.left


      if (!player.powerUps.fireFlower) break

      if (lastKey === 'right')
        player.currentSprite = player.sprites.jump.fireFlower.right
      else
        player.currentSprite = player.sprites.jump.fireFlower.left
      break

    case 32:
      console.log('space')

      if (!player.powerUps.fireFlower) return


      player.shooting = true

      setTimeout(() => {
        player.shooting = false
      }, 100)

      audio.fireFlowerShot.play()

      let velocity = 15
      if (lastKey === 'left') velocity = -velocity
      particles.push(new Particle({
        position: {
          x: player.position.x + player.width / 2,
          y: player.position.y + player.height / 2
        },
        velocity: {
          x: velocity,
          y: 0
        },
        radius: 7,
        color: 'red',
        fireball: true

      }))
      break

  }

})


window.addEventListener('keyup', ({
  keyCode
}) => {
  if (game.disableUserInput) return

  switch (keyCode) {
    case 65:
      console.log('left')
      keys.left.pressed = false;

      break

    case 83:
      console.log('down')

      break
    case 68:
      console.log('right')
      keys.right.pressed = false;

      // player.velocity.x = 0
      break
    case 87:
      console.log('up')

      break
  }

})
