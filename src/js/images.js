import backgroundLevel2 from '../img/level2/background.png'
import backgroundLevel3 from '../img/level3/background.png'
import backgroundLevel4 from '../img/level4/background.png'
import backgroundLevel5 from '../img/level5/background.png'

import mountains from '../img/level2/mountain.png'
import hills from '../img/level3/hills.png'
import tree from '../img/level4/tree.png'
import treeLevel5 from '../img/level5/tree.png'
import snowMan from '../img/level5/snowMan.png'

import lgPlatformLevel2 from '../img/level2/lgPlatform.png'
import lgPlatformLevel3 from '../img/level3/lgPlatform.png'
import lgPlatformLevel4 from '../img/level4/lgPlatform.png'
import lgPlatformLevel5 from '../img/level5/lgPlatform.png'

import mdPlatformLevel2 from '../img/level2/mdPlatform.png'
import mdPlatformLevel3 from '../img/level3/mdPlatform.png'
import mdPlatformLevel4 from '../img/level4/mdPlatform.png'
import mdPlatformLevel5 from '../img/level5/mdPlatform.png'

import tPlatformLevel3 from '../img/level3/tPlatform.png'
import tPlatformLevel4 from '../img/level4/tPlatform.png'
import tPlatformLevel5 from '../img/level5/tPlatform.png'


import xtPlatformLevel3 from '../img/level3/xtPlatform.png'
import xtPlatformLevel4 from '../img/level4/xtPlatform.png'
import xtPlatformLevel5 from '../img/level5/xtPlatform.png'


import spriteFireFlowerShootLeft from '../img/mario/spriteFireFlowerShootLeft.png'
import spriteFireFlowerShootRight from '../img/mario/spriteFireFlowerShootRight.png'

export const images = {
  mario: {
    shoot: {
      fireFlower: {
        right: spriteFireFlowerShootRight,
        left: spriteFireFlowerShootLeft
      }
    }
  },

  levels: {
    1: {

    },
    2: {
      background: backgroundLevel2,
      mountains,
      lgPlatform: lgPlatformLevel2,
      mdPlatform: mdPlatformLevel2
    },
    3: {
      background: backgroundLevel3,
      mdPlatform: mdPlatformLevel3,
      lgPlatform: lgPlatformLevel3,
      mdPlatform: mdPlatformLevel3,
      tPlatform: tPlatformLevel3,
      xtPlatform: xtPlatformLevel3,
      hills: hills
    },
    4: {
      background: backgroundLevel4,
      mdPlatform: mdPlatformLevel4,
      lgPlatform: lgPlatformLevel4,
      mdPlatform: mdPlatformLevel4,
      tPlatform: tPlatformLevel4,
      xtPlatform: xtPlatformLevel4,
      tree: tree
    },
    5: {
      background: backgroundLevel5,
      mdPlatform: mdPlatformLevel5,
      lgPlatform: lgPlatformLevel5,
      mdPlatform: mdPlatformLevel5,
      tPlatform: tPlatformLevel5,
      xtPlatform: xtPlatformLevel5,
      tree: treeLevel5,
      snowMan: snowMan
    }
  }

}
