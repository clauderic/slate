import { Schema } from '@slate-fork/slate'

const schema = Schema.create({
  blocks: {
    image: {
      isVoid: true,
    },
  },
  inlines: {
    emoji: {
      isVoid: true,
    },
  },
})

export default schema
