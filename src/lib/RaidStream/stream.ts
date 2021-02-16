import socketio from "socket.io"
import { Readable } from "stream"

import api from "./api"

type Socket = socketio.Server

interface RawRaidData {
  id: string 
  text: string
  created_at: Date
}

interface RaidData {
  id: string
  raid_name: string
  code: string
  created_at: Date
}

interface RaidStreamResponse {
  data: RawRaidData
}

async function RaidStreamReconnect(stream: Readable, io: Socket) {
  stream.destroy()

  console.log("Trying to reconnect...")

  setTimeout(() => {
    RaidStreamStart(io)
    console.log("Reconnected!")
  }, 5000)
}

export async function RaidStreamStart(io: Socket) {
  try {
    const response = await api.get<Readable>('/tweets/search/stream?', {
      responseType: 'stream',
      params: {
        'tweet.fields': 'created_at'
      }
    })
    
    const stream = response.data

    stream.on('data', (rawData?: string) => {
      try {
        const raid = serializeRaidData(rawData as string)
        io.emit("raids", raid)
        console.log(raid)
      } catch (error) {}
    })

    stream.on('error', (err: Error) => {
      io.emit("raid_error", "Error on the stream")
      console.error(err.message, err.stack)
      RaidStreamReconnect(stream, io)
    })
  } catch (error) {
    io.emit("auth_error", error)
  }
}

function serializeRaidData(rawData: string) {
  const data = JSON.parse(rawData as string) as RaidStreamResponse
  const textSplitted = data.data.text.split('\n')
  const codeSearch = textSplitted[0].match('[A-Z0-9]{8}')
  const raid_name = textSplitted[2]
  
  if (codeSearch?.length === 1) {
    const code = codeSearch[0]
    const raid: RaidData = {
      id: data.data.id,
      raid_name,
      code,
      created_at: data.data.created_at
    }

    return raid
  } else {
    throw new Error()
  }
}