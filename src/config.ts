export const PORT = Number(process.env.PORT || 4000)

export const WEB_APP_URL = process.env.WEB_APP_URL || 'http://localhost:3000'

export const TWITTER_BEARER_TOKEN = process.env.TWITTER_BEARER_TOKEN as string

export const TWITTER_BASE_URL = 'https://api.twitter.com/2'

export const RAID_STREAM_RULES = {
  add: [
    { value: '参加者募集' }, 
    { value: 'I need backup!' }
  ]
}
