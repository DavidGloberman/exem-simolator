import { ObjectId } from "mongoose";
import userModel from "../models/userModel";
import ErrorWithStatusCode from "../utils/errorTypes";
import organizationModel from "../models/organizationModel";
import AttackingMissileModel, {
  AttackingMissile,
  MissileStatus,
} from "../models/attackingMissileModel";
import missileModel, { Missile } from "../models/missileModel";

export interface AttackDto {
  attackerId: string | ObjectId;
  destination: string;
  attackerMissileTypeId: string;
}

export interface DefenderDto {
  defenderId: ObjectId;
  missileId: ObjectId;
  attackerMissileId: ObjectId;
}

let attackingMissiles: {
  missile: AttackingMissile;
  timer: NodeJS.Timeout;
  _id: ObjectId;
}[] = [];

export const attack = async ({
  attackerId,
  destination,
  attackerMissileTypeId: missileId,
}: AttackDto) => {
  if (!attackerId || !destination || !missileId)
    throw new ErrorWithStatusCode("missing fields", 400);

  const attackerDoc = userModel.findById(attackerId);
  if (!attackerDoc)
    throw new ErrorWithStatusCode("unable to find attacker", 400);

  const idfOrganizations = (await organizationModel.find())
    .filter((org) => org.name.startsWith("IDF"))
    .map((org) => org.name.slice(6));
  console.log(idfOrganizations);

  if (!idfOrganizations.includes(destination))
    throw new ErrorWithStatusCode("invalid destination", 400);

  return await launchMissile(attackerId, destination, missileId);
};

export const interceptMissile = async ({
  defenderId,
  missileId,
  attackerMissileId,
}: DefenderDto) => {
  const defender = await userModel.findById(defenderId);
  if (!defender) throw new ErrorWithStatusCode("defender not exist", 404);

  const attackerMissile = await AttackingMissileModel.findById(
    attackerMissileId
  );
  if (!attackerMissile)
    throw new ErrorWithStatusCode("attackerMissile not exist", 404);

  const defMissile = await missileModel.findById(missileId);
  if (!defMissile)
    throw new ErrorWithStatusCode("missile defender not found", 404);

  if (!defMissile.intercepts.includes(attackerMissile.missileId))
    throw new ErrorWithStatusCode(
      `missile:${defMissile.name} cannot intercept missile: ${attackerMissile.id}`,
      404
    );

  const attackInArray = await attackingMissiles.find(
    (att) => att._id == attackerMissileId
  );

  if (!attackInArray)
    throw new ErrorWithStatusCode(
      "missile already exploded or intercepted",
      404
    );

  clearTimeout(attackInArray.timer);

  const updated = await AttackingMissileModel.findOneAndUpdate(
    attackInArray._id,
    { status: MissileStatus.Intercepted },
    { new: true }
  );
  return updated;
};

const launchMissile = async (
  attackerId: ObjectId | string,
  destination: string,
  missileId: ObjectId | string
) => {
  const missileType = await missileModel.findById(missileId);
  if (!missileType) throw new ErrorWithStatusCode("unknown missile", 400);

  const eta = new Date();
  eta.setSeconds(eta.getSeconds() + missileType.speed);

  const launched = await AttackingMissileModel.create({
    attackerId,
    missileId,
    destination,
    status: MissileStatus.Launched,
    eta: eta,
  });

  const timer = await SetExplosionTimer(missileType.speed, launched.id);

  attackingMissiles.push({
    missile: launched,
    timer,
    _id: launched._id,
  });

  return launched;
};

const SetExplosionTimer = async (timeout: number, id: string) => {
  return setTimeout(async () => {
    attackingMissiles = attackingMissiles.filter(
      (att) => att._id.toString() !== id.toString()
    );
    const missile = await AttackingMissileModel.findByIdAndUpdate(id, {
      status: MissileStatus.Hit,
    });

    await missile?.save();
  }, timeout * 1000);
};
