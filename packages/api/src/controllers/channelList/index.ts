import { Request, Response } from "express";
import { db } from "../../db";

export const getChannelList = async (_req: Request, res: Response) => {
  db.collection("Channel")
    .aggregate([
      {
        $lookup: {
          from: "TwitchLogin",
          localField: "_id",
          foreignField: "twitchID",
          as: "twitchLogin",
        },
      },
      {
        $unwind: {
          path: "$twitchLogin",
        },
      },
      {
        $project: {
          channelName: "$twitchLogin._id",
          emoteCount: {
            $size: "$emotes",
          },
          profileImageURL: "$profileImageURL",
        },
      },
    ])
    .toArray()
    .then((channelList) => res.json({ channelList }));
};