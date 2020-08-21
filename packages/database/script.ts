import { BuildModel } from "./models/build";

const MongoClient = require("mongodb");
require("dotenv").config({ path: "../../.env" });
const mongoose = require("mongoose");
const { Top500PlacementModel } = require("./models/top500Placement");
const { UserModel } = require("./models/user");

const uri = process.env.MONGODB_URI;
const oldUri = process.env.OLD_MONGODB_URI;

if (!uri || !oldUri) throw Error("No MongoDB URI set");

mongoose.connect(uri, { useNewUrlParser: true });

let db: any;

async function run() {
  MongoClient.connect(oldUri, { useUnifiedTopology: true }, async function (
    err: any,
    client: any
  ) {
    if (err) throw err;

    db = client.db("production");

    //await placements();
    //await users();
    await builds();

    process.exit(-1);
  });
}

async function placements() {
  const placements = await db.collection("placements").find({}).toArray();

  // @ts-ignore
  const newPlacements = placements.map(({ _id, ...p }) => {
    return {
      ...p,
      xPower: p.x_power,
      uniqueId: p.unique_id,
      mode: ["", "SZ", "TC", "RM", "CB"][p.mode],
    };
  });

  await Top500PlacementModel.insertMany(newPlacements);
  console.log("inserted placements:", newPlacements.length);
}

async function users() {
  const users = await db.collection("users").find({}).toArray();

  // @ts-ignore
  const newUsers = users.map((user) => {
    return {
      discord: {
        id: user.discord_id,
        username: user.username,
        discriminator: user.discriminator,
        avatar: user.avatar || undefined,
      },
      profile: {
        twitchName: user.twitch_name || undefined,
        twitterName: user.twitter_name || undefined,
        youtubeChannelId: user.youtube_id || undefined,
        countryCode: user.country ? user.country.toUpperCase() : undefined,
        sens: user.sens
          ? {
              stick: user.sens.stick ? user.sens.stick * 10 : undefined,
              motion: user.sens.motion ? user.sens.motion * 10 : undefined,
            }
          : undefined,
        weaponPool: user.weapons || undefined,
        bio: user.bio || undefined,
        customUrlEnding: user.custom_url || undefined,
      },
      /*plus: user.plus
        ? {
            membershipStatus: user.plus.membership_status,
            vouchStatus: user.plus_vouch_status,
            region: user.plus.plus_region,
            canVouch: user.plus.can_vouch,
            canVouchAgainAfter: user.plus.can_vouch_again_after,
          }
        : undefined,*/
    };
  });

  await UserModel.insertMany(newUsers);
  console.log("inserted users:", newUsers.length);
}

async function builds() {
  throw Error("updatedAt / createdAt");
  const users = await UserModel.find({});
  const builds = await db.collection("builds").find({}).toArray();

  // @ts-ignore
  const newBuilds = builds.map((build) => {
    const author = users.find(
      (user: any) => user.discord.id === build.discord_id
    )?._id;

    if (!author) throw Error(`No author found for ${build.discord_id}`);

    return {
      author,
      weapon: build.weapon,
      title: build.title || undefined,
      description: build.description || undefined,
      headAbilities: build.headgear,
      headGear: build.headgearItem || undefined,
      clothingAbilities: build.clothing,
      clothingGear: build.clothingItem || undefined,
      shoesAbilities: build.shoes,
      shoesGear: build.shoesItem || undefined,
      top500: build.top ?? false,
      jpn: build.jpn ?? false,
    };
  });

  await BuildModel.insertMany(newBuilds);
  console.log("inserted builds:", newBuilds.length);
}

run().catch(console.dir);

export {};
