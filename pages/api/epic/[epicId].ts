// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import hostDinnerEpic from "../../../data/hostDinnerEpic"
import cleanRoomEpic from "../../../data/cleanRoomEpic"
import { Task } from '../../../utils/interfaces'

type Data = {
  name: string
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Task[]>
) {
  if(req.query.epicId === "example1"){
    res.status(200).json(hostDinnerEpic)
  }
  else if(req.query.epicId === "example2"){
    res.status(200).json(cleanRoomEpic)
  }
  else{
    res.status(404).json([])
  }
  
  return
}